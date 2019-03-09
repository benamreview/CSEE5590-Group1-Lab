import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from "./header/header.component";
import { HomeComponent } from './home/home.component';
import {HttpClientModule} from "@angular/common/http";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { GoogleKGSearchComponent } from './google-kgsearch/google-kgsearch.component';
import { SharedModule } from './shared/shared.module';
import { WebSpeechModule } from './web-speech/web-speech.module';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    GoogleKGSearchComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    WebSpeechModule,
    NgbModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
