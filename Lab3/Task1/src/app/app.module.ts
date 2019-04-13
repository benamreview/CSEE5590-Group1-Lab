import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// App Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

// Material2 Components
import {
  MatButtonModule, MatMenuModule, MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule, MatCardModule,
  MatFormFieldModule, MatInputModule, MatGridListModule
} from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { AppRoutingModule } from './app-routing.module';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule, MatMenuModule, LayoutModule, MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatGridListModule, AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
