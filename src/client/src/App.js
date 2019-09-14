import React, { useState, useEffect } from "react";
import ReactAnimatedWeather from "react-animated-weather";
import "./App.css";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import CardColumns from "react-bootstrap/CardColumns";
import ds from "./images/ds.png";
import ipdata from "./images/favicon.ico";
import tm from "./images/tm.png";

function App() {
  //Arrays that are required for the cards
  let names = [];
  let images = [];
  let info = [];
  let urls = [];
  let venues = [];
  let dates = [];
  
  //These hooks populate the page after it has already loaded.
  const [temp, setTemp] = useState("");
  const [city, setCity] = useState("");
  const [wind, setWind] = useState("");
  const [bearing, setBearing] = useState("");
  const [icon, setIcon] = useState("");
  const [summary, setSummary] = useState("");
  const [hidden, setHidden] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const [locationerror, setLocationError] = useState(true);
  const [eventserror, setEventsError] = useState(true);

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      // Error handling prevents any further progress if
      // the initial fetch fails.
      .catch((err) => {
        console.log(err)
        setLocationError(false);
        setHidden(true);
      })
      .then((res) => {
        //Places the data into arrays for the cards array
        for (let i = 0; i < res.Ticketmaster.NumOfEvents; i++) {
          names.push(res.Ticketmaster.Names[i]);
          images.push(res.Ticketmaster.Images[i]);

          //Quick check to fill in the info section if none is available.
          if (res.Ticketmaster.Info[i] === "" ||
            res.Ticketmaster.Info[i] === null ||
            res.Ticketmaster.Info.length === 0)
          {
            res.Ticketmaster.Info[i] = "No information provided.";
          }

          info.push(res.Ticketmaster.Info[i]);
          urls.push(res.Ticketmaster.Urls[i]);
          venues.push(res.Ticketmaster.Venues[i]);
          dates.push(res.Ticketmaster.Dates[i]);
        }

        // Error handling, check to make sure data exists for
        // the weather report section.
        if (
          res.Ipdata.City === "" ||
          res.Ipdata.City === null ||
          res.Darksky.Currently.Summary === "" ||
          res.Darksky.Currently.Temperature === "" ||
          res.Darksky.Currently.Wind === "" ||
          res.Darksky.Currently.Icon === "" ||
          res.Darksky.Currently.WindBearing === ""
        ) {
          setLocationError(false);
          setEventsError(false);
          setHidden(true);
        } else {
          setLoading(false);
        }
        
        // Hooks that set the data and remove loading symbols once complete
        setHidden(true);
        setCity(res.Ipdata.City);
        setSummary(res.Darksky.Currently.Summary);
        setTemp(res.Darksky.Currently.Temperature);
        setWind((res.Darksky.Currently.Wind * 1.944).toFixed(1));
        setIcon(res.Darksky.Currently.Icon);
        setBearing(res.Darksky.Currently.WindBearing);
      
        // Holds the information before the Hook populates the cards array
        let tempcards = [];

        // Check to make sure the result actually returned data.
        if (res.Ticketmaster.NumOfEvents !== 0) {
        // Populates the tempcards array
        for (let i = 0; i < res.Ticketmaster.NumOfEvents; i++) {
          tempcards.push(
            <Card className="card">
              <Card.Header className="card-title">{names[i]}</Card.Header>
              <Card.Img variant="top" className="card-image" src={images[i]} />
              <br />
              <Card.Title>{venues[i]}</Card.Title>
              <Card.Title>{dates[i]}</Card.Title>
              <Card.Body className="card-info">
                <Card.Text>{info[i]}</Card.Text>
              </Card.Body>
              <Card.Footer>
                <Card.Link href={urls[i]}>{urls[i]}</Card.Link>
              </Card.Footer>
            </Card>
          );
        }

        // Hook that populates the actual cards array
          setCards(tempcards);
        }

        // Error handling, shows an error in the cards section
        // if there is any problems.
        else {
          setEventsError(false);
        }
      })
      .catch((err) => {
        console.log(err)
        setEventsError(false);
      })
  }, []);

  return (
    <div>
      {/* Top Navbar Construction */}
      <Navbar className="topbar" bg="dark" variant="dark" sticky="top">
        {/* Separate the navbar into 3 columns */}
        <Container>
          {/* Navbar Title */}
          <Row>
            <Col md="auto">
              <Navbar.Brand>
                <h1>EventWeather</h1>
                <h6>Events and weather for your day out.</h6>
              </Navbar.Brand>
            </Col>
            {/* Animated weather icon */}
            <Col md="auto">
              <Navbar.Brand>
                <ReactAnimatedWeather
                  icon={icon}
                  color="white"
                  size={64}
                  animate={true}
                />
              </Navbar.Brand>
            </Col>
            {/* Weather report section */}
            {/* Spinner to indicate loading, hides after the page is populated. */}
            <Spinner
              className="spinner"
              animation="border"
              hidden={hidden}
              variant="light"
            />
            <span className="loading" hidden={hidden}>
              Loading...
            </span>

            {/* Appears if there's an issue with the weather data. */}
            <strong hidden={locationerror} className="loading">
              Sorry! Something went wrong :(
            </strong>
            
            {/* City and weather data. */}
            <Col md="auto" className="weather-report" hidden={loading}>
              <strong>{city}</strong>
            </Col>
            <Col md="auto" className="weather-report" hidden={loading}>
              {summary}
            </Col>
            <Col md="auto" className="weather-report" hidden={loading}>
              {temp} °C
            </Col>
            <Col md="auto" className="weather-report" hidden={loading}>
              {wind} knots {bearing}
            </Col>
          </Row>
        </Container>
      </Navbar>

      {/* Renders the cards array into the columns */}
      <CardColumns className="card-columns" hidden={loading}>
        {cards}
      </CardColumns>
      
      {/* Appears if there's an issue with the events data */}
      <h2 hidden={eventserror} className="cards-error">
        Sorry! Something went wrong or we couldn't find any events :(
      </h2>

      {/* Bottom Navbar Construction */}
      <Navbar bg="dark" variant="dark" sticky="bottom">
        {/* Container to hold the API powered by images */}
        <Container>
          <Row>
            {/* Darksky API */}
            <Col xs={2} md={1} lg={1} sm={2}>
              <Image className="darksky" src={ds} alt={"ds"} fluid />
            </Col>

            {/* IPData.co API */}
            <Col xs={2} md={1} lg={1} sm={2}>
              <Image className="ipdata" src={ipdata} alt={"ipdata"} fluid />
            </Col>

            {/* Ticketmaster API */}
            <Col xs={3} md={2} lg={2} sm={3}>
              <Image className="tm" src={tm} alt={"tm"} fluid />
            </Col>
          </Row>
        </Container>
      </Navbar>
    </div>
  );
}

export default App;
