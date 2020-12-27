import { Component, AfterViewInit, Input, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-tabla-datos',
  templateUrl: './tabla-datos.component.html',
  styleUrls: ['./tabla-datos.component.css']
})
export class TablaDatosComponent implements AfterViewInit, OnInit {
  
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['fecha','temperaturaAmbiente','humedadAmbiente','humedadSuelo','viento','direccionViento','lluvia','precipitaciones','luz'];

  @ViewChild(MatPaginator) paginator: MatPaginator;  

  /* @Input() set array_data(arr:any){
    this.dataSource = new MatTableDataSource(arr);
  } */

  @Input() array_data:any[];

  constructor(private cdRef: ChangeDetectorRef) { }

  addElements():void {
    this.dataSource = new MatTableDataSource(this.array_data);
    this.cdRef.detectChanges();
  }

  ngOnInit():void {
    this.addElements();
    this.paginator._intl.itemsPerPageLabel = 'Datos por pagina:';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  
}




