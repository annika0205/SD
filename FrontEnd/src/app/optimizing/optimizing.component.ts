import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-optimizing',
  templateUrl: './optimizing.component.html',
  styleUrl: './optimizing.component.css'
})
export class OptimizingComponent implements OnInit {

  @Input() items: string[] = [];

  constructor(private router: Router) {}
  
    ngOnInit() {
      this.items = history.state.items || []; // Holt die Items aus dem Router-State
    }
}
