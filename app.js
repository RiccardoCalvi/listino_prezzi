const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
var SpotifyWebApi = require('spotify-web-api-node');

var credentials = null;

if (fs.existsSync('credentials.json')) {
  const rawData = fs.readFileSync('credentials.json');
  credentials = JSON.parse(rawData);
} else {
  console.error('Il file credentials.json non esiste.');
}

const airlines = getDataFromJsonFile('airlines.json');
const cities = getDataFromJsonFile('cities.json');
const info = getDataFromJsonFile('info.json');

const clientId = credentials.clientId
const clientSecret = credentials.clientSecret;
const redirectUri = 'http://localhost:8080/callback';

let refreshToken;
let expirationTime;

function getDataFromJsonFile(filePath) {
  const fullPath = path.join(__dirname, filePath);
  const rawData = fs.readFileSync(fullPath);
  return JSON.parse(rawData);
}

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
      const accessToken = data.body['access_token'];
      refreshToken = data.body['refresh_token'];
      const expiresIn = data.body['expires_in'];

      spotifyApi.setAccessToken(accessToken);
      spotifyApi.setRefreshToken(refreshToken);

      // Salva il tempo di scadenza del token
      expirationTime = new Date().getTime() + expiresIn * 1000;

      // Avvia il controllo periodico per il refresh del token
      periodicallyRefreshToken();

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


function periodicallyRefreshToken() {
  const now = new Date().getTime();

  // Calcola il tempo rimanente prima della scadenza del token
  const delay = expirationTime - now - 5 * 60 * 1000; // Refresh 5 minuti prima della scadenza

  if (delay > 0) {
    setTimeout(() => {
      spotifyApi.refreshAccessToken().then(
        data => {
          spotifyApi.setAccessToken(data.body['access_token']);

          // Aggiorna il tempo di scadenza con il nuovo token
          expirationTime = new Date().getTime() + data.body['expires_in'] * 1000;

          console.log('Il token di accesso è stato refreshato e il nuovo tempo di scadenza è stato salvato.');

          // Ripeti il controllo per il prossimo refresh
          periodicallyRefreshToken();
        },
        err => {
          console.log('Errore durante il refresh del token di accesso', err);
        }
      );
    }, delay);
  } else {
    // Se il token è già scaduto, esegue il refresh immediatamente
    spotifyApi.refreshAccessToken().then(
      data => {
        spotifyApi.setAccessToken(data.body['access_token']);
        expirationTime = new Date().getTime() + data.body['expires_in'] * 1000;

        console.log('Il token di accesso è stato refreshato e il nuovo tempo di scadenza è stato salvato.');

        periodicallyRefreshToken();
      },
      err => {
        console.log('Errore durante il refresh del token di accesso', err);
      }
    );
  }
}



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
app.use('/tv', express.static(path.join(__dirname, 'public/tv.html')));

// Server Setup
const port = process.env.PORT || 8080;
app.listen(port, function () {
  console.log(`App listening on port ${port}!`);
});