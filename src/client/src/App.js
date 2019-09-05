import React from 'react'
import './App.css';
import Navbar from 'react-bootstrap/Navbar'
import Image from 'react-bootstrap/Image'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ds from './images/ds.png'
import ipdata from './images/favicon.ico'
import tm from './images/tm.png'


function App(){
  return(
  <div>
    {/* Top Navbar Construction */}
      <Navbar bg="dark" variant="dark" className="Topbar">
    <Navbar.Brand>
      <h1>EventWeather</h1>
    </Navbar.Brand>
  </Navbar>

  {/* Bottom Navbar Construction */}
  <Navbar bg="dark" variant="dark" fixed="bottom">
    <Navbar.Brand>

  {/* Container to hold the API powered by images */}
  <Container>
  <Row>
    
    {/* Darksky API */}
    <Col xs={3} md={3} lg={2} sm={3}>
      <Image
      className="darksky"
      src={ds}
      alt={"ds"}
      fluid/>
    </Col>

    {/* IPData.co API */}
    <Col xs={2} md={2} lg={1} sm={2}>
      <Image
      className="ipdata"
      src={ipdata}
      alt={"ipdata"}
      fluid/>
    </Col>

    {/* Ticketmaster API */}
    <Col xs={3} md={3} lg={3} sm={3}>
      <Image
      className="tm"
      src={tm}
      alt={"tm"}
      fluid/>
    </Col>
  </Row>
</Container>
</Navbar.Brand>
  </Navbar>
  </div>
  )
}

export default App;
