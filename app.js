const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const axios = require('axios');
let summary = "";


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res) {

  axios.get("https://api.ipdata.co/?api-key=74dc719f974815bd528cf30c7bc844f6bbf550b4357db6dd5537bae1")

  .then(function (response) {
    axios.get("https://api.darksky.net/forecast/8871d1e0a911accaa06df49bd016b42e/" + 
    response.data.latitude + "," + response.data.longitude)

    .then(function(res) {
      summary = res.data.currently.summary

      .then(function(res) {
        axios.get("https://app.ticketmaster.com/discovery/v2/events.json?apikey=4OMcMtE7RsqOGgvSIuMpVPKQMmf4IHib&latlong=" + res.data.latitude + "," + res.data.longitude)
      })

      .catch(function(err){
        console.log(err)
      })
    })
    .catch(function(err){
      console.log(err)
    })
  })
  .catch(function(error){
    console.log(error);
  })

  res.send(summary);

})

app.listen(3000, () => 
  console.log("Listening on port 3000!")
)

module.exports = app;
