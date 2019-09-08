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


//Arrays that are required for the cards
let names = [];
let images = [];
let info = [];
let urls = [];
let venues = [];
let dates = [];

function App() {
  //These hooks populate the page after it has already loaded.
  const [temp, setTemp] = useState("");
  const [city, setCity] = useState("");
  const [wind, setWind] = useState("");
  const [bearing, setBearing] = useState("");
  const [hidden, setHidden] = useState(false);
  const [loading, setLoading] = useState(true);
  const [icon, setIcon] = useState("");
  const [summary, setSummary] = useState("");
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/")
      .then(res => res.json())
      .then(res => {
        //Places the data into arrays for the cards array
        for (let i = 0; i < 20; i++) {
          names.push(res.Ticketmaster.Names[i]);
          images.push(res.Ticketmaster.Images[i]);
          info.push(res.Ticketmaster.Info[i]);
          urls.push(res.Ticketmaster.Urls[i]);
          venues.push(res.Ticketmaster.Venues[i]);
          dates.push(res.Ticketmaster.Dates[i]);
        }

        setHidden(true);
        setCity(res.Ipdata.City);
        setSummary(res.Darksky.Currently.Summary);
        setTemp(res.Darksky.Currently.Temperature);
        setWind((res.Darksky.Currently.Wind * 1.944).toFixed(1))
        setIcon(res.Darksky.Currently.Icon);
        setBearing(res.Darksky.Currently.WindBearing)
      })
      .then(() => {
        // Holds the information before the Hook populates the cards array
        let tempcards = [];

        // Populates the tempcards array
        for (let i = 0; i < names.length; i++) {
          tempcards.push(
            <Card style={{ width: "18rem" }} className="card">
              <Card.Header>{names[i]}</Card.Header>
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
      });
  }, []);

  return (
    <div>
      {/* Top Navbar Construction */}
      <Navbar className="Topbar" bg="dark" variant="dark" sticky="top">
        {/* Separate the navbar into 3 columns */}
        <Container>
          {/* Navbar Title */}
          <Row>
            <Col md="auto" >
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
            <Col md="auto" className="weather-report">
              <strong>{city}</strong>
            </Col>
            <Col md="auto" className="weather-report">
              {summary}
            </Col>
            <Col md="auto" className="weather-report">
              {temp} °C
            </Col>
            <Col md="auto" className="weather-report">
              {wind} knots {bearing}
            </Col>
          </Row>
        </Container>
      </Navbar>

      {/* Renders the cards array into the columns */}
      <CardColumns className="card-columns">{cards}</CardColumns>

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
