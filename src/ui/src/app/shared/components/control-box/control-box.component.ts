import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-control-box',
  templateUrl: './control-box.component.html',
  styleUrls: ['./control-box.component.css']
})
export class ControlBoxComponent implements OnInit {

  @Input()
  subtext: string;

  @Input()
  href: string;

  constructor() { }

  ngOnInit() {
  }

}
