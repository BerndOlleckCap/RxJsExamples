import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, Subject} from 'rxjs';
import {catchError, debounceTime, filter, map, share, switchMap} from 'rxjs/operators';
import {Utils} from '../utils/Utils';

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
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  constructor(private backend: HttpClient) {
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
    map(SearchComponent.convertToSearchUrl),
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
