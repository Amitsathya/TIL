import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFireDatabase} from '@angular/fire/database';
import * as firebase from 'firebase';

@Component({
  selector: 'app-carriermap',
  templateUrl: './carriermap.component.html',
  styleUrls: ['./carriermap.component.css']
})
export class CarriermapComponent implements OnInit {
  key: any;
  latitude: number;
  longitude: number;
  org_lat: number;
  org_long: number;
  dest_lat: number;
  dest_long: number;
  confirm: FormGroup;
  select: FormGroup;
  private geoCoder;
  orders: any = []
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  zoom: number;
  
  constructor(private db: AngularFireDatabase,
    private mapsAPILoader: MapsAPILoader
    ,private fb: FormBuilder) {
    this.confirm= this.fb.group({
      origin: [''],
      vehicle: [''],
      destination:[''],
      amount:['']
    }),
    this.select=this.fb.group({
      select: new FormControl([]) 
    })
   }

  ngOnInit(): void {
    this.mapsAPILoader.load().then(() => {
    this.geoCoder = new google.maps.Geocoder;
    })
    this.Orders()
      if ('geolocation' in navigator) { 
        navigator.geolocation.getCurrentPosition((position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          
          this.zoom = 15;
        });
      }
  }
  
  Orders(){
    firebase.database().ref('/OrderInfo/').once('value').then((snapshot) => {
      console.log(snapshot.val());
      
      var username = (snapshot.val() ) || 'Anonymous';
      for (const [key, value] of Object.entries(username)) {
        if(value['status']!='Accepted'){
          this.orders.push({'key':key,'dest_lat':value['dest_lat'],'dest_long':value['dest_long'],'org_lat':value['org_lat'],'org_long':value['org_long'],'vehicle':value['vehicle'],'origin':value['orign'],
        'distance':this.distance(value['org_lat'],value['org_long'],value['dest_lat'],value['dest_long'])})
        }
      }
    });
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
   this.getDirection()
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
  
  Accept(key,addr,dist){
    this.orders.forEach(element => {
      if(element.key==key){
        this.key=key
        this.org_lat=element.org_lat;
        this.org_long=element.org_long;
        this.dest_lat=element.dest_lat;
        this.dest_long=element.dest_long;
        this.confirm.controls['vehicle'].setValue(element.vehicle);
      }})
      this.confirm.controls['origin'].setValue(addr);
      this.confirm.controls['amount'].setValue(dist*21.32)
      
    this.getAddress(this.dest_lat,this.dest_long,2)
    let element = document.getElementById('over_map2')
    element.style.visibility = 'visible'
  }
  
  Confirm(){
    let tutorialsRef = this.db.list('OrderInfo')
    tutorialsRef.update(this.key, { status: 'Accepted' });
    let element = document.getElementById('over_map1')
    element.style.visibility = 'hidden'
    let element1 = document.getElementById('over_map2')
    element1.style.visibility = 'hidden'
    this.Orders();
    this.key=null
  }
  distance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
  
    console.log(12742 * Math.asin(Math.sqrt(a)));
    return Math.round(12742 * Math.asin(Math.sqrt(a)));

  }
  
  clickedMarker(key){
    console.log(this.select.setControl('select',key));
    
    this.select.controls['select'].setValue(key);
    
  }
  
  getAddress(latitude, longitude,x) {

    
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          console.log(results[0]);
          
          this.zoom = 15;
          if(x==1){
            this.confirm.controls['origin'].setValue(results[0].formatted_address);
          }else{
            this.confirm.controls['destination'].setValue(results[0].formatted_address);
          }         
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }
}
