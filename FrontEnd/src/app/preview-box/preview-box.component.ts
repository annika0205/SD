import { Component, Input } from '@angular/core';

interface AlgorithmItem {
  items: string;
  description: string;
}

@Component({
  selector: 'app-preview-box',
  templateUrl: './preview-box.component.html',
  styleUrl: './preview-box.component.css'
})
export class PreviewBoxComponent {

@Input() items: AlgorithmItem[] = [];

getItemNames(): string[] {
  return this.items.map(item => item.items);
}
}
