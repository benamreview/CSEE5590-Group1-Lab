import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// App Components
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {ProfileComponent} from './profile/profile.component';
import {RegisterComponent} from './register/register.component';
// Material2 Components
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule
} from '@angular/material';
import {LayoutModule} from '@angular/cdk/layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {ApiService} from './core/services/api.service';
import {UserService} from './core/services/user.service';
import {AuthGuardService} from './core/services/auth-guard.service';
import {JwtService} from './core/services/jwt.service';
import {HttpClientModule} from '@angular/common/http';

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
    MatCardModule, MatFormFieldModule, MatInputModule, MatGridListModule, AppRoutingModule, HttpClientModule
  ],
  providers: [ApiService, UserService, AuthGuardService, JwtService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
