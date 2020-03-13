import {Component, OnDestroy, OnInit} from '@angular/core';
import {merge, Observable, Subject, Subscription, timer} from 'rxjs';
import {map, takeUntil, tap, withLatestFrom} from 'rxjs/operators';

@Component({
  selector: 'app-trigger-observable',
  templateUrl: './trigger-observable.component.html',
  styleUrls: ['./trigger-observable.component.css']
})
export class TriggerObservableComponent implements OnInit, OnDestroy {

  private onDestroy$ = new Subject();
  private logStartTime = new Date().getTime();


  private timer$: Observable<number>;
  /**
   * a small indirection to allow us to basically switch the timer on or off
   */
  private sourceSubject$ = new Subject();
  private sourcePipe$ = this.sourceSubject$.pipe(
    tap((value) => this.log('Got value from source', value)),
    takeUntil(this.onDestroy$)
  );

  private trigger$ = new Subject();
  private triggerPipe$ = this.trigger$.pipe(
    tap(() => this.log('Got trigger event')),
    takeUntil(this.onDestroy$),
    withLatestFrom(this.sourceSubject$),
    map(([valueFromTrigger, valueFromSource]) => valueFromSource)
  );

  private output$ = merge(this.sourcePipe$, this.triggerPipe$);
  private timerSubscription: Subscription;

  constructor() {
  }

  ngOnInit(): void {
    this.output$.subscribe((value) => this.log('Result Observable got value', value));
  }

  public startSource(): void {
    this.stopSource();
    this.resetLogTime();
    this.timer$ = timer(0, 5000);
    this.timerSubscription = this.timer$.subscribe(this.sourceSubject$);
  }

  public stopSource(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
      this.timer$ = null;
    }
  }

  public triggerAdditionalValue(): void {
    this.trigger$.next();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private resetLogTime() {
    this.logStartTime = new Date().getTime();
  }

  private log(...args) {
    console.log(new Date().getTime() - this.logStartTime, ...args);
  }


}
