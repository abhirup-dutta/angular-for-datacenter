import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from "@clr/angular";
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		CommonModule,
		FormsModule,
		ClarityModule,
		HttpClientModule,
		HttpClient
		],
	providers: [],
	boostrap: [AppComponent]
	})
export class AppModule {}
