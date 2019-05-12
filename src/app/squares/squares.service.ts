import {Injectable} from '@angular/core';
import {delay, map, throttle, throttleTime} from 'rxjs/operators';
import {from} from 'rxjs/internal/observable/from';
import {interval} from 'rxjs';
import {tap} from 'rxjs/internal/operators/tap';
import {zip} from 'rxjs/internal/observable/zip';
import {DateUtils} from '../utils/DateUtils';
import {Utils} from '../utils/Utils';

@Injectable({
  providedIn: 'root'
})
export class SquaresService {

  constructor() {
  }

  printSquares() {
    const input$ = from([1, 2, 3, 4, 5]);
    input$.pipe(
      map(value => value * value)
    ).subscribe(result => Utils.log(result));
  }

  printSquaresWithDelay() {
    const input$ = from([1, 2, 3, 4, 5]);
    zip(
      input$,
      interval(1000)
    ).pipe(
      map(([value, timer]) => value),
      map(value => value * value)
    ).subscribe(result => Utils.log(result));
  }
}
