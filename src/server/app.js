//CONSTS AND REQUIREMENTS
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const server = express();
const axios = require('axios');
const bodyParser = require('body-parser')
const requestIP = require('request-ip');

//Variables required to send information to the client side.
let latitude = "";
let longitude = "";
let city = "";
let clientIP = "";
let returnJSON = {
  darksky: {},
  ticketmaster: {}
};

// URLs that data will be fetched from.
let ipdataurl = "https://api.ipdata.co/" + clientIP + "?api-key=74dc719f974815bd528cf30c7bc844f6bbf550b4357db6dd5537bae1"
let darkskyurl = "https://api.darksky.net/forecast/8871d1e0a911accaa06df49bd016b42e/"
let ticketmasterurl = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=4OMcMtE7RsqOGgvSIuMpVPKQMmf4IHib&size=5&city="

//MIDDLEWARE IMPLEMENTATION
server.use(logger('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())
server.use(cookieParser());
server.use(express.static(path.join(__dirname, 'public')));

//DEFAULT SERVER PAGE
server.get('/', (req, res) => {

  // This quickly grabs the requesting clients IP to parse into the fetches.
  clientIP = requestIP.getClientIp(req);

  axios.get(ipdataurl)
    .then(function (response) {
      latitude = response.data.latitude
      longitude = response.data.longitude
      city = response.data.city
      
      axios.get(darkskyurl + latitude + "," + longitude)
        .then(function (response) {
          returnJSON.darksky = response.data;
        
          axios.get(ticketmasterurl + city)
          .then(function (response) {
              returnJSON.ticketmaster = response.data;
              res.send(returnJSON);
          })
          .catch(function (error) {
            console.log(error)
          })
        })
        .catch(function (error) {
        console.log(error)
        })
    })
    .catch(function (error) {
      console.log(error)
    });
})

server.listen(3001, () => 
  console.log("Listening on port 3001!")
)

module.exports = server;