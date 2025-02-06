import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule, ClrIconModule } from "@clr/angular";
import { ClarityIcons, errorStandardIcon  } from '@cds/core/icon';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		ClarityModule,
		ClrIconModule,
		HttpClient
		],
	providers: [],
	boostrap: [AppComponent]
	})
export class AppModule {
	constructor() {
		ClarityIcons.addIcons(errorStandardIcon);
	}
}