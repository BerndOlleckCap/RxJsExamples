import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatFormFieldModule, MatInputModule, MatTabsModule} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {SquaresComponent} from './squares/squares.component';
import {SquaresWithDelayComponent} from './squares-with-delay/squares-with-delay.component';
import {SearchComponent} from './search/search.component';
import { TrainingExamplesComponent } from './training-examples/training-examples.component';

@NgModule({
  declarations: [
    AppComponent,
    SquaresComponent,
    SquaresWithDelayComponent,
    SearchComponent,
    TrainingExamplesComponent
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
