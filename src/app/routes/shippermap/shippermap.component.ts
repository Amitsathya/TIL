import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-shippermap',
  templateUrl: './shippermap.component.html',
  styleUrls: ['./shippermap.component.css']
})
export class ShippermapComponent implements OnInit {
  geolocation: FormGroup;
  latitude: number;
  longitude: number;
  org_lat: number;
  org_long: number;
  dest_lat:number;
  dest_long:number;
  zoom:number;
  private geoCoder;
  type: any = ['Heavy Goods','Fragile']
  units: any = ['Kg','Tons','litres']
  @ViewChild('search1')
  public searchElementRef1: ElementRef;
  @ViewChild('search2')
  public searchElementRef2: ElementRef;
  
  
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,private fb: FormBuilder
    ) { 
      this.geolocation= this.fb.group({
        search_origin:[''],
        search_dest:[''],
        origin: ['', Validators.required],
        lattitude: [''],
        longitude: [''],
        destination:['',Validators.required]
        // quantity:['',Validators.required],
        // typeof:['',Validators.required],
        // unit:['',Validators.required]
      }) 
    }
  
  ngOnInit(): void {
    if(localStorage.getItem('login')!='true'){
      location.reload()
      localStorage.setItem('logout','false');
      localStorage.setItem('login','true');
    }
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
    console.log('hi');
    
  }
  
  markerDragEnd($event: google.maps.MouseEvent) {
    console.log($event);
    this.latitude = $event.latLng.lat();
    this.longitude = $event.latLng.lng();
    this.getAddress(this.latitude, this.longitude,1);
  }
  markerDragEnd1($event: google.maps.MouseEvent) {
    console.log($event);
    this.latitude = $event.latLng.lat();
    this.longitude = $event.latLng.lng();
    this.getAddress(this.latitude, this.longitude,2);
  }
  
  getAddress(latitude, longitude,x) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 15;
          // this.geolocation.controls['lattitude'].setValue(latitude);
          // this.geolocation.controls['longitude'].setValue(longitude);
          if(x==1){
            this.geolocation.controls['origin'].setValue(results[0].formatted_address);
            this.org_lat=latitude;
            this.org_long=longitude;
          }else{
            this.geolocation.controls['destination'].setValue(results[0].formatted_address);
            this.dest_lat=latitude;
            this.dest_long=longitude;
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
    console.log('hi');
    
    this.dir = {
      origin: { lat: this.org_lat, lng:this.dest_long },
      destination: { lat: this.dest_lat, lng: this.dest_long }
    }
  }

   public myfunction(message : string){
      //alert(message);
      const element = document.getElementById(message)
      if(element.style.backgroundColor == 'grey') {
        element.style.backgroundColor = 'white'
      } else {
        element.style.backgroundColor = 'grey'
      }
      
  }
}
