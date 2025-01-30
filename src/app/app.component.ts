import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, FormArray, NgForm, FormsModule } from '@angular/forms';
import { Cluster } from './cluster';
import { ImagingService } from './imaging.service';

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
  serverModels = ['HP' , 'Cisco', 'Dell'];
  configTypes = ['Standard' , 'High-Availability'];

  clusterModel = new Cluster('cluster-1', 'HP', 2, 'Standard');
  errorMsg = '';

  constructor(private _imagingService: ImagingService) {}

  onSubmit(userForm: NgForm) {
    console.log("Form Data Received:");
    console.log(userForm.value);

    console.log("Cluster Configuration Initiated:");
    if (this.clusterModel.numberOfServers === 1) {
      this.clusterModel.config = 'Standard';
    }
    console.log(this.clusterModel);

    console.log('Sending data to imaging server ...');
    this._imagingService.startImaging(this.clusterModel)
      .subscribe(
        data => {
            console.log('Success!', data);
            this.errorMsg = '';
          },
        error => this.errorMsg = error.statusText
        );
  }
}
