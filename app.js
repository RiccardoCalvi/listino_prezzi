/* global require console process Promise module */

const express = require('express');
const app = express();
const fs = require('fs');

function getDataFromJsonFile(filePath) {
  const rawData = fs.readFileSync(filePath);
  return JSON.parse(rawData);
}

const airlines = getDataFromJsonFile('airlines.json');
const cities = getDataFromJsonFile('cities.json');

// ========================================================================
// API

app.use('/api/listino', (req, res) => {
  let r = {
    data: []
  };

  const minLength = Math.min(airlines.length, cities.length);

  for (let i = 0; i < minLength; i++) {
    // Create the data for a row.
    let data = {
      city: cities[i],
      scheduled: airlines[i]
    };

    // Add the row to the response.
    r.data.push(data);
  }

  res.json(r);
});

// ========================================================================
// STATIC FILES
app.use('/', express.static('public'));

// ========================================================================
// WEB SERVER
const port = process.env.PORT || 8080;
app.listen(port);
console.log('split flap started on port ' + port);