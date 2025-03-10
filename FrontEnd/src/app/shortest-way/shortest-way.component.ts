import { Component ,Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shortest-way',
  templateUrl: './shortest-way.component.html',
  styleUrl: './shortest-way.component.css'
})
export class ShortestWayComponent implements OnInit{

  @Input() items: string[] = [];

  constructor(private router: Router) {}
    
      ngOnInit() {
        this.items = history.state.items || []; // Holt die Items aus dem Router-State
      }
}
