import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Kind} from "../../../types/kind";

@Component({
  selector: 'app-kind-remote',
  templateUrl: './kind-remote.component.html',
  styleUrls: ['./kind-remote.component.css']
})
export class KindRemoteComponent implements OnInit {

  readonly KINDS = Kind;

  @Output()
  public kind: EventEmitter<Kind> = new EventEmitter<Kind>();
  public chosenKind: Kind = Kind.Unknown;

  constructor() { }

  ngOnInit() {
  }

  public switchKindSelection(kind: Kind) {
    this.kind.emit(kind);
    this.chosenKind = kind;
  }

  public isChosen(kind: Kind) {
    return this.chosenKind === kind;
  }

}
