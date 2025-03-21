import { Component, Input, Output, EventEmitter, HostBinding, ViewEncapsulation } from '@angular/core';

interface AlgorithmItem {
  items: string;
  description: string;
}

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrl: './box.component.css',
  encapsulation: ViewEncapsulation.None
})
export class BoxComponent {
  @Input() title: string = '';
  @Input() items: AlgorithmItem[] = [];
  @Output() navigate = new EventEmitter<void>();

  @HostBinding('class')
  @Input()
  class: string = '';

  isExpanded: boolean = false;

  toggleExpand(event: Event) {
    event.stopPropagation();
    this.isExpanded = !this.isExpanded;
  }

  onBoxClick() {
    this.navigate.emit();
  }

  onSearchClick(event: Event) {
    event.stopPropagation(); // Verhindert, dass der Click die Box aufklappt
    this.navigate.emit();
  }
}