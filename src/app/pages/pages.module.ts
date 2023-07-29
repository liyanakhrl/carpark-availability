import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { PagesComponent } from "./pages.component";
import { PagesRoutingModule } from "./pages.routing.module";
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    DashboardComponent ,
    PagesComponent, 
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,  
    HttpClientModule
  ], 
})
export class PagesModule { }
