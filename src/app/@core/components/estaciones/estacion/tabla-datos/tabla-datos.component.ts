import { Component, AfterViewInit, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Estacion } from '@core/models/estacion';



@Component({
  selector: 'app-tabla-datos',
  templateUrl: './tabla-datos.component.html',
  styleUrls: ['./tabla-datos.component.css']
})
export class TablaDatosComponent implements AfterViewInit {
  
  displayedColumns: string[] = ['fecha', 'temperatura', 'humedad', 'viento', 'precipitacion'];
  dataSource: MatTableDataSource<any> ;

  @Input() set station_id(id:number[]){
    let arr:any[] = [{fecha: '01-05-2020', temperatura: 25, humedad: 50, viento: 40, precipitacion: 100}];
    
    
    
    this.dataSource = new MatTableDataSource<any>(arr);
  };

    @ViewChild(MatPaginator) paginator: MatPaginator;
  
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
    }
  
}






