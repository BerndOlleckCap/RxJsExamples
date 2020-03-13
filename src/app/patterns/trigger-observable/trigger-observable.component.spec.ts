import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TriggerObservableComponent } from './trigger-observable.component';

describe('TriggerObservableComponent', () => {
  let component: TriggerObservableComponent;
  let fixture: ComponentFixture<TriggerObservableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TriggerObservableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TriggerObservableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
