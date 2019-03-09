import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleKGSearchComponent } from './google-kgsearch.component';

describe('GoogleKGSearchComponent', () => {
  let component: GoogleKGSearchComponent;
  let fixture: ComponentFixture<GoogleKGSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleKGSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleKGSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
