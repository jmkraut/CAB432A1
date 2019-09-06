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
let cards = [];

function App() {
  const [temp, setTemp] = useState("");
  const [city, setCity] = useState("");
  const [hidden, setHidden] = useState(false);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [icon, setIcon] = useState("");

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
          
        }
        setHidden(true);
        setTemp(((res.darksky.currently.temperature - 32) / 1.8).toFixed(0));
        setCity(res.ipdata.city);
        setTitle(res.ticketmaster._embedded.events[0].name);
        setImage(res.ticketmaster._embedded.events[0].images[1].url);
        setIcon(res.darksky.currently.icon.replace(/-/g, "_").toUpperCase());
      })
      .then(() => {
            for (let i = 0; i < names.length; i++) {
              cards.push(
                <Card style={{ width: "18rem" }}>
                  <Card.Header>
                    <strong>{title}</strong>
                  </Card.Header>
                  <Card.Img variant="top" src={images[i]} />
                  <br />
                  <Card.Title>{venues[i]}</Card.Title>
                  <Card.Body>
                    <Card.Text>{info[i]}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <Card.Link href={urls[i]}>{urls[i]}</Card.Link>
                  </Card.Footer>
                </Card>
              );
        }
        
        console.log(cards)
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      {/* Top Navbar Construction */}
      <Navbar className="Topbar" bg="dark" variant="dark">
        <Navbar.Brand>
          <ReactAnimatedWeather
            icon={icon}
            color="white"
            size="128"
            animate={true}
          />
        </Navbar.Brand>

        <Navbar.Brand>
            <ul style={{ listStyleType: "none" }}>
              <li>
                <h1>EventWeather</h1>
                <h6>Events and weather for your day out.</h6>
              </li>
              <li>
                <strong>{city}</strong>
              </li>
              <li>
                <p>{temp} °C</p>
              </li>
            </ul>
        </Navbar.Brand>
      </Navbar>

      {/* <Card style={{ width: "18rem" }}>
        <Card.Header>
          <strong>{title}</strong>
        </Card.Header>
        <Card.Img variant="top" src={images[0]} />
        <br />
        <Card.Title>{venues[0]}</Card.Title>
        <Card.Body>
          <Card.Text>{info[0]}</Card.Text>
        </Card.Body>
        <Card.Footer>
          <Card.Link href={urls[0]}>{urls[0]}</Card.Link>
        </Card.Footer>
      </Card> */}
      <React.Fragment>{cards}</React.Fragment>
      <ol>
        {cards.map(card => (
          <li key={card}>{card}</li>
        ))}
      </ol>

      {/* Bottom Navbar Construction */}
      <Navbar bg="dark" variant="dark" fixed="bottom">
        <Navbar.Brand>
          {/* Container to hold the API powered by images */}
          <Container>
            <Row>
              {/* Darksky API */}
              <Col xs={3} md={3} lg={2} sm={3}>
                <Image className="darksky" src={ds} alt={"ds"} fluid />
              </Col>

              {/* IPData.co API */}
              <Col xs={2} md={2} lg={1} sm={2}>
                <Image className="ipdata" src={ipdata} alt={"ipdata"} fluid />
              </Col>

              {/* Ticketmaster API */}
              <Col xs={3} md={3} lg={3} sm={3}>
                <Image className="tm" src={tm} alt={"tm"} fluid />
              </Col>
            </Row>
          </Container>
        </Navbar.Brand>
      </Navbar>
    </div>
  );
}

export default App;
