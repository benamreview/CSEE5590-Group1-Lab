import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ChangeDetectorRef} from '@angular/core';
import { SpeechRecognizerService } from '../web-speech/shared/services/speech-recognizer.service';

import { SpeechNotification } from '../web-speech/shared/model/speech-notification';
import { SpeechError } from '../web-speech/shared/model/speech-error';
import { ActionContext } from '../web-speech/shared/model/strategy/action-context';
@Component({
  selector: 'app-google-kgsearch',
  templateUrl: './google-kgsearch.component.html',
  styleUrls: ['./google-kgsearch.component.css']
})
export class GoogleKGSearchComponent implements OnInit {
  @ViewChild('place') places: ElementRef;
  show = [];
  placeValue: any;
  venueList = [];
  finalTranscript = '';
  recognizing = false;
  notification: string;
  languages: string[] =  ['en-US', 'es-ES'];
  currentLanguage: string;
  actionContext: ActionContext = new ActionContext();
  constructor(private _http: HttpClient, private changeDetector: ChangeDetectorRef,
              private speechRecognizer: SpeechRecognizerService) {
  }

  ngOnInit() {

    this.currentLanguage = this.languages[0];
    this.speechRecognizer.initialize(this.currentLanguage);
    this.initRecognition();
    this.notification = null;
  }

  /**
   * This is the main function that takes in user's input and displays 10 nearby restaurants based on the entered location.
   */
  getVenues() {
    this.venueList = [];
    // Client secret = BECAJGTPPQH1JHENLMG2IZO5XCSNLTWWTGXDYCOBXYOXJTI1
    // Client ID = S1T2Y5NEXYMSXAVLSV24OONNXG14Z02EVBW3HKPO5DTVTNL3
    // this.recipeValue = this.recipes.nativeElement.value;
    this.placeValue = this.places.nativeElement.value;
    console.log(this.placeValue);
    if (this.placeValue != null && this.placeValue != '') {
      this._http.get('https://kgsearch.googleapis.com/v1/entities:search?' +
        'query=' + this.placeValue +
        '&key=AIzaSyB087vg5c4hTnohVi4sjP63cHv4Eh3jt2s' +
        '&limit=5&indent=True')
        .subscribe((data: any) => {
          console.log(data.itemListElement[0]['result']['name']);

          for (let i = 0; i < data.itemListElement.length; i++) {
            this.show.push('none');
            this.venueList[i] = {
              'id': i,
              'name': data.itemListElement[i]['result']['name'],
              'description': data.itemListElement[i]['result']['description'],
            };
            if (data.itemListElement[i]['result']['image'] != null) {
              this.venueList[i].imgURL =  data.itemListElement[i]['result']['image']['contentUrl'];
            }
            if (data.itemListElement[i]['result']['detailedDescription'] != null) {
              this.venueList[i].detailedDescription =  data.itemListElement[i]['result']['detailedDescription']['articleBody'];
            }
            console.log(this.venueList[i]);

          }

        });
    }
  }
  showModal(id) {
    console.log('in showmodal');
    console.log(id);
    this.show[id] = 'block';
    console.log(this.show[id]);

  }
  hideModal (id) {
    console.log('in hidemodal');
    console.log(id);
    this.show[id] = 'none';
  }


  /// Web-speech API
  startButton(event) {
    if (this.recognizing) {
      this.speechRecognizer.stop();
      return;
    }

    this.speechRecognizer.start(event.timeStamp);
  }

  onSelectLanguage(language: string) {
    this.currentLanguage = language;
    this.speechRecognizer.setLanguage(this.currentLanguage);
  }

  private initRecognition() {
    this.speechRecognizer.onStart()
      .subscribe(data => {
        console.log('in start');
        this.finalTranscript = '';
        this.recognizing = true;
        this.notification = 'I\'m listening...';
        this.detectChanges();
      });

    this.speechRecognizer.onEnd()
      .subscribe(data => {
        this.recognizing = false;
        this.detectChanges();
        this.notification = null;

      });

    this.speechRecognizer.onResult()
      .subscribe((data: SpeechNotification) => {
        const message = data.content.trim();
        if (data.info === 'final_transcript' && message.length > 0) {
          this.finalTranscript = `${this.finalTranscript}\n${message}`;
          this.actionContext.processMessage(message, this.currentLanguage);
          this.detectChanges();
          this.actionContext.runAction(message, this.currentLanguage);
        }
      });

    this.speechRecognizer.onError()
      .subscribe(data => {
        switch (data.error) {
          case SpeechError.BLOCKED:
          case SpeechError.NOT_ALLOWED:
            this.notification = `Cannot run the demo.
            Your browser is not authorized to access your microphone. Verify that your browser has access to your microphone and try again.
            `;
            break;
          case SpeechError.NO_SPEECH:
            this.notification = `No speech has been detected. Please try again.`;
            break;
          case SpeechError.NO_MICROPHONE:
            this.notification = `Microphone is not available. Plese verify the connection of your microphone and try again.`;
            break;
          default:
            this.notification = null;
            break;
        }
        this.recognizing = false;
        this.detectChanges();
      });
  }

  detectChanges() {
    this.changeDetector.detectChanges();
  }
}
