import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import { RouterModule } from '@angular/router';
import {  SharedModule } from '../../shared/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {DocumentsComponent} from '../../modules/documents/documents.component';
import {CollabRequestComponent} from '../../modules/collab-request/collab-request.component';
import {HomeComponent} from '../../modules/home/home.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AboutComponent} from '../../about/about.component';



@NgModule({
  declarations: [
    DefaultComponent,
    DocumentsComponent,
    CollabRequestComponent,
    AboutComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MatSidenavModule,
    MatDividerModule,
    MatButtonModule,
    MatToolbarModule,
    FlexLayoutModule,
  ]
})
export class DefaultModule { }
