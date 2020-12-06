import { Component, OnInit } from '@angular/core';
import { MatCarousel, MatCarouselComponent } from '@ngmodule/material-carousel';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  slides = [{'image': 'https://gsr.dev/material2-carousel/assets/demo.png'}, 
            {'image': 'http://lorempixel.com/640/480/abstract/'},
            {'image': 'http://lorempixel.com/640/480/business/'}, 
            {'image': 'http://lorempixel.com/640/480/cats/'}, 
            {'image': 'http://lorempixel.com/640/480/city/'}];

  ngOnInit(): void {
    if (localStorage.getItem('logout')=='false'){
      location.reload()
      localStorage.setItem('logout','true');
      localStorage.removeItem('login')
    }
  }
}
