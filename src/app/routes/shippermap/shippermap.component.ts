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
  zoom:number;
  address: string;
  private geoCoder;
  type: any = ['Heavy Goods','Fragile']
  units: any = ['Kg','Tons','litres']
  @ViewChild('search')
  public searchElementRef: ElementRef;
  
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,private fb: FormBuilder
    ) { 
      this.geolocation= this.fb.group({
        search:[''],
        address: ['', Validators.required],
        lattitude: [''],
        longitude: [''],
        quantity:['',Validators.required],
        typeof:['',Validators.required],
        units:['',Validators.required]
      }) 
    }
  
  ngOnInit(): void {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.getAddress(this.latitude, this.longitude);
          this.zoom = 12;
        });
      });
    });
  }
  
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
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
    this.getAddress(this.latitude, this.longitude);
  }
  
  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.geolocation.controls['lattitude'].setValue(latitude);
          this.geolocation.controls['longitude'].setValue(longitude);
          this.geolocation.controls['address'].setValue(results[0].formatted_address);
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

}
