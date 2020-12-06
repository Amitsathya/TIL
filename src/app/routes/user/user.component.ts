import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireDatabase} from '@angular/fire/database';
import * as firebase from 'firebase';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: FormGroup;
  div: number = 1;
  x= null;
  dataSource = new MatTableDataSource();
  dataSource1 = new MatTableDataSource();
  data : any = [];
  data1 : any = [];
  constructor(private fb: FormBuilder,
    private router: Router,private db: AngularFireDatabase) {
    this.user = this.fb.group({
      fname: ['',Validators.required],
      lname: ['',Validators.required]
    })
  }

  ngOnInit(): void {
  this.userInfo()
  this.orderInfo()
  if (localStorage.getItem('type')=='c'){
    this.x="CarrierInfo"
   }else{
     this.x="ShipperInfo"
   }
  
}

  orderInfo(){
    firebase.database().ref('/OrderInfo/').once('value').then((snapshot) => {
      var username = (snapshot.val() ) || 'Anonymous';
      for (const [key, value] of Object.entries(username)) {
        if (value['shipper_uid']==localStorage.getItem('session') && value['status']=="Completed"){
          this.data.push({'order_id':key,'origin':value['orign']});
      } else if(value['shipper_uid']==localStorage.getItem('session') && value['status']=="new"){
        this.data1.push({'order_id':key,'origin':value['orign']});
      }}
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource1 = new MatTableDataSource(this.data1);
    })
  }
  
  userInfo(){
    let y=null
    if (localStorage.getItem('type')=='c'){
      y="/CarrierInfo/"
    } else{
      y="/ShipperInfo/"
    }
    firebase.database().ref(y).once('value').then((snapshot) => {
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
    let tutorialsRef = this.db.list(this.x)
    tutorialsRef.update(localStorage.getItem('session'), { firstName: this.user.value.fname,lastName:this.user.value.lname });
  }
  onClick(num){
    this.div=num
  }
  
  reorder(elem){
    this.router.navigate(['shippermap'], { queryParams: { id: elem.order_id,"edit":false } });
  }
  
  editorder(elem){
    this.router.navigate(['shippermap'], { queryParams: { id: elem.order_id, "edit":true } });
  }
  
  cancelorder(elem){
    let tutorialsRef = this.db.list("OrderInfo")
    tutorialsRef.remove(elem);
    console.log(elem);
    location.reload();
  }

  displayedColumns: string[] = ['date', 'order_id', 'weight', 'origin','destination','action'];
  // dataSource = ELEMENT_DATA;

}
