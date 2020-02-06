import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ExpressionChangedExceptionComponent} from './expression-changed-exception.component';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css']
})
export class ChildComponent {

  name = 'I am the child component';

  @Input()
  text: string;

  @Output()
  changeEvent = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit(): void {
    this.changeEvent.emit('Changed by the child');
  }

}
