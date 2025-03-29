import { Component, Input, Output, EventEmitter, HostBinding, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

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
  @Output() navigateToAlgo = new EventEmitter<number>();
  @HostBinding('class')
  @Input()
  class: string = '';

  isExpanded: boolean = false;

  constructor(private router: Router) {}

  toggleExpand(event: Event) {
    event.stopPropagation();
    this.isExpanded = !this.isExpanded;
  }

  ngOnInit() {
    console.log('BoxComponent initialized');
    console.log('Title:', this.title);
    console.log('Items:', this.items);
  }

  onSearchClick(event: Event) {
    event.stopPropagation(); // Verhindert, dass der Click die Box aufklappt
    this.navigate.emit();

  }

  onClickAlgo(index: number, event: Event) {
    event.stopPropagation();
    this.navigateToAlgo.emit(index);
    console.log("Algorithmus angeklickt")
  }
  
}