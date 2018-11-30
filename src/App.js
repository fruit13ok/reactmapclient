import React, { Component } from 'react';
import L from 'leaflet';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

import './App.css';

// default example icon not working, 
// create my icon with image and setsize
// use inside Marker
// const myIcon = L.icon({
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
//   iconSize: [50, 82]
// });

class App extends Component {
  state = {
    location: {
      // lat: 37.7749295,
      // lng: -122.4194155,
      lat: 37.8044,
      lng: -122.2711,
    },
    hasUserLocation: false,
    zoom: 3,
    myIcon: L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
      iconSize: [40, 60]
    })
  }

  componentDidMount() {
    // get user GPS location
    navigator.geolocation.getCurrentPosition((position) => {
      // console.log('lat', position.coords.latitude);
      // console.log('lng: ', position.coords.longitude);
      this.setState({
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        hasUserLocation: true,
        zoom: 18
      });
    },
    () => {
      console.log('GPS location not available, use ip location');
      fetch('https://ipapi.co/json')
      .then(res => res.json())
      .then(location => {
        // console.log(location.latitude);
        // console.log(location.longitude);
        this.setState({
          location: {
            lat: location.latitude,
            lng: location.longitude,
          },
          hasUserLocation: true,
          zoom: 18
        });
      })
    });
  }

  render() {
    const position = [this.state.location.lat, this.state.location.lng]
    return (
      <Map className='map' center={position} zoom={this.state.zoom}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker 
        position={position}
        icon={this.state.myIcon}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </Map>
    );
  }
}

export default App;
