import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Estacion } from '@core/models/estacion';


@Component({
  selector: 'app-tabla-datos',
  templateUrl: './tabla-datos.component.html',
  styleUrls: ['./tabla-datos.component.css']
})
export class TablaDatosComponent implements OnInit {
  

  displayedColumns: string[] = ['id', 'descripcion', 'lat', 'lng'];
  dataSource: MatTableDataSource<Estacion>;

  @Input() set data(value:Estacion[]) {
    console.log('value: ', value);
    this.dataSource = new MatTableDataSource<Estacion>(value);
  };

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;


  ngOnInit() {
    this.dataSource.sort = this.sort;

    this.dataSource.paginator = this.paginator;
  }






  //--------------------------------------------------------------//

  /* @Input() data:Estacion[]=[];
  displayedColumns: string[] = ['id', 'descripcion', 'lat', 'lng'];
  dataSource = new MatTableDataSource<Estacion>(this.data);

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  
  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  } */

  

}



