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
  
  displayedColumns: string[] = ['fecha', 
                                'temperaturaAmbiente', 
                                'humedadAmbiente', 
                                'humedadSuelo', 
                                'viento', 
                                'direccionViento', 
                                'lluvia', 
                                'precipitaciones', 
                                'luz'
                              ];

  

  @Input() set array_data(arr:any[]){
    this.dataSource = new MatTableDataSource(arr);
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  
}




