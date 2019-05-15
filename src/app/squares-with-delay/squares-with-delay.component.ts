import {Component} from '@angular/core';
import {from, interval, zip} from 'rxjs';
import {map} from 'rxjs/operators';
import {DateUtils} from '../utils/DateUtils';

@Component({
  selector: 'app-squares-with-delay',
  templateUrl: './squares-with-delay.component.html',
  styleUrls: ['./squares-with-delay.component.css']
})
export class SquaresWithDelayComponent {

  constructor() {
  }

  log = 'Log:';

  printSquaresWithDelay() {
    const input$ = from([1, 2, 3, 4, 5]);
    zip(
      input$,
      interval(1000)
    ).pipe(
      map(([value, timer]) => value),
      map(value => value * value)
    ).subscribe(result => this.log = this.log.concat('\n', DateUtils.timeNowString(), ' ' + result));
  }

}
