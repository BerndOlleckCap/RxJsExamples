import {Component} from '@angular/core';
import {
  asapScheduler,
  asyncScheduler,
  BehaviorSubject,
  combineLatest,
  concat,
  ConnectableObservable,
  forkJoin,
  fromEvent,
  interval,
  merge,
  Observable,
  of,
  queueScheduler,
  race,
  ReplaySubject,
  Subject,
  timer,
  zip
} from 'rxjs';
import {
  auditTime,
  bufferCount,
  bufferTime,
  catchError,
  concatMap,
  debounceTime,
  delay,
  filter,
  map,
  mergeMap,
  observeOn,
  pluck,
  publish,
  retry,
  sampleTime,
  share,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap,
  throttleTime,
  withLatestFrom
} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';

@Component({
  selector: 'app-training-examples',
  templateUrl: './training-examples.component.html',
  styleUrls: ['./training-examples.component.css']
})
export class TrainingExamplesComponent {

  title = 'InitialSet';
  static logStartTime = new Date().getTime();

  stop$ = new Subject();

  stop() {
    this.stop$.next();
  }

  static resetLogTime() {
    this.logStartTime = new Date().getTime();
  }

  static log(...args) {
    console.log(new Date().getTime() - this.logStartTime, ...args);
  }

  resetLogTime() {
    TrainingExamplesComponent.resetLogTime();
  }

  log(...args) {
    TrainingExamplesComponent.log(...args);
  }

  startSimpleCreation() {
    this.resetLogTime();

    const of$ = of('A', 'B', 'C', 'D');
    of$.subscribe(v => this.log('of:', v));

    const range$ = of(3, 5);
    range$.subscribe(v => this.log('range:', v));

    const promise = Promise.resolve('result');
    const fromPromise$ = fromPromise(promise);
    fromPromise$.subscribe(v => this.log('fromPromise:', v));
  }

  startSubjectCreation() {
    this.resetLogTime();

    const subject$ = new Subject();
    subject$.next('A');
    subject$.subscribe(v => this.log('subject:', v));
    subject$.next('B');

    const behaviourSubject$ = new BehaviorSubject('A');
    behaviourSubject$.subscribe(v => this.log('behaviourSubject:', v));
    behaviourSubject$.next('B');

    const replaySubject$ = new ReplaySubject(3);
    replaySubject$.next('A');
    replaySubject$.next('B');
    replaySubject$.subscribe(v => this.log('replaySubject (1):', v));
    replaySubject$.next('C');
    replaySubject$.next('D');
    replaySubject$.subscribe(v => this.log('replaySubject (2):', v));

    // other: AsyncSubject
  }

  startAsyncCreation() {
    this.resetLogTime();

    const interval$ = interval(1000).pipe(takeUntil(this.stop$));
    interval$.subscribe(v => this.log('interval:', v));

    const timer$ = timer(5000, 1000).pipe(takeUntil(this.stop$));
    timer$.subscribe(v => this.log('timer:', v));

    const fromEvent$ = fromEvent(document, 'click').pipe(takeUntil(this.stop$));
    fromEvent$.subscribe(v => this.log('fromEvent:', v));
  }

  private selfmadeSquareOperator(source$: Observable<number>): Observable<number> {
    return new Observable(subscriber => {
      TrainingExamplesComponent.log('selfmadeSquareOperator got subscription');
      const subscription = source$.subscribe(
        (value) => {
          TrainingExamplesComponent.log('selfmadeSquareOperator got next', value, 'and will send', value * value);
          subscriber.next(value * value);
        },
        (error) => {
          TrainingExamplesComponent.log('selfmadeSquareOperator got error', error);
          subscriber.error(error);
        },
        () => {
          TrainingExamplesComponent.log('selfmadeSquareOperator got complete');
          subscriber.complete();
        }
      );
      return () => {
        TrainingExamplesComponent.log('selfmadeSquareOperator got unsubscribe');
        subscription.unsubscribe();
      }
    });
  }

  startSelfmade() {
    this.resetLogTime();

    const observable$ = new Observable(subscriber => {
      this.log('Observable: got subscribed');
      for (let v = 1; v < 5; v++) {
        this.log('Observable: will next', v);
        subscriber.next(v);
        //      if (v==3) throw 'Nasty Bug';
      }
      this.log('Observable: will complete');
      subscriber.complete();
      return () => {
        this.log('Observable: was unsubscribed');
      }
    });

    this.log('Subscriber will subscribe');
    const subscription = observable$
      //      .pipe(take(2))
      .pipe(this.selfmadeSquareOperator)
      .subscribe({
        next: (value) => this.log('Subscriber: got next', value),
        error: (error) => this.log('Subscriber: got error', error),
        complete: () => this.log('Subscriber: got complete')
      });
    this.log('Subscriber did subscribe');
  }

  startSelfmadeTimed() {
    this.resetLogTime();

    const observable$ = new Observable(subscriber => {
      this.log('Observable: got subscribed');
      let v = 1;
      const intervalId = setInterval(
        () => {
          try {
            this.log('Observable: will next', v);
            subscriber.next(v++);
//            if (v==3) throw 'Nasty Bug';
            if (v >= 5) {
              this.log('Observable: will complete');
              clearInterval(intervalId);
              subscriber.complete();
            }
          } catch (error) {
            this.log('Observable: detected error');
            clearInterval(intervalId);
            subscriber.error(error);
          }
        },
        1000);
      return () => {
        this.log('Observable: was unsubscribed');
        clearInterval(intervalId);
      }
    });

    this.log('Subscriber will subscribe');
    const subscription = observable$
      //      .pipe(take(2))
      .pipe(this.selfmadeSquareOperator)
      .subscribe({
        next: (value) => this.log('Subscriber: got next', value),
        error: (error) => this.log('Subscriber: got error', error),
        complete: () => this.log('Subscriber: got complete')
      });
    this.log('Subscriber did subscribe');
  }

  startWithError() {
    this.resetLogTime();

    const interval$ = interval(1000).pipe(takeUntil(this.stop$));
    const withError$ = interval$.pipe(
      tap(() => this.log('before the potential error in the pipe')),
      map(v => {
        if (v === 2) {
          this.log('Throwing the error!');
          throw 'Error for ' + v;
        }
        return v;
      }),
      tap(() => this.log('after the potential error in the pipe'))
    );

    withError$.subscribe(
      v => this.log('Got value', v),
      e => this.log('Got error', e));
  }

  startCatchingErrors() {
    this.resetLogTime();

    const interval$ = interval(1000).pipe(takeUntil(this.stop$));
    const withError$ = interval$.pipe(
      tap(v => this.log('before the potential error in the pipe, value is ', v)),
      map(v => {
        if (v === 2) {
          this.log('Throwing the error!');
          throw 'Error for ' + v;
        }
        return v;
      }),
      tap(v => this.log('after the potential error in the pipe, value is ', v)),
      catchError( error => {
        this.log('caught error', error);
        return of('Recovery for error', 'and', 'further', 'values');
      }),
      tap(v => this.log('after the error handler in the pipe, value is ', v))
    );

    withError$.subscribe(
      v => this.log('Got value', v),
      e => this.log('Got error', e));
  }

  startWithErrorAndRetry() {
    this.resetLogTime();

    const interval$ = interval(1000).pipe(takeUntil(this.stop$));
    const withError$ = interval$.pipe(
      tap(() => this.log('before the potential error in the pipe')),
      map(v => {
        if (v === 2) {
          this.log('Throwing the error!');
          throw 'Error for ' + v;
        }
        return v;
      }),
      tap(() => this.log('after the potential error in the pipe')),
      retry(2),
      tap(() => this.log('after the retry in the pipe')),
    );

    withError$.subscribe(
      v => this.log('Got value', v),
      e => this.log('Got error', e));
  }

  startWithSwitchMapErrors() {
    this.resetLogTime();

    const interval$ = interval(1000).pipe(takeUntil(this.stop$));
    const withError$ = interval$.pipe(
      tap(v => this.log('before the potential error in the outer pipe, value is ', v)),
      switchMap( v => {
        return of(v).pipe(
          tap(v => this.log('before the potential error in the inner pipe, value is ', v)),
          map(v => {
            if (v === 2) {
              this.log('Throwing the error!');
              throw 'Error for ' + v;
            }
            return v;
          }),
          tap(v => this.log('after the potential error in the inner pipe, value is ', v))
        )
      }),
      tap(v => this.log('after the potential error in the outer pipe, value is ', v)),
    );

    withError$.subscribe(
      v => this.log('Got value', v),
      e => this.log('Got error', e));
  }

  startCatchingSwitchMapErrors() {
    this.resetLogTime();

    const interval$ = interval(1000).pipe(takeUntil(this.stop$));
    const withError$ = interval$.pipe(
      tap(v => this.log('before the potential error in the outer pipe, value is ', v)),
      switchMap( v => {
        return of(v).pipe(
          tap(v => this.log('before the potential error in the inner pipe, value is ', v)),
          map(v => {
            if (v === 2) {
              this.log('Throwing the error!');
              throw 'Error for ' + v;
            }
            return v;
          }),
          tap(v => this.log('after the potential error in the inner pipe, value is ', v)),
          catchError( error => {
            this.log('caught error in the inner pipe', error);
            return of('Recovery for error', 'and', 'further', 'values');
          }),
          tap(v => this.log('after the error handler in the inner pipe, value is ', v))
        )
      }),
      tap(v => this.log('after the potential error in the outer pipe, value is ', v)),
    );

    withError$.subscribe(
      v => this.log('Got value', v),
      e => this.log('Got error', e));
  }

  startNoScheduler() {
    this.resetLogTime();
    const subject$ = new Subject<boolean>();
    const obs$ = subject$.asObservable();

    obs$.subscribe(v => this.log('next value', v));

    this.log('Going to send next value');

    subject$.next(true);

    this.log('Sent next value');
  }

  startAsyncScheduler() {
    this.resetLogTime();
    const subject$ = new Subject<boolean>();

    const obs$ = subject$.asObservable();
    obs$.pipe(observeOn(asyncScheduler))
      .subscribe(v => this.log('next value', v));

    this.log('Going to send next value');

    subject$.next(true);

    this.log('Sent next value');
  }

  startMicrotaskVsPromise() {
    this.resetLogTime();
    queueMicrotask(() => this.log('queueMicrotask 1'));
    Promise.resolve().then(() => this.log('promise 1'));
    Promise.resolve().then(() => this.log('promise 2'));
    queueMicrotask(() => this.log('queueMicrotask 2'));
    this.log('Scheduling done!');
  }

  startSchedulerComparison() {
    this.resetLogTime();
    setTimeout(() => this.log('Now Macrotasks are been processed:'));
    Promise.resolve().then(() => this.log('Now Microtasks are being processed:'));

    const async$ = of('').pipe(
      startWith('asyncScheduler', asyncScheduler));

    const asap$ = of('').pipe(
      startWith('asapScheduler', asapScheduler));

    const queue$ = of('').pipe(
      startWith('queueScheduler', queueScheduler));

    merge(
      async$,
      asap$,
      queue$).pipe(
      filter(x => !!x)
    ).subscribe(this.log);

    this.log('after subscription');
  }

  startColdObservable() {
    this.resetLogTime();
    const cold$ = interval(1000);
    cold$.pipe(take(10)).subscribe((i) => this.log('#1:', i));
    setTimeout(
      () => cold$.pipe(take(10)).subscribe((i) => this.log('#2:', i))
      , 4000);
  }

  startHotObservable() {
    this.resetLogTime();
    const hot$ = fromEvent(document, 'click').pipe(
      map((clickEvent: MouseEvent) => ({x: clickEvent.clientX, y: clickEvent.clientY}))
    );
    hot$.pipe(take(5)).subscribe((pos) => this.log('#1:', pos));
    setTimeout(
      () => hot$.pipe(take(5)).subscribe((pos) => this.log('#2:', pos))
      , 4000);
  }

  startConvertHot1Observable() {
    this.resetLogTime();
    const cold$ = interval(1000);
    const hot$ = cold$.pipe(publish()) as ConnectableObservable<number>;
    hot$.connect();

    setTimeout(
      () => hot$.pipe(take(10)).subscribe((i) => this.log('#1:', i)),
      2000);
    setTimeout(
      () => hot$.pipe(take(10)).subscribe((i) => this.log('#2:', i)),
      4000);
  }

  startConvertHot2Observable() {
    this.resetLogTime();
    const cold$ = interval(1000);
    const hot$ = new Subject();
    cold$.subscribe(hot$);
    hot$.pipe(take(10)).subscribe((i) => this.log('#1:', i));
    setTimeout(
      () => hot$.pipe(take(10)).subscribe((i) => this.log('#2:', i))
      , 4000);
  }

  startConvertColdObservable() {
    this.resetLogTime();
    const hot$ = fromEvent(document, 'click').pipe(
      map((clickEvent: MouseEvent) => ({x: clickEvent.clientX, y: clickEvent.clientY}))
    );
    const cold$ = new ReplaySubject();
    hot$.subscribe(cold$);
    cold$.pipe(take(5)).subscribe((pos) => this.log('#1:', pos));
    setTimeout(
      () => cold$.pipe(take(5)).subscribe((pos) => this.log('#2:', pos))
      , 4000);
  }

  startWarmObservable() {
    this.resetLogTime();
    const warm$ = interval(1000).pipe(share());
    setTimeout(
      () => warm$.pipe(take(10)).subscribe((i) => this.log('#1:', i)),
      2000);
    setTimeout(
      () => warm$.pipe(take(10)).subscribe((i) => this.log('#2:', i)),
      4000);
  }

  startCombinedCreation() {
    this.resetLogTime();
    const values$ = of('A', 'B', 'C', 'D', 'E');
    const interval$ = interval(1000).pipe(takeUntil(this.stop$));

    const combineLatest$ = combineLatest(values$, interval$);
    const forkJoin$ = forkJoin(values$, interval$);
    const concat$ = concat(values$, interval$);
    const merge$ = merge(values$, interval$);
    const zip$ = zip(values$, interval$);
    const race$ = race<any>(values$, interval$);

    combineLatest$.subscribe(v => this.log('combineLatest:', v));
    concat$.subscribe(v => this.log('concat:', v));
    forkJoin$.subscribe(v => this.log('forkJoin:', v));
    merge$.subscribe(v => this.log('merge:', v));
    zip$.subscribe(v => this.log('zip:', v));
    race$.subscribe(v => this.log('race:', v));
  }

  private createTimedObservable<T>(values: T[], timing: number = 1000): Observable<T> {
    return zip(timer(0, timing), of(...values)).pipe(pluck('1'));
  }

  startSubProcesses() {
    this.resetLogTime();
    const values$ = this.createTimedObservable([0.5, 2, 0.75]);

    const switchMap$ = values$.pipe(
      switchMap(v =>
        this.createTimedObservable(['A of ' + v, 'B of ' + v, 'C of ' + v]).pipe(delay(v * 1000))
      ));
    const mergeMap$ = values$.pipe(
      mergeMap(v =>
        this.createTimedObservable(['A of ' + v, 'B of ' + v, 'C of ' + v]).pipe(delay(v * 1000))
      ));
    const concatMap$ = values$.pipe(
      concatMap(v =>
        this.createTimedObservable(['A of ' + v, 'B of ' + v, 'C of ' + v]).pipe(delay(v * 1000))
      ));

    values$.subscribe(v => this.log('values:', v));
    switchMap$.subscribe(v => this.log('switchMap:', v));
    mergeMap$.subscribe(v => this.log('mergeMap:', v));
    concatMap$.subscribe(v => this.log('concatMap:', v));

    // others: exhaust / exhaustMap
  }

  startWithLatestFrom() {
    this.resetLogTime();
    const interval1$ = interval(1000).pipe(takeUntil(this.stop$));
    const interval2$ = interval(2000).pipe(takeUntil(this.stop$));

    const withLatestFrom$ = interval1$.pipe(withLatestFrom(interval2$));

    withLatestFrom$.subscribe(v => this.log('withLatestFrom:', v));
  }

  startBasicBackpressure() {
    this.resetLogTime();
    const interval$ = interval(1000).pipe(takeUntil(this.stop$));

    const throttleTime$ = interval$.pipe(throttleTime(2000));
    const auditTime$ = interval$.pipe(auditTime(2000));
    const sampleTime$ = interval$.pipe(sampleTime(2000));
    const bufferTime$ = interval$.pipe(bufferTime(2000));
    const bufferCount$ = interval$.pipe(bufferCount(3, 2));

    interval$.subscribe(v => this.log('interval:', v));
    throttleTime$.subscribe(v => this.log('throttleTime:', v));
    auditTime$.subscribe(v => this.log('auditTime:', v));
    sampleTime$.subscribe(v => this.log('sampleTime:', v));
    bufferTime$.subscribe(v => this.log('bufferTime:', v));
    bufferCount$.subscribe(v => this.log('bufferCount:', v));

    // also: throttle, audit
  }

  startDebounceTime() {
    this.resetLogTime();
    const fromEvent$ = fromEvent(document, 'click').pipe(map(() => 'click'), takeUntil(this.stop$));

    const delay$ = fromEvent$.pipe(delay(1000));
    const debounceTime$ = fromEvent$.pipe(debounceTime(1000));

    fromEvent$.subscribe(v => this.log('fromEvent:', v));
    delay$.subscribe(v => this.log('delay:', v));
    debounceTime$.subscribe(v => this.log('debounceTime:', v));
  }

}
