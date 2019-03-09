import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material/material.module';
import { SpeechRecognizerService } from './shared/services/speech-recognizer.service';
import { SpeechSynthesizerService } from './shared/services/speech-synthesizer.service';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  providers: [
    SpeechRecognizerService,
    SpeechSynthesizerService
  ]
})
export class WebSpeechModule { }
