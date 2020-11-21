import { Component, AfterViewInit, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Prototipo } from '@core/models/prototipo';



@Component({
  selector: 'app-tabla-datos',
  templateUrl: './tabla-datos.component.html',
  styleUrls: ['./tabla-datos.component.css']
})
export class TablaDatosComponent implements AfterViewInit {
  
  displayedColumns: string[] = ['fecha', 'temperatura', 'humedad', 'viento', 'precipitacion'];
  dataSource: MatTableDataSource<any> ;

  @Input() set array_data(arr:any[]){
    this.dataSource = new MatTableDataSource<any>(arr);
  };

    @ViewChild(MatPaginator) paginator: MatPaginator;
  
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
    }
  
}






