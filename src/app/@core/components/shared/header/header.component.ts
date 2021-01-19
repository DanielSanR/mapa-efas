import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {


  @Output() public sidenavToggle = new EventEmitter();

  constructor(private _location: Location) { }

  ngOnInit(): void {
  }

  back():void {
    this._location.back();  
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

}
