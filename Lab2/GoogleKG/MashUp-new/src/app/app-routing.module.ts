import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {GoogleKGSearchComponent} from './google-kgsearch/google-kgsearch.component';
import { WebSpeechComponent } from './web-speech/web-speech.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { path: 'google-kgsearch', component: GoogleKGSearchComponent},
  { path: 'web-speech', component: WebSpeechComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
