import {Component, OnInit} from '@angular/core';
import {asapScheduler, asyncScheduler, merge, of, queueScheduler, Subject} from 'rxjs';
import {filter, observeOn, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-training-examples',
  templateUrl: './training-examples.component.html',
  styleUrls: ['./training-examples.component.css']
})
export class TrainingExamplesComponent implements OnInit {

  title = 'InitialSet';

  ngOnInit() {
  }

  startNoScheduler() {
    const subject = new Subject<boolean>();
    const obs = subject.asObservable();

    obs.subscribe(v => console.log('next value', v));

    console.log('Going to send next value');

    subject.next(true);

    console.log('Sent next value');
  }

  startAsyncScheduler() {
    const subject = new Subject<boolean>();

    const obs = subject.asObservable();
    obs.pipe(observeOn(asyncScheduler))
      .subscribe(v => console.log('next value', v));

    console.log('Going to send next value');

    subject.next(true);

    console.log('Sent next value');
  }

  startMicrotaskVsPromise() {
    queueMicrotask(() => console.log('queueMicrotask 1'));
    Promise.resolve().then(() => console.log('promise 1'));
    Promise.resolve().then(() => console.log('promise 2'));
    queueMicrotask(() => console.log('queueMicrotask 2'));
    console.log('Scheduling done!');
  }

  startSchedulerComparison() {
    setTimeout(() => console.log('Now Macrotasks are been processed:'));
    Promise.resolve().then(() => console.log('Now Microtasks are being processed:'));

    const asyncObs = of('').pipe(
      startWith('asyncScheduler', asyncScheduler));

    const asapObs = of('').pipe(
      startWith('asapScheduler', asapScheduler));

    const queueObs = of('').pipe(
      startWith('queueScheduler', queueScheduler));

    merge(
      asyncObs,
      asapObs,
      queueObs).pipe(
      filter(x => !!x)
    ).subscribe(console.log);

    console.log('after subscription');
  }
}
