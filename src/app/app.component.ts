import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cluster } from './cluster';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule
    ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tdf';
  serverModels = ['HP' , 'Cisco', 'Dell'] ;
  configTypes = ['Standard' , 'High-Availability'] ;

  clusterModel = new Cluster('cluster-1', 'HP', 2, 'Standard');
}
