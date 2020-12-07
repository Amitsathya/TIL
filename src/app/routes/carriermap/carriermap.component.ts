import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AngularFireDatabase} from '@angular/fire/database';
import * as firebase from 'firebase';
import { ToastrService } from 'ngx-toastr';

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
  orders: any = [];
  marker: any = []
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  zoom: number;
  
  constructor(private db: AngularFireDatabase,private toastr: ToastrService,
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
      if(localStorage.getItem('login')!='true'){
        location.reload()
        localStorage.setItem('logout','false');
        localStorage.setItem('login','true');
      }
    this.geoCoder = new google.maps.Geocoder;
    })
    this.Orders()
      if ('geolocation' in navigator) { 
        navigator.geolocation.getCurrentPosition((position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
            let tutorialsRef = this.db.list('CarrierInfo')
            tutorialsRef.update(localStorage.getItem('session'), { last_loc: `${this.latitude},${this.longitude}` });
            this.marker.push({'lat':this.latitude,'lng':this.longitude,'icon':{url: '../../../assets/truck.png', scaledSize: {height: 60, width: 40}}})
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
        'distance':this.distance(value['org_lat'],value['org_long'],value['dest_lat'],value['dest_long']),'time':Math.round((this.distance(value['org_lat'],value['org_long'],value['dest_lat'],value['dest_long']))/0.763)})
        this.marker.push({'lat':value['org_lat'],'lng':value['org_long'],'icon':{url: '../../../assets/marker.png', scaledSize: {height: 40, width: 40}}})
        }
      }
      console.log(this.marker);
      
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
  
  dir = undefined;
  public getDirection() {
    this.dir = {
      origin: { lat: this.org_lat, lng:this.org_long },
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
    tutorialsRef.update(this.key, { status: 'Accepted',carrier_uid: localStorage.getItem('session') });
    let tutorialsRefs = this.db.list('CarrierInfo')
    tutorialsRefs.update(localStorage.getItem('session'), { active: true });
    let element = document.getElementById('over_map1')
    element.style.visibility = 'hidden'
    let element1 = document.getElementById('over_map2')
    element1.style.visibility = 'hidden'
    this.dest_lat=this.org_lat
    this.dest_long=this.org_long
    this.org_lat=this.latitude;
    this.org_long=this.longitude
    this.getDirection()
    this.Orders();
    this.key=null
    this.toastr.success('Order Accepted! Please drive to the Origin');
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
