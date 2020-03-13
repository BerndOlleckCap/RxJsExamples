import {Component} from '@angular/core';
import {from} from 'rxjs';
import {map} from 'rxjs/operators';
import {DateUtils} from '../../utils/DateUtils';

@Component({
  selector: 'app-squares',
  templateUrl: './squares.component.html',
  styleUrls: ['./squares.component.css']
})
export class SquaresComponent {

  constructor() {
  }

  log = 'Log:';

  printSquares() {
    const input$ = from([1, 2, 3, 4, 5]);
    input$.pipe(
      map(value => value * value)
    ).subscribe(result => this.log = this.log.concat('\n', DateUtils.timeNowString(), ' ' + result));
  }


}
