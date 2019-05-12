import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {debounceTime, filter, map, share} from 'rxjs/operators';
import {switchMap} from 'rxjs/internal/operators/switchMap';
import {SquaresService} from './squares/squares.service';
import {tap} from 'rxjs/internal/operators/tap';
import {Utils} from './utils/Utils';
import {catchError} from 'rxjs/internal/operators/catchError';
import {of} from 'rxjs/internal/observable/of';

// for more info see: https://duckduckgo.com/api
const searchUrl = 'https://api.duckduckgo.com/';

interface DuckDuckGoRelatedTopic {
  FirstURL: string;
  Text: string;
}

interface DuckDuckGoResult {
  RelatedTopics?: DuckDuckGoRelatedTopic[];
  AbstractURL?: string;
  AbstractText?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public squaresService: SquaresService, private backend: HttpClient) {
  }

  private _searchInput: string;

  get searchInput(): string {
    return this._searchInput;
  }

  set searchInput(value: string) {
    this._searchInput = value;
    this.searchInput$.next(value);
  }

  private searchInput$ = new Subject<string>();

  searchResult$: Observable<DuckDuckGoResult> = this.searchInput$.pipe(
    debounceTime(500),
    filter(searchInput => searchInput && searchInput.length >= 3),
    map(searchInput => encodeURIComponent(searchInput)),
    map(AppComponent.convertToSearchUrl),
    switchMap(
      (url: string) => this.backend.get<DuckDuckGoResult>(url)
        .pipe(catchError(err => {
          Utils.log('Got error: ', err);
          return of({});
        }))
    ),
    share()
  );

  abstractText$ = this.searchResult$.pipe(
    map(result => result.AbstractText)
  );

  abstractUrl$ = this.searchResult$.pipe(
    map(result => result.AbstractURL)
  );

  relatedTopics$ = this.searchResult$.pipe(
    map(result => result.RelatedTopics)
  );

  private static convertToSearchUrl(input: string): string {
    return searchUrl + '?q=' + input + '&format=json&t=MyRxJsObservablesDemo';
  }

}
