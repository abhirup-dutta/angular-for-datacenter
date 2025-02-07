import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Cluster } from './cluster';
import { ImagingService } from './imaging.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tdf';
  serverMakeOptions = ['HP' , 'Cisco', 'Dell'];
  serverNicOptions = ['Mellanox' , 'Chelsio', 'NVIDIA'];
  configTypes = ['Standard' , 'High-Availability'];
  clusterModel = new Cluster();
  receivedData = '';
  errorMsg = '';
  successMsg = 'Verified and started cluster configuration.'
  submitted = false;

  /*
   * Form Builder - creates the initial form with validations
   */
  private _formBuilder = inject(FormBuilder);
  clusterForm = this._formBuilder.group({
    clusterName: ['Cluster-1.1', [Validators.required, Validators.minLength(3)]],
    serverDetails: this._formBuilder.group({
      serverMake: ['HP'],
      serverModel: ['All Models', Validators.required],
      serverNic: ['Mellanox']
    }),
    numberOfServers: [1, Validators.required],
    configType: ['Standard']
  });

  /*
   * Getter methods for code ease in html
   */
  get clusterName() {
    return this.clusterForm?.get('clusterName');
  }
  get serverModel() {
    return this.clusterForm?.get('serverDetails')?.get('serverModel');
  }
  get numberOfServers() {
    return this.clusterForm?.get('numberOfServers');
  }

  constructor(private _imagingService: ImagingService) {}

  /*
   * applyRecommendedConfig()
   * This goes in reverse direction and
   * fills form data from code.
   * This is the recommended configuration of
   * number of servers and configuration type
   */
  applyRecommendedConfig() {
    this.clusterForm.patchValue({
      numberOfServers: 2,
      configType: 'High-Availability'
    });
  }

  /*
   * onSubmit()
   * Method for when the form is submitted via 'Configure Cluster' Button
   * We first do form manipulation,
   * Then we pull it into Model data,
   * Then we pass the Model data to the Backend using Imaging Service
   */
  onSubmit() {
    console.log("Form Data Received:");
    console.log(this.clusterForm.value);

    /*
     * Transfer values from Form to Model
     */
    this.clusterModel.name = this.clusterForm.get('clusterName')!.value!;
    this.clusterModel.serverMake = this.clusterForm
      .get('serverDetails')!
      .get('serverMake')!.value!;
    this.clusterModel.serverModel = this.clusterForm
      .get('serverDetails')!
      .get('serverModel')!.value!;
    this.clusterModel.serverNic = this.clusterForm
      .get('serverDetails')!
      .get('serverNic')!.value!;
    this.clusterModel.numberOfServers = this.clusterForm.get('numberOfServers')!.value!;
    console.log("Cluster Configuration Initiated:");
    if (this.clusterModel.numberOfServers === 1) {
      this.clusterModel.config = 'Standard';
    } else {
      this.clusterModel.config = this.clusterForm.get('configType')!.value!;
    }
    console.log(this.clusterModel);

    /*
     * Transfer values from Model to Backend
     */
    console.log('Sending data to imaging server ...');
    this._imagingService.startImaging(this.clusterModel)
      .subscribe(
        data => {
            console.log('Success!', data);
            this.receivedData = data;
            this.errorMsg = '';
          },
        error => {
            this.errorMsg = error.statusText;
            this.receivedData = '';
          }
        );

    /*
     * Mark submitted
     * Used as a check for alert-success message from Backend
     */
    this.submitted = true;
  }
}
