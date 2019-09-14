//CONSTS AND REQUIREMENTS
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const logger = require("morgan");
const server = express();
const axios = require("axios");
const bodyParser = require("body-parser");
const d2d = require("degrees-to-direction");
const requestIp = require("request-ip");

//MIDDLEWARE IMPLEMENTATION
server.use(express.static(path.join(__dirname, "build")));
server.use(logger("dev"));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(cookieParser());
server.use(express.static(path.join(__dirname, "public")));
server.use(cors());
server.use(helmet());
server.set("trust proxy", true);

//DEFAULT SERVER PAGE
server.get("/api", (req, res) => {
  //Variables required to parse into some of the APIs
  let latitude = "";
  let longitude = "";
  let city = "";

  //Variable required to send information to the client side.
  let returnJSON = {
    Ipdata: {
      City: {}
    },
    Darksky: {
      Currently: {
        Summary: {},
        Temperature: {},
        Wind: {},
        WindBearing: {},
        Icon: {}
      }
    },
    Ticketmaster: {
      Names: [],
      Venues: [],
      Dates: [],
      Info: [],
      Urls: [],
      Images: [],
      NumOfEvents: {}
    }
  };

  // This quickly grabs the requesting
  // clients IP to parse into the fetches.
  // The replace statements are removing some padding
  // that gets added to ipv6 addresses.
  const clientIP = requestIp
    .getClientIp(req)
    .replace("::ffff:", "")
    .replace("::1", "");

  // URLs that data will be fetched from.
  let ipdataurl =
    "https://api.ipdata.co/" +
    clientIP +
    "?api-key=74dc719f974815bd528cf30c7bc844f6bbf550b4357db6dd5537bae1";
  let darkskyurl =
    "https://api.darksky.net/forecast/8871d1e0a911accaa06df49bd016b42e/";
  let ticketmasterurl =
    "https://app.ticketmaster.com/discovery/v2/events.json?apikey=4OMcMtE7RsqOGgvSIuMpVPKQMmf4IHib&size=20&city=";

  axios.get(ipdataurl)
    .then(function(response) {
      //Lat and Long for the Darksky API
      latitude = response.data.latitude;
      longitude = response.data.longitude;

      //City variable for the ticketmaster API
      //and placing it into the JSON object to be returned
      city = response.data.city
      returnJSON.Ipdata.City = response.data.city;

      //Call to the Darksky API and map data to the
      //JSON object to be returned.
      axios.get(
          darkskyurl +
            latitude +
            "," +
            longitude +
            "?&units=si&exclude=minutely,hourly,daily,alerts,flags"
        )
        .then(function(response) {
          //Trim down all the returned data to only
          //what is required for the front end.
          returnJSON.Darksky.Currently.Summary =
            response.data.currently.summary;

          returnJSON.Darksky.Currently.Temperature =
            response.data.currently.temperature.toFixed(1);

          returnJSON.Darksky.Currently.Wind =
            response.data.currently.windSpeed;

          //Corrects the format from e.g clear-day to
          //CLEAR_DAY for the front end.
          returnJSON.Darksky.Currently.Icon =
            response.data.currently.icon
            .replace(/-/g, "_")
            .toUpperCase();

          returnJSON.Darksky.Currently.WindBearing =
            d2d(response.data.currently.windBearing);

          //Call to the Ticketmaster API and map data to the
          //JSON object to be returned. Once complete returns
          //the JSON object.
          axios.get(ticketmasterurl + city)
            .then(function(response) {
              
              //This statement prevents the app from hanging if
              //Ticketmaster has no data for that latlong.
              if (
                response.data.page.totalElements !== 0
                && city !== null
                && city !== ""
              ) {
                //Trim down all the returned data to only
                //what is required for the front end.
                for (
                  let i = 0;
                  i < response.data._embedded.events.length;
                  i++
                ) {
                  returnJSON.Ticketmaster.Names[i] =
                    response.data._embedded.events[i].name;

                  returnJSON.Ticketmaster.Venues[i] =
                    response.data._embedded.events[i]._embedded.venues[0].name;

                  //The split and reverse corrects the format
                  // from yyyy-mm-dd to dd-mm-yyyy
                  returnJSON.Ticketmaster.Dates[i]
                    = response.data._embedded.events[i].dates.start.localDate
                    .split("-")
                    .reverse()
                    .join("-");

                  returnJSON.Ticketmaster.Info[i] =
                    response.data._embedded.events[i].info;

                  returnJSON.Ticketmaster.Urls[i] =
                    response.data._embedded.events[i].url;

                  returnJSON.Ticketmaster.Images[i] =
                    response.data._embedded.events[i].images[1].url;
                }
              }

              returnJSON.Ticketmaster.NumOfEvents =
                returnJSON.Ticketmaster.Names.length;

              //Return the data to the caller.
              res.send(returnJSON);
            })
            .catch(function(error) {
              console.log(error);
            });
        })
        .catch(function(error) {
          console.log(error);
        });
    })
    .catch(function(error) {
      console.log(error);
    });
});

server.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/build/index.html"));
});

server.listen(3000, () => console.log("Listening on port 3000!"));

module.exports = server;
