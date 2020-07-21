import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { TermResult } from 'src/app/models/interfaces/term-result';

@Component({
  selector: 'app-term-results',
  templateUrl: './term-results.component.html',
  styleUrls: ['./term-results.component.scss'],
})
export class TermResultsComponent implements OnInit, OnChanges {
  @Input()
  matchingResults: TermResult[];

  @Output()
  onResultSelected = new EventEmitter();

  foundTerms: boolean = true;
  onResultelected(result: any) {
    this.onResultSelected.emit(result);
  }

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.matchingResults) {
      this.foundTerms = this.matchingResults?.length > 0 ? true : false;
    }
  }

  ngOnInit(): void {}
}
