const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
var SpotifyWebApi = require('spotify-web-api-node');

function getDataFromJsonFile(filePath) {
  const fullPath = path.join(__dirname, filePath);
  const rawData = fs.readFileSync(fullPath);
  return JSON.parse(rawData);
}

const airlines = getDataFromJsonFile('airlines.json');
const cities = getDataFromJsonFile('cities.json');
const info = getDataFromJsonFile('info.json');

const clientId = '035eac89722942ebb4b83ab2882308c2';
const clientSecret = 'bf11fad4440c40c09c467ea5611ddf21';
const redirectUri = 'http://localhost:8080/callback';

// Create the api object with the credentials
var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret,
  redirectUri: redirectUri
});

// Rotta per iniziare il processo di autenticazione
app.get('/login', (req, res) => {
  const scopes = ['user-read-playback-state'];
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

// Rotta di callback dopo l'autenticazione
app.get('/callback', (req, res) => {
  const error = req.query.error;
  const code = req.query.code;

  if (error) {
    console.error('Callback Error:', error);
    res.send(`Callback Error: ${error}`);
    return;
  }

  spotifyApi.authorizationCodeGrant(code).then(
    data => {
      const access_token = data.body['access_token'];

      spotifyApi.setAccessToken(access_token);

      res.redirect('/');
    },
    err => {
      console.error('Error getting Tokens:', err);
      res.send(`Error getting Tokens: ${err}`);
    }
  );
});

app.get('/now-playing', (req, res) => {
  spotifyApi.getMyCurrentPlaybackState().then(
    data => {
      if (data.body && data.body.is_playing) {
        const track = data.body.item;
        res.json({
          isPlaying: true,
          trackName: track.name,
          artistName: track.artists.map(artist => artist.name).join(', '),
          albumArt: track.album.images[0].url
        });
      } else {
        res.json({ isPlaying: false });
      }
    },
    err => {
      console.log('Something went wrong!', err);
      res.status(500).json({ error: err.message });
    }
  );
});

app.get('/api/info', (req, res) => {
  res.json(info); 
});

app.get('/api/listino', (req, res) => {
  let r = {
    data: []
  };
  
  const minLength = Math.min(airlines.length, cities.length);
  
  for (let i = 0; i < minLength; i++) {
    let data = {
      city: cities[i],
      scheduled: airlines[i]
    };
    r.data.push(data);
  }

  res.json(r);
});

// Static Files
app.use('/', express.static(path.join(__dirname, 'public')));

// Server Setup
const port = process.env.PORT || 8080;
app.listen(port, function () {
  console.log(`App listening on port ${port}!`);
});