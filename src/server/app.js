//CONSTS AND REQUIREMENTS
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const server = express();
const axios = require('axios');
const bodyParser = require('body-parser')
let latitude = "";
let longitude = "";



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

  axios.get("https://api.ipdata.co/?api-key=74dc719f974815bd528cf30c7bc844f6bbf550b4357db6dd5537bae1")
    .then(function (response) {
      latitude = response.data.latitude
      longitude = response.data.longitude

      axios.get("https://api.darksky.net/forecast/8871d1e0a911accaa06df49bd016b42e/" +
        latitude + "," + longitude)
        .then(function (response) {
          summary = response.data.currently.summary
          // res.send(summary + "  " + latitude + "  " + longitude)
        })
        .catch(function (error) {
        console.log(error)
        })
      axios.get("https://app.ticketmaster.com/discovery/v2/events.json?apikey=4OMcMtE7RsqOGgvSIuMpVPKQMmf4IHib&latlong=" + latitude + "," + longitude)
        .then(function (response) {
          res.send(response.data._embedded.events[0].name)
        })
        .catch(function (error) {
        console.log(error)
      })
    })
    .catch(function (error) {
      console.log(error)
    });
})

server.listen(3000, () => 
  console.log("Listening on port 3000!")
)

module.exports = server;

//axios.get("https://app.ticketmaster.com/discovery/v2/events.json?apikey=4OMcMtE7RsqOGgvSIuMpVPKQMmf4IHib&latlong=" + res.data.latitude + "," + res.data.longitude)
  // .then(function (response) {
  //   axios.get("https://api.darksky.net/forecast/8871d1e0a911accaa06df49bd016b42e/" +
  //     response.data.latitude + "," + response.data.longitude)

  //     .then(function (res) {
  //       summary = res.data.currently.icon
  //     })
  //     .catch(function (err) {
  //       console.log(err)
  //     })
  // })