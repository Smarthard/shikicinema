import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SmarthardNet} from '../../../types/smarthard-net';

@Component({
  selector: 'app-kind-remote',
  templateUrl: './kind-remote.component.html',
  styleUrls: ['./kind-remote.component.css']
})
export class KindRemoteComponent implements OnInit {

  readonly KINDS = SmarthardNet.Kind;

  @Output()
  public kind: EventEmitter<SmarthardNet.Kind> = new EventEmitter<SmarthardNet.Kind>();
  public chosenKind: SmarthardNet.Kind = this.KINDS.Unknown;

  constructor() { }

  ngOnInit() {
  }

  public switchKindSelection(kind: SmarthardNet.Kind) {
    this.kind.emit(kind);
    this.chosenKind = kind;
  }

  public isChosen(kind: SmarthardNet.Kind) {
    return this.chosenKind === kind;
  }

}
