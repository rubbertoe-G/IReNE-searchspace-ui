import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SearchSpaceService } from '../../../shared/services/searchspace.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DocumentMetadata } from '../../../shared/models/searchspace.model';
import { Router } from '@angular/router';
import { FilterService } from '../../../shared/services/filter.service';

@Component({
  selector: 'app-documents-table',
  templateUrl: './documents-table.component.html',
  styleUrls: ['./documents-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DocumentsTableComponent implements OnInit {
  @Input() show: boolean;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  tempEvent: Event;
  dataSource: MatTableDataSource<DocumentMetadata>;
  tempDataSource: MatTableDataSource<DocumentMetadata>;
  displayedColumns: string[] = ['title', 'authors', 'location',
    'publication_date', 'incident_date', 'modification_date', 'infrastructure_type',
    'damage_type', 'language', 'tag', 'actions'];
  filterSelection: Map<string, any> = new Map<string, any>([
    ['author', ''],
    ['infrastructure_type', ''],
    ['damage_type', ''],
    ['language', ''],
    ['tag', ''],
    ['incident_date', ''],
    ['publication_date', '']
  ]);

  constructor(
    private filter: FilterService,
    private documentService: SearchSpaceService,
    private router: Router
  ) {
  }

  applyFilter() {
    this.dataSource = this.filter.applyFilter(this.filterSelection, this.tempDataSource);
    if (this.tempEvent) {
      this.searchFilter(this.tempEvent);
    }
    this.paginateSort(this.dataSource);
  }

  searchFilter(event: Event) {
    if (event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.tempEvent = event;
      if (filterValue === '') {
        this.dataSource.filter = filterValue.trim().toLowerCase();
      } else {
        this.dataSource.filter = filterValue.trim().toLowerCase();
      }
    }
  }

  paginateSort(table: MatTableDataSource<DocumentMetadata>) {
    table.sort = this.sort;
    table.paginator = this.paginator;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this.documentService.getDocuments().add(() => {
      this.dataSource = new MatTableDataSource<DocumentMetadata>(this.documentService.documents);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate =
        (data: DocumentMetadata, filters: string, ) => {
          const matchFilter = [];
          const filterArray = filters.split(' ');
          const columns = (Object as any).values(data);
          filterArray.forEach(filter => {
            const customFilter = [];
            columns.forEach(column => customFilter.push(column.toString().toLowerCase().includes(filter)));
            matchFilter.push(customFilter.some(Boolean)); // OR
          });
          return matchFilter.every(Boolean); // AND
        };
      this.tempDataSource = this.dataSource;
    });
  }

  selectionEvent(selection: any, type: string) {
    this.filterSelection.set(type, selection);
  }

  searchEvent(event: Event) {
    this.tempEvent = event;
  }
  previewDoc(docId: string) {
    this.router.navigate([`/preview/${docId}`]);
  }
}

