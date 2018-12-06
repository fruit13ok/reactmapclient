import React, { Component } from 'react';
import L from 'leaflet';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card, Button, Form, FormGroup, Label, Input } from 'reactstrap';
// import axios from 'axios';
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
   }),
   inputField: {
     placetype: 'Restroom',
     about: ''
   },
   places: []
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
   // get places from DB
   fetch('http://localhost:5000/')
     .then(res => res.json())
     .then(places => {
       places.forEach(function(place) {
         console.log(place.placetype);
         console.log(place.about);
         console.log(place.lat);
         console.log(place.lng);
         console.log(place._id);
       });
       this.setState({
         places: places
       });
     })
 }

 // handle submit button
 formSubmitted = (event) => {
   event.preventDefault();
   console.log('InputField: ',this.state.inputField);
   console.log('places: ',this.state.places);
   const place = {
     placetype: this.state.inputField.placetype,
     about: this.state.inputField.about,
     lat: this.state.location.lat,
     lng: this.state.location.lng
   };
   console.log('place: ',place);
   // the fetch way
   fetch('http://localhost:5000/place', {
     method: 'post',
     headers: {
       'Content-Type': 'application/json',
       'Accept': 'application/json'
     },
     body: JSON.stringify(place)
   }).then((response) => {
     return response.json();
   }).then((responsejson) => {
     console.log('Responsed: ', responsejson);
     // get places from DB
     // either way works, people said use return fetch promise is better
     // fetch('http://localhost:5000/')
     // .then(res => res.json())
     // .then(places => {
     //   places.forEach(function(place) {
     //     console.log(place.placetype);
     //     console.log(place.about);
     //     console.log(place.lat);
     //     console.log(place.lng);
     //     console.log(place._id);
     //   });
     //   this.setState({
     //     places: places
     //   });
     // })
     return fetch('http://localhost:5000/')
   })
   .then(res => res.json())
   .then(places => {
     places.forEach(function(place) {
       console.log(place.placetype);
       console.log(place.about);
       console.log(place.lat);
       console.log(place.lng);
       console.log(place._id);
     });
     this.setState({
       places: places
     });
   })
   ;
   // the axios way
   // axios.post('http://localhost:5000/place', place)
   //   .then(response => {
   //     console.log('Responsed', response.data)
   //   })
   //   .catch(err => console.log(err))
 }

 // handle input
 // https://reactjs.org/docs/forms.html#handling-multiple-inputs
 // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names
 // NOTE: don't directly set event inside setState(),
 // we group form fields as single state,
 // need to use ...prevState to concat each field, else only late field show,
 // [name]: value will named and assign value by form attibute name and value
 valueChanged =(event) => {
   const { name, value } = event.target;
   this.setState((prevState) => ({
     inputField: {
       ...prevState.inputField,
       [name]: value
     }
   }))
 }
 // add user marker after receive user location,
 // add places marker base on state places array
 render() {
   const position = [this.state.location.lat, this.state.location.lng]
   return (
     <div className='map'>
       <Map className='map' center={position} zoom={this.state.zoom}>
         <TileLayer
           attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
         />
         {
           this.state.hasUserLocation ?
           <Marker
             position={position}
             icon={this.state.myIcon}>
             <Popup>
               Your current location
             </Popup>
           </Marker> : ''
         }
         {
           this.state.places.map((place) => {
             return (
               <Marker
               key={place._id}
                 position={[place.lat, place.lng]}
                 icon={this.state.myIcon}>
                 <Popup>
                   {place.placetype} <br /> {place.about}
                 </Popup>
               </Marker>
             )
           })
         }
       </Map>
       <Card body className='message-form'>
         <Form onSubmit={this.formSubmitted}>
           <FormGroup>
             <Label for="placetype">What type of place?</Label>
             <Input
             onChange={this.valueChanged}
             type="select"
             name="placetype"
             id="placetype">
               <option>Restroom</option>
               <option>Drinking fountain</option>
             </Input>
           </FormGroup>
           <FormGroup>
             <Label for="about">Write about this place</Label>
             <Input
               onChange={this.valueChanged}
               type="textarea"
               name="about"
               id="about"
               placeholder="Enter info about this location" />
           </FormGroup>
           <Button type='submit' color="info" block disabled={!this.state.hasUserLocation}>Submit / Update</Button>
         </Form>
       </Card>
     </div>
   );
 }
}

export default App;
