import React, { useState } from "react";
import ReactAnimatedWeather from "react-animated-weather";
import "./App.css";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import ds from "./images/ds.png";
import ipdata from "./images/favicon.ico";
import tm from "./images/tm.png";

function App() {
  const [temp, setTemp] = useState("");
  const [city, setCity] = useState("");
  const [hidden, setHidden] = useState(false);
  const [title, setTitle] = useState("");

  fetch("http://localhost:3001/")
    .then(res => res.json())
    .then(res => {
      setHidden(true)
      setTemp(((res.darksky.currently.temperature - 32) / 1.8).toFixed(2))
      setCity(res.ipdata.city)
      setTitle(res.ticketmaster._embedded.events[2].name)
    })
    .catch(error => {
      console.log(error);
    });
  

  return (
    <div>
      {/* Top Navbar Construction */}
      <Navbar className="Topbar" bg="dark" variant="dark" sticky="top">
        <Navbar.Brand>
          <h1>
            EventWeather{" "}
            <Spinner
              className="WeatherSpinner"
              animation="grow"
              hidden={hidden}
            />
          </h1>
        </Navbar.Brand>
        <Card className="WeatherCard" style={{ width: "18rem" }} hidden={true}>
          <Card.Body>
            <Card.Text>
              <strong>{city}</strong>
            </Card.Text>
            <Card.Text>{temp} °C</Card.Text>
          </Card.Body>
        </Card>
      </Navbar>
      <Container>
        <Row>
          <Card className="CardTest" style={{ width: "18rem" }}>
            <Card.Img variant="top" src={ipdata} />
            <Card.Body>
              <Card.Title>{title}</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="CardTest" style={{ width: "18rem" }}>
            <Card.Img variant="top" src={ipdata} />
            <Card.Body>
              <Card.Title>Card Title</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="CardTest" style={{ width: "18rem" }}>
            <Card.Img variant="top" src={ipdata} />
            <Card.Body>
              <Card.Title>Card Title</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="CardTest" style={{ width: "18rem" }}>
            <Card.Img variant="top" src={ipdata} />
            <Card.Body>
              <Card.Title>Card Title</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="CardTest" style={{ width: "18rem" }}>
            <Card.Img variant="top" src={ipdata} />
            <Card.Body>
              <Card.Title>Card Title</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="CardTest" style={{ width: "18rem" }}>
            <Card.Img variant="top" src={ipdata} />
            <Card.Body>
              <Card.Title>Card Title</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Card.Text>
            </Card.Body>
          </Card>
        </Row>
      </Container>

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
