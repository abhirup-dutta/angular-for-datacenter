import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Cluster } from './shared/cluster';
import { ImagingService } from './shared/imaging.service';
import { ServerModelValidator } from './shared/serverModel.validator';
import { touch } from '@cds/core/internal';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'tdf';
  clusterNameDefault = 'Cluster-1.1';
  serverMakeOptions = ['HP' , 'Cisco', 'Dell'];
  serverMakeDefault = this.serverMakeOptions[0];
  serverModelDefault = 'HPE ProLiant ML30 Gen11';
  serverNicOptions = ['Mellanox' , 'Chelsio', 'NVIDIA'];
  serverNicDefault = this.serverNicOptions[0];
  serverNicMinCount = 1;
  serverNicMaxCount = 4;
  configTypes = ['Standard' , 'High-Availability'];
  clusterModel = new Cluster();
  receivedData = '';
  errorMsg = '';
  successMsg = 'Verified and started cluster configuration.'
  submitted = false;

  /*
   * Form Group and Controls
   * To be initialized properly in ngOnInit()
   */
  clusterForm: FormGroup = new FormGroup({});
  private _formBuilder = inject(FormBuilder);

  /*
   * Getter methods for ease of accessing controls
   * both here and in html
   */
  get clusterName() {
    return this.clusterForm?.get('clusterName');
  }
  get serverMake() {
    return this.clusterForm?.get('serverDetails')?.get('serverMake');
  }
  get serverModel() {
    return this.clusterForm?.get('serverDetails')?.get('serverModel');
  }
  get allServerModels() {
    return this.clusterForm?.get('serverDetails')?.get('allServerModels');
  }
  get serverNicsList() {
    return this.clusterForm?.get('serverDetails')?.get('serverNicsList') as FormArray;
  }
  get numberOfServers() {
    return this.clusterForm?.get('numberOfServers');
  }

  constructor(private _imagingService: ImagingService) {}

  ngOnInit(): void {
    /*
    * Form Builder - creates the initial form with validations
    */
    this.clusterForm = this._formBuilder.group({
      clusterName: [this.clusterNameDefault,
        [Validators.required, Validators.minLength(3)]],
      serverDetails: this._formBuilder.group({
        serverMake: [this.serverMakeDefault],
        serverModel: [this.serverModelDefault, Validators.required],
        allServerModels: [false],
        serverNicsList: this._formBuilder.array(
          [this.serverNicDefault]
        )
      }),
      numberOfServers: [1, Validators.required],
      configType: ['Standard']
    }, { validator : ServerModelValidator });

    /*
     * We have an initial server model for HP as an example
     * where HP is the default server make
     * However, if the user changes the server make,
     * the default HP goes away, and error message is seen
     * if there is a mismatch between make and model.
     */
    this.serverMake?.valueChanges
      .subscribe(touch => {
        if(!this.allServerModels?.value) {
          this.serverModel?.setValue("");
          this.serverModel?.markAsTouched();
        }
      })

    /*
     * Subscribe to value changes of Allow All Server Models checkbox
     * and accordingly change the validation requirements
     * of Server Model input textbox
     */
    this.allServerModels?.valueChanges
      .subscribe(checkedValue => {
        if (checkedValue) {
          this.serverModel?.clearValidators();
          this.clusterForm.clearValidators();
          this.serverModel?.setValue('All Models');
        } else {
          this.serverModel?.setValidators([Validators.required]);
          this.clusterForm.addValidators(ServerModelValidator);
        }
        this.serverModel?.updateValueAndValidity();
        this.clusterForm.updateValueAndValidity();
      });
  }

  /* METHODS */

  /*
   * Methods for changing the number of Sevrer NICs
   * We make sure there are 1-4 NICs only.
   * Also, we allow individual removals of NICs after they're added.
   * Methods are-
   * canAddMoreServerNics()
   * addServerNic()
   * canRemoveMoreServerNics()
   * removeServerNic(input: number)
   */
  canAddMoreServerNics() {
    return this.serverNicsList.length < this.serverNicMaxCount;
  }
  addServerNic() {
    var newServerNic = this._formBuilder.control(this.serverNicDefault);
    this.serverNicsList.push(newServerNic);
  }
  canRemoveMoreServerNics() {
    return this.serverNicsList.length > this.serverNicMinCount;
  }
  removeServerNic(index: number) {
    this.serverNicsList.removeAt(index);
  }

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
    var allServerModels = this.clusterForm
    .get('serverDetails')!
    .get('allServerModels')!.value!;
    if (allServerModels === true) {
      this.clusterModel.serverModel = "";
    } else {
      this.clusterModel.serverModel = this.clusterForm
        .get('serverDetails')!
        .get('serverModel')!.value!;
    }
    this.clusterModel.serverNicsList = this.clusterForm
      .get('serverDetails')!
      .get('serverNicsList')!.value!;
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
