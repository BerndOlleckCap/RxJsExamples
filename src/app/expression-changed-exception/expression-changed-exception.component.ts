import {AfterViewInit, Component} from '@angular/core';

@Component({
  selector: 'app-expression-changed-exception',
  templateUrl: './expression-changed-exception.component.html',
  styleUrls: ['./expression-changed-exception.component.css']
})
export class ExpressionChangedExceptionComponent {

  name = 'I am the parent component';
  text = 'A message for the child component';

  activeChild = false;

  constructor() {
  }

  activateChild() {
    this.activeChild = true;
  }

  changeTextCallbackFromChild(newText: string) {
    this.text = newText;
  }

  // this also causes the exception (but this already happens directly upon load)
  // ngAfterViewInit(): void {
  //   this.name = 'Changed name';
  // }

}
