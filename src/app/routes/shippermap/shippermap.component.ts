import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireDatabase} from '@angular/fire/database';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-shippermap',
  templateUrl: './shippermap.component.html',
  styleUrls: ['./shippermap.component.css']
})
export class ShippermapComponent implements OnInit {
  geolocation: FormGroup;
  confirmOrder= false;
  latitude: number;
  longitude: number;
  org_lat: number;
  org_long: number;
  dest_lat:number;
  dest_long:number;
  zoom:number;
  edit:any=null;
  marker: any = []
  private geoCoder;
  type: any = ['Heavy Goods','Fragile']
  units: any = ['Kg','Tons','litres']
  vehicles: any = [
    {value: 'Tata Ace Gold', id: 'back1'},
    {value: 'Ashok Leyland Dost Strong', id: 'back2'},
    {value: 'Mahindra Bolero Pickup', id: 'back3'},
    {value: 'Tata 407', id: 'back4'},
    {value: 'Eicher 19ft', id: 'back5'}]
  @ViewChild('search1')
  public searchElementRef1: ElementRef;
  @ViewChild('search2')
  public searchElementRef2: ElementRef;
  
  
  constructor(
    private mapsAPILoader: MapsAPILoader,private route: ActivatedRoute,
    private db: AngularFireDatabase,private toastr: ToastrService,
    private ngZone: NgZone,private fb: FormBuilder
    ) { 
      this.geolocation= this.fb.group({
        search_origin:[''],
        search_dest:[''],
        origin: ['', Validators.required],
        origin_lat: [''],
        origin_lng: [''],
        dest_lat:[''],
        dest_lng:[''],
        vehicle: [{value:'',disabled: true},Validators.required],
        destination:['',Validators.required],
        quantity:['',Validators.required],
        // typeof:['',Validators.required],
        unit:['',Validators.required]
      }) 
    }
  
  ngOnInit(): void {
    if(localStorage.getItem('login')!='true'){
      location.reload()
      localStorage.setItem('logout','false');
      localStorage.setItem('login','true');
    }
    firebase.database().ref('/CarrierInfo/').once('value').then((snapshot) => {
      
      var username = (snapshot.val() ) || 'Anonymous';
      for (const [key, value] of Object.entries(username)) {
        if(value['last_loc']){
        let x=value['last_loc'];
        let y=String(x).split(',');
        this.marker.push({'lat':y[0],'lng':y[1],'icon':{url: '../../../assets/truck.png', scaledSize: {height: 60, width: 40}}})
      }
      }      
    });
    this.route
    .queryParams
    .subscribe(params => {
      if(params.id){
        firebase.database().ref('/OrderInfo/').once('value').then((snapshot) => {
          var username = (snapshot.val() ) || 'Anonymous';
          for (const [key, value] of Object.entries(username)) {
           if (params.id==key){
            this.geolocation.controls['origin'].setValue(value['orign']);
            this.geolocation.controls['destination'].setValue(value['destination']); 
            this.geolocation.controls['quantity'].setValue(value['weight']);
            this.geolocation.controls['unit'].setValue(value['units']);
            this.geolocation.controls['vehicle'].setValue(value['vehicle']);
            this.select(value['vehicle'])
            this.geolocation.controls['origin_lng'].setValue(value['org_long']);
            this.geolocation.controls['origin_lat'].setValue(value['org_lat']); 
            this.geolocation.controls['dest_lat'].setValue(value['dest_lat']);
            this.geolocation.controls['dest_lng'].setValue(value['dest_long']);
            this.org_lat=value['org_lat']
            this.org_long=value['org_long']
            this.dest_lat=value['dest_lat']
            this.dest_long=value['dest_long']
            this.geolocation.controls['vehicle'].enable();
            let element = document.getElementById('over_map2')
              element.style.visibility = 'visible'
           }
          }
      })
    }
  if(params.edit){
    this.edit=params.id
  }  
  });
    
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete1 = new google.maps.places.Autocomplete(this.searchElementRef1.nativeElement);
      let autocomplete2 = new google.maps.places.Autocomplete(this.searchElementRef2.nativeElement);
      autocomplete1.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete1.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.marker.push({'lat':this.latitude,'lng':this.longitude,'icon':{url: '../../../assets/marker.png', scaledSize: {height: 40, width: 40}}})        
          this.getAddress(this.latitude, this.longitude,1);
          this.zoom = 15;
        });
      });
      
      autocomplete2.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete2.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.marker.push({'lat':this.latitude,'lng':this.longitude,'icon':{url: '../../../assets/marker.png', scaledSize: {height: 40, width: 40}}})
          this.getAddress(this.latitude, this.longitude,2);
          this.zoom = 15;
        });
      });
    });
  }
  
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 15;
        this.getAddress(this.latitude, this.longitude,1);
      });
    }
  }
  saveForm(){
    this.geolocation.controls['origin_lat'].setValue(this.org_lat);
    this.geolocation.controls['origin_lng'].setValue(this.org_long);
    this.geolocation.controls['dest_lat'].setValue(this.dest_lat);
    this.geolocation.controls['dest_lng'].setValue(this.dest_long);
    let tutorialsRef = this.db.list('OrderInfo')
    var d = new Date();
    let x=d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear()
    console.log(x);
    
   if (!this.edit){
    tutorialsRef.push({
      shipper_uid: localStorage.getItem('session'),
      date: x,
      weight: this.geolocation.value.quantity,
      units:this.geolocation.value.unit,
      org_lat: this.geolocation.value.origin_lat,
      org_long: this.geolocation.value.origin_lng,
      dest_lat: this.geolocation.value.dest_lat,
      dest_long: this.geolocation.value.dest_lng,
      vehicle: this.geolocation.value.vehicle,
      orign:this.geolocation.value.origin,
      destination:this.geolocation.value.destination,
      status:'new'
    })
    this.toastr.success('Order Successful! Please wait while the Carrier Arrives');
   } else{
     tutorialsRef.update(this.edit, { 
      shipper_uid: localStorage.getItem('session'),
      date: x,
      weight: this.geolocation.value.quantity,
      units:this.geolocation.value.unit,
      org_lat: this.geolocation.value.origin_lat,
      org_long: this.geolocation.value.origin_lng,
      dest_lat: this.geolocation.value.dest_lat,
      dest_long: this.geolocation.value.dest_lng,
      vehicle: this.geolocation.value.vehicle,
      orign:this.geolocation.value.origin,
      destination:this.geolocation.value.destination,
      status:'new'
     });
     this.toastr.success('Order Updated! Please wait while the Carrier Arrives');
     this.edit=null;
   }
  }
  
  markerDragEnd($event: google.maps.MouseEvent) {
    this.latitude = $event.latLng.lat();
    this.longitude = $event.latLng.lng();
    this.getAddress(this.latitude, this.longitude,1);
  }
  markerDragEnd1($event: google.maps.MouseEvent) {
    this.latitude = $event.latLng.lat();
    this.longitude = $event.latLng.lng();
    this.getAddress(this.latitude, this.longitude,2);
  }
  
  getAddress(latitude, longitude,x) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 15;
          if(x==1){
            this.geolocation.controls['origin'].setValue(results[0].formatted_address);
            this.org_lat=latitude;
            this.org_long=longitude;
          }else{
            this.geolocation.controls['destination'].setValue(results[0].formatted_address);
            this.dest_lat=latitude;
            this.dest_long=longitude;
            this.geolocation.controls['vehicle'].enable();
            let element = document.getElementById('over_map2')
              element.style.visibility = 'visible'
          }         
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
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
  lat: Number = 24.799448;
  lng: Number = 120.979021;
  dir = undefined;
  public getDirection() {
    if(this.geolocation.valid){
      this.confirmOrder=true;    
      this.dir = {
        origin: { lat: this.org_lat, lng:this.org_long },
        destination: { lat: this.dest_lat, lng: this.dest_long }
      }
    }
  }

   public myfunction(id,value){
    this.geolocation.controls['vehicle'].setValue(value);
    this.vehicles.forEach(element => {
      if(element.id!=id){
        const ns = document.getElementById(element.id)
        ns.style.backgroundColor = 'white'
      }
     });
      const element = document.getElementById(id)
      if(element.style.backgroundColor == 'grey') {
        this.geolocation.controls['vehicle'].setValue('');
        element.style.backgroundColor = 'white'
      } else {
        element.style.backgroundColor = 'grey'
      }
  }
  
  select(x){
    this.vehicles.forEach(element => {
      const ns = document.getElementById(element.id)
      if(element.value!=x){
        ns.style.backgroundColor = 'white'
      } else{
        ns.style.backgroundColor = 'grey'
      }
     });
    
  }
}
