import { DataSource } from '@angular/cdk/table';
import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Prototipo } from '../../../models/prototipo';
 
@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
// 'position', 'desc',
export class TablaComponent implements AfterViewInit {
  dataSource: MatTableDataSource<Prototipo[]>;
  displayedColumns: string[] = [
  'datoxFecha',
  'temperatura',
  'humedad',
  'viento',
  'precipitacion'];

  // tslint:disable-next-line: variable-name
@Input() set dato_form(prototipo: any){
    this.dataSource = new MatTableDataSource<any>(prototipo); // console.log(this.dataSource.data);
 
    this.dataSource.paginator = this.paginator;
    }


constructor() { }
@ViewChild(MatPaginator) paginator: MatPaginator;
ngAfterViewInit() {
    
  }

}

