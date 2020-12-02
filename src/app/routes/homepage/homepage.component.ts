import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  ngOnInit(): void {
    if (localStorage.getItem('logout')=='false'){
      location.reload()
      localStorage.setItem('logout','true');
      localStorage.removeItem('login')
    }
  }
}
