import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrl: './box.component.css'
})
export class BoxComponent {
  @Input() title:string='';
<<<<<<< Updated upstream
=======
  @Input() items: string[] = [];
  @Output() navigate = new EventEmitter<void>();

  onBoxClick() {
    this.navigate.emit();
  }
>>>>>>> Stashed changes
}
