import { DataSource } from '@angular/cdk/table';
import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PrototipoDatos } from '../../../models/prototipoDatos';
import { datoPorFecha } from '../../../models/datosPorFecha';
   
@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
// 'position', 'desc',
export class TablaComponent implements OnInit,AfterViewInit {
  datosPrototipo : PrototipoDatos;
  stringViento = [ 'NORTE','NORESTE','ESTE','SURESTE','SUR','SUROESTE','OESTE','NOROESTE']
  tempor : datoPorFecha
  dataSource: MatTableDataSource<datoPorFecha>;
  displayedColumns: string[] = [
  'fecha',
  'temperaturaAmbiente',
  'humedadAmbiente',
  'humedadSuelo',
  'viento',
  'direccionViento',
  'lluvia',
  'precipitaciones',
  'luz'];

  // tslint:disable-next-line: variable-name
  // []
 @Input() set dato_form(prototipo: datoPorFecha[]){
 
    const arr: datoPorFecha[] = prototipo;
 
    this.dataSource = new MatTableDataSource<datoPorFecha>(arr); // console.log(this.dataSource.data);
  
  
    } 


constructor() { }
  ngOnInit(): void {
   
  }
@ViewChild(MatPaginator) paginator: MatPaginator;
ngAfterViewInit() {

  this.dataSource.paginator = this.paginator;
  this.paginator._intl.itemsPerPageLabel = "Datos por página : "  
  }

}

