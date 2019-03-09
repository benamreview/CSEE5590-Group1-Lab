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
  @ViewChild('query') results: ElementRef;
  show = [];
  queryValue: any;
  resultList = [];
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

    this.currentLanguage = this.languages[0]; // default to English
    // although the Webspeech API supports both English and Spanish
    this.speechRecognizer.initialize(this.currentLanguage);
    // Initialize Recognition
    this.initRecognition();
    this.notification = null;
  }

  /**
   * This is the main function that takes in user's input and displays 5 relevant results retrieved from Google Knowledge Graph API.
   */
  getResults() {
    this.resultList = [];
    // Client secret = BECAJGTPPQH1JHENLMG2IZO5XCSNLTWWTGXDYCOBXYOXJTI1
    // Client ID = S1T2Y5NEXYMSXAVLSV24OONNXG14Z02EVBW3HKPO5DTVTNL3
    // this.recipeValue = this.recipes.nativeElement.value;
    this.queryValue = this.results.nativeElement.value;
    console.log(this.queryValue);
    if (this.queryValue != null && this.queryValue != '') {
      // Limit here is 5 results
      this._http.get('https://kgsearch.googleapis.com/v1/entities:search?' +
        'query=' + this.queryValue +
        '&key=AIzaSyB087vg5c4hTnohVi4sjP63cHv4Eh3jt2s' +
        '&limit=5&indent=True')
        .subscribe((data: any) => {
          console.log(data.itemListElement[0]['result']['name']);

          for (let i = 0; i < data.itemListElement.length; i++) {
            this.show.push('none');
            this.resultList[i] = {
              'id': i,
              'name': data.itemListElement[i]['result']['name'],
              'description': data.itemListElement[i]['result']['description'],
            };
            if (data.itemListElement[i]['result']['image'] != null) {
              this.resultList[i].imgURL =  data.itemListElement[i]['result']['image']['contentUrl'];
            }
            if (data.itemListElement[i]['result']['detailedDescription'] != null) {
              this.resultList[i].detailedDescription =  data.itemListElement[i]['result']['detailedDescription']['articleBody'];
            }
            console.log(this.resultList[i]);

          }

        });
    }
  }

  /**
   * This modal is used to show only the profile picture of any particular entry
   * @param id
   */
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


  /// This Web-speech API was originally retrieved from this web Speech API
  // https://github.com/luixaviles/web-speech-angular
  startButton(event) {
    if (this.recognizing) {
      this.speechRecognizer.stop();
      return;
    }

    this.speechRecognizer.start(event.timeStamp);
  }
  private initRecognition() {
    this.speechRecognizer.onStart()
      .subscribe(data => {
        console.log('in start');
        this.finalTranscript = '';
        this.recognizing = true;
        this.notification = 'Activated. Listening...'
        this.detectChanges();
      });

    /**
     * end of recognition: resets every boolean back to beginning to hide notification
     */
    this.speechRecognizer.onEnd()
      .subscribe(data => {
        this.recognizing = false;
        this.detectChanges();
        this.notification = null;

      });

    /**
     * when words are processed, this function is called. The code is kept as original from the sample
     */
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

    /**
     * If errors such as permission errors occur, this function will execute
     */
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

  /**
   * This function will detect any changes to the data input in the front end.
   * This overrides any browser-related (default) change detection.
   */
  detectChanges() {
    this.changeDetector.detectChanges();
  }
}
