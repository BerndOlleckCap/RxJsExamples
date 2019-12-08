import {Component} from '@angular/core';
import {
  asapScheduler,
  asyncScheduler,
  combineLatest,
  concat,
  ConnectableObservable,
  forkJoin,
  fromEvent,
  interval,
  merge,
  of,
  queueScheduler,
  race,
  ReplaySubject,
  Subject,
  zip
} from 'rxjs';
import {filter, map, observeOn, publish, share, startWith, take, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-training-examples',
  templateUrl: './training-examples.component.html',
  styleUrls: ['./training-examples.component.css']
})
export class TrainingExamplesComponent {

  title = 'InitialSet';
  logStartTime = new Date().getTime();

  stop$ = new Subject();

  stop() {
    this.stop$.next();
  }

  resetLogTime() {
    this.logStartTime = new Date().getTime();
  }

  log(...args) {
    console.log(new Date().getTime() - this.logStartTime, ...args);
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

    combineLatest$.subscribe((v) => this.log('combineLatest:', v));
    concat$.subscribe((v) => this.log('concat:', v));
    forkJoin$.subscribe((v) => this.log('forkJoin:', v));
    merge$.subscribe((v) => this.log('merge:', v));
    zip$.subscribe((v) => this.log('zip:', v));
    race$.subscribe((v) => this.log('race:', v));
  }

  startCombinedHigherOrder() {

  }

}
