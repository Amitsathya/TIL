import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
// import { MapsAPILoader } from '@agm/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireDatabase} from '@angular/fire/database';
import * as firebase from 'firebase';

@Component({
  selector: 'app-carriermap',
  templateUrl: './carriermap.component.html',
  styleUrls: ['./carriermap.component.css']
})
export class CarriermapComponent implements OnInit {
  latitude: number;
  longitude: number;
  org_lat: number;
  org_long: number;
  dest_lat: number;
  dest_long: number;
  confirm: FormGroup;
  private geoCoder;
  orders: any = []
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  zoom: number;
  
  constructor(private db: AngularFireDatabase
    // private mapsAPILoader: MapsAPILoader
    ,private fb: FormBuilder) {
    this.confirm= this.fb.group({
      origin: [''],
      vehicle: [''],
      destination:[''],
      amount:['']
    }) 
   }

  ngOnInit(): void {
    // this.mapsAPILoader.load().then(() => {
    // this.geoCoder = new google.maps.Geocoder;
    // })
    firebase.database().ref('/OrderInfo/').once('value').then((snapshot) => {
      var username = (snapshot.val() ) || 'Anonymous';
      for (const [key, value] of Object.entries(username)) {
        this.orders.push({'key':key,'dest_lat':value['dest_lat'],'dest_long':value['dest_long'],'org_lat':value['org_lat'],'org_long':value['org_long'],'vehicle':value['vehicle']})
   
      }
    });
    console.log(this.orders)
    
      // if ('geolocation' in navigator) {
      //   navigator.geolocation.getCurrentPosition((position) => {
      //     this.latitude = position.coords.latitude;
      //     this.longitude = position.coords.longitude;
          
      //     this.zoom = 15;
      //   });
      // }
  }

  selected(id){
    this.orders.forEach(element => {
      if(element.key==id){
        this.org_lat=element.org_lat;
        this.org_long=element.org_long;
        this.dest_lat=element.dest_lat;
        this.dest_long=element.dest_long
      }
    })
  //  this.getDirection()
  }
  
  public renderOptions = {
    suppressMarkers: true,
}

public markerOptions = {
    origin: {
        infoWindow: 'This is origin.',
        icon: 'your-icon-url',
        draggable: true,
    },
    destination: {
        icon: 'your-icon-url',
        label: 'marker label',
        opacity: 0.8,
    },
}
  
  dir = undefined;
  public getDirection() {
    this.dir = {
      origin: { lat: this.org_lat, lng:this.dest_long },
      destination: { lat: this.dest_lat, lng: this.dest_long }
    }
  }
  
  Accept(key){
    this.orders.forEach(element => {
      if(element.key==key){
        this.org_lat=element.org_lat;
        this.org_long=element.org_long;
        this.dest_lat=element.dest_lat;
        this.dest_long=element.dest_long;
        this.confirm.controls['vehicle'].setValue(element.vehicle);
      }})
      function deg2rad(deg) {   return deg * (Math.PI/180) }
      var R = 6371000; // metres
      var φ1 = deg2rad(this.org_lat);
      var φ2 = deg2rad(this.dest_lat)
      var Δφ = deg2rad(this.dest_lat-this.dest_lat)
      var Δλ = deg2rad(this.dest_long-this.org_long)

      var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

      var d = R * c;
      this.confirm.controls['amount'].setValue(Math.round(d*7));
    // this.getAddress(this.org_lat,this.org_long,1)
    // this.getAddress(this.dest_lat,this.dest_long,2)
    let element = document.getElementById('over_map2')
    element.style.visibility = 'visible'
    
  }
  
  // getAddress(latitude, longitude,x) {

    
  //   this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
  //     console.log(results);
  //     console.log(status);
  //     if (status === 'OK') {
  //       if (results[0]) {
  //         console.log(results[0]);
          
  //         this.zoom = 15;
  //         if(x==1){
  //           this.confirm.controls['origin'].setValue(results[0].formatted_address);
  //         }else{
  //           this.confirm.controls['destination'].setValue(results[0].formatted_address);
  //         }         
  //       } else {
  //         window.alert('No results found');
  //       }
  //     } else {
  //       window.alert('Geocoder failed due to: ' + status);
  //     }

  //   });
  // }
}
