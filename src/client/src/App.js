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

let names = [];
let images = [];
let info = [];
let urls = [];
let venues = [];
let dates = [];

function App() {
  const [temp, setTemp] = useState("");
  const [city, setCity] = useState("");
  const [hidden, setHidden] = useState(false);
  const [icon, setIcon] = useState("");
  const [summary, setSummary] = useState("");
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/")
      .then(res => res.json())
      .then(res => {
        for (let i = 0; i < res.ticketmaster._embedded.events.length; i++) {
          names.push(res.ticketmaster._embedded.events[i].name);
          images.push(res.ticketmaster._embedded.events[i].images[1].url);
          info.push(res.ticketmaster._embedded.events[i].info);
          urls.push(res.ticketmaster._embedded.events[i].url);
          venues.push(res.ticketmaster._embedded.events[i]._embedded.venues[0].name);
          dates.push(res.ticketmaster._embedded.events[i].dates.start.localDate.split("-").reverse().join("-"))
        }
        setHidden(true);
        setTemp(((res.darksky.currently.temperature - 32) / 1.8).toFixed(0));
        setCity(res.ipdata.city);
        setIcon(res.darksky.currently.icon.replace(/-/g, "_").toUpperCase());
        setSummary(res.darksky.currently.summary)
      })
      .then(() => {
        let tempcards = [];

        for (let i = 0; i < names.length; i++) {
          tempcards.push(
            <Card style={{ width: "18rem" }} className="card">
              <Card.Header>{names[i]}</Card.Header>
              <Card.Img variant="top" className ="card-image" src={images[i]} />
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

    setCards(tempcards)

      })
  }, []);

  return (
    <div>
      {/* Top Navbar Construction */}
      <Navbar className="Topbar" bg="dark" variant="dark" sticky="top">
        <Container>

        <Col xs={1} l={1}>
        <Navbar.Brand>
                <h1>EventWeather</h1>
                <h6>Events and weather for your day out.</h6>
        </Navbar.Brand>
        </Col>
        <Col xs={1}>
        <Navbar.Brand>
          <ReactAnimatedWeather
            icon={icon}
            color="white"
            size={64}
            animate={true}
          />
        </Navbar.Brand>
        </Col>

        <Col xs={1} className="weather-report">
        <br/>
        <strong>{city}</strong> <br/>
                {summary}
                <p>{temp} °C</p>
        </Col>
        </Container>
      </Navbar>

      <CardColumns className="card-columns">
          {cards}
      </CardColumns>

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