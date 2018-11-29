import React, { Component } from 'react';
import L from 'leaflet';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

import './App.css';

// default example icon not working, 
// create my icon with image and setsize
// use inside Marker
// const myIcon = L.icon({
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
//   iconSize: [25, 41]
// });

class App extends Component {
  state = {
    lat: 51.505,
    lng: -0.09,
    zoom: 13,
    myIcon: L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
      iconSize: [25, 41]
    })
  }
  render() {
    const position = [this.state.lat, this.state.lng]
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
