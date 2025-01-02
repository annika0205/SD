import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-startpage',
  templateUrl: './startpage.component.html',
  styleUrl: './startpage.component.css'
})
export class StartpageComponent {

  Algorithms=['Sortieralgorithmen',
    'Optimierungsalgorithmen',
    'Kürzester-Weg-Algorithmen'
  ]

  constructor(private router: Router) {}

  onNavigate(index: number) {
    const routes = [
      '/sortieralgorithmen',
      '/optimierungsalgorithmen',
      '/kürzesterweg'
    ];

    // Navigiere zur Route basierend auf dem Index
    this.router.navigate([routes[index]]);
  }

}
