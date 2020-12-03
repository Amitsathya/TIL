import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireDatabase} from '@angular/fire/database';
import * as firebase from 'firebase';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: FormGroup;
  div: number = 1;
  constructor(private fb: FormBuilder,private db: AngularFireDatabase) {
    this.user = this.fb.group({
      fname: ['',Validators.required],
      lname: ['',Validators.required]
    })
  }

  ngOnInit(): void {
  this.userInfo()
  }
  
  userInfo(){
    firebase.database().ref('/ShipperInfo/').once('value').then((snapshot) => {
      var username = (snapshot.val() ) || 'Anonymous';
      for (const [key, value] of Object.entries(username)) {
        if (key==localStorage.getItem('session')){
          this.user.controls['fname'].setValue(value['firstName']);
          this.user.controls['lname'].setValue(value['lastName']);
        }
      }
    });
  }
  update(){
    let tutorialsRef = this.db.list('ShipperInfo')
    tutorialsRef.update(localStorage.getItem('session'), { firstName: this.user.value.fname,lastName:this.user.value.lname });
  }
  onClick(num){
    this.div=num
  }

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

}
