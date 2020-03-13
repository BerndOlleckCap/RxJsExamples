import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
import {FormsModule} from '@angular/forms';
import {SquaresComponent} from './usecases/squares/squares.component';
import {SquaresWithDelayComponent} from './usecases/squares-with-delay/squares-with-delay.component';
import {SearchComponent} from './usecases/search/search.component';
import {TrainingExamplesComponent} from './training-examples/training-examples.component';
import {ChildComponent} from './expression-changed-exception/child.component';
import {ExpressionChangedExceptionComponent} from './expression-changed-exception/expression-changed-exception.component';
import { TriggerObservableComponent } from './patterns/trigger-observable/trigger-observable.component';

@NgModule({
  declarations: [
    AppComponent,
    SquaresComponent,
    SquaresWithDelayComponent,
    SearchComponent,
    TrainingExamplesComponent,
    ExpressionChangedExceptionComponent,
    ChildComponent,
    ChildComponent,
    TriggerObservableComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatTabsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
