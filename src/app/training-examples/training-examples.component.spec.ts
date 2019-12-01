import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingExamplesComponent } from './training-examples.component';

describe('TrainingExamplesComponent', () => {
  let component: TrainingExamplesComponent;
  let fixture: ComponentFixture<TrainingExamplesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingExamplesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingExamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
