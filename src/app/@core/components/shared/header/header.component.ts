import { Component, OnInit, Output, EventEmitter, QueryList } from '@angular/core';
import { Location } from '@angular/common'
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  baseURL: boolean;

  @Output() public sidenavToggle = new EventEmitter();
  
  constructor(private _location: Location,private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
     if (this._location.path() !== '') {
       this.baseURL = false;
     } else {
       this.baseURL = true;
     }
   });
   
  }

  back():void {
   
    this._location.back();  
  }

  public onToggleSidenav = () => {
  
    this.sidenavToggle.emit();
  }

}
