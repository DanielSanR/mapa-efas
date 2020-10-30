import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Estacion } from '@core/models/estacion';


@Component({
  selector: 'app-estacion',
  templateUrl: './estacion.component.html',
  styleUrls: ['./estacion.component.css']
})


export class EstacionComponent implements OnInit {

  stationData: Estacion;

  result = [
    {first: 'First', head: [{head: 'head'}, {head: 'head'}, {head: 'head'}, {head: 'head'}, {head: 'head'}, {head: 'head'}, {head: 'head'}, {head: 'head'}],  body: [{head: 'body1'}, {head: 'body1'}, {head: 'body1'}, {head: 'bodi1'}, {head: 'body1'}, {head: 'body1'}, {head: 'body1'}, {head: 'body1'}]}, 
    {first: 'Second' , head: [{head: 'head'}, {head: 'head'}, {head: 'head'}, {head: 'head'}, {head: 'head'}, {head: 'head'}, {head: 'head'}, {head: 'head'}], body: [{head: 'body1'}, {head: 'body1'}, {head: 'body1'}, {head: 'bodi1'}, {head: 'body1'}, {head: 'body1'}, {head: 'body1'}, {head: 'body1'}]}, 
    {first: 'Third', head: [{head: 'head'}, {head: 'head'}, {head: 'head'}, {head: 'head'}, {head: 'head'}, {head: 'head'}, {head: 'head'}, {head: 'head'}], body: [{head: 'body1'}, {head: 'body1'}, {head: 'body1'}, {head: 'bodi1'}, {head: 'body1'}, {head: 'body1'}, {head: 'body1'}, {head: 'body1'}]}, 
    {first: 'Fourth', head: [{head: 'head'}, {head: 'head'}, {head: 'head'}, {head: 'head'}, {head: 'head'}, {head: 'head'}, {head: 'head'}, {head: 'head'}], body: [{head: 'body1'}, {head: 'body1'}, {head: 'body1'}, {head: 'bodi1'}, {head: 'body1'}, {head: 'body1'}, {head: 'body1'}, {head: 'body1'}]}
    ];

  constructor(  public dialogRef: MatDialogRef<EstacionComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {

                  this.stationData = data.element;

  
                }

  
  ngOnInit(): void {
    
  }

  

}


