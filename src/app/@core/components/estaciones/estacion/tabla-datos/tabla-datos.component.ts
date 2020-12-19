import { Component, AfterViewInit, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-tabla-datos',
  templateUrl: './tabla-datos.component.html',
  styleUrls: ['./tabla-datos.component.css']
})
export class TablaDatosComponent implements AfterViewInit {
  
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['fecha','temperaturaAmbiente','humedadAmbiente','humedadSuelo','viento','direccionViento','lluvia','precipitaciones','luz'];

  @ViewChild(MatPaginator) paginator: MatPaginator;  

  @Input() set array_data(arr:any){
    this.dataSource = new MatTableDataSource(arr);
    
  }


  ngAfterViewInit() {
    setTimeout(() => this.dataSource.paginator = this.paginator);
  }
  
  
  
}




