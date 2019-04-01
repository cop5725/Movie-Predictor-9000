import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictiveAnalyticsComponent } from './predictive-analytics.component';

describe('PredictiveAnalyticsComponent', () => {
  let component: PredictiveAnalyticsComponent;
  let fixture: ComponentFixture<PredictiveAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PredictiveAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictiveAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
