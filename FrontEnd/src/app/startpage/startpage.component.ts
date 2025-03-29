import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

interface SuchErgebnis {
  algorithmusName: string;  // Geändert von titel zu algorithmusName für mehr Klarheit
  beschreibung: string;
  kategorie: string;
  route: string;
}

@Component({
  selector: 'app-startpage',
  templateUrl: './startpage.component.html',
  styleUrl: './startpage.component.css'
})
export class StartpageComponent {

  suchBegriff: string = '';
  suchergebnisse: SuchErgebnis[] = [];

  boxes = [
    { title:'Sortieralgorithmen', 
      algorithms: [
        {items: 'Bubblesort', description: 'Ein einfacher Sortieralgorithmus, der benachbarte Elemente vertauscht, wenn sie in der falschen Reihenfolge sind.'},
        { items: 'Mergesort', description: 'Ein effizienter, auf Teilen-und-Herrsche basierender Sortieralgorithmus.' },
        { items: 'Quicksort', description: 'Ein schneller, rekursiver Sortieralgorithmus, der ein Pivot-Element verwendet.' },
        { items: 'Selectionsort', description: 'beschreibung selectionsort' }
      ] },

    { 
      title: 'Optimierungsalgorithmen', 
      algorithms: [  // Änderung von items zu algorithms
        {items: 'Item 2.1', description: 'jajaj'},
        {items: 'Item 2.2', description: 'nenenen'},
        {items: 'Item 2.3', description: 'dochdoch doch'},
        {items: 'Item 2.4', description: 'bliblablub'}
      ] 
    },
    { 
      title: 'Kürzester-Weg-Algorithmen', 
      algorithms: [  // Änderung von items zu algorithms
        {items: 'Dijkstra', description: 'furzknoten'},
        {items: 'A*', description: 'huhuuhu'},
        {items: 'Item 3.3', description: 'hihih'},
        {items: 'Item 3.4', description: 'hahaha'}
      ] 
    }
  ];

  private algorithmusRouten: { [key: string]: string } = {
    'Bubblesort': 'bubblesort',
    'Selectionsort': 'selectionsort',
    'Mergesort': 'mergesort',
    'Quicksort': 'quicksort'
  };


  constructor(private router: Router, private route: ActivatedRoute) {}

  getCategoryClass(index: number): string {
    switch(index) {
      case 0: return 'category-sorting';
      case 1: return 'category-search';
      case 2: return 'category-graph';
      default: return '';
    }
  }

  onNavigate(index: number) {
    const routes = [
      '/sortieralgorithmen',
      '/optimierungsalgorithmen',
      '/kürzesterweg'
    ];
   
    this.router.navigate([routes[index]], { state: { items: this.boxes[index].algorithms } });
  }

  suchen(event: Event) {
    this.suchBegriff = (event.target as HTMLInputElement).value;
    this.suchergebnisseFinden();
  }

  private suchergebnisseFinden() {
    this.suchergebnisse = [];
    
    if (!this.suchBegriff) {
      return;
    }

    const suche = this.suchBegriff.toLowerCase();
    
    this.boxes.forEach((box, boxIndex) => {
      box.algorithms.forEach(algo => {
        if (
          algo.items.toLowerCase().includes(suche) || 
          algo.description.toLowerCase().includes(suche)
        ) {
          const route = this.getRouteForAlgorithm(algo.items);
          this.suchergebnisse.push({
            algorithmusName: algo.items,
            beschreibung: algo.description,
            kategorie: box.title,
            route: route // Speichern des Index für das Routing
          });
        }
      });
    });
  }

   // Neue Methode um die korrekte Route für einen Algorithmus zu ermitteln
   private getRouteForAlgorithm(algorithmusName: string): string {
    const normalizedName = algorithmusName.toLowerCase().trim();
    
    // Prüfen ob es eine spezifische Route für den Algorithmus gibt
    for (const [key, route] of Object.entries(this.algorithmusRouten)) {
      if (normalizedName.includes(key.toLowerCase())) {
        return route;
      }
    }

    // Fallback zu Kategorie-Routen
    if (normalizedName.includes('sort')) {
      return 'sortieralgorithmen';
    } else if (normalizedName.includes('optimier')) {
      return 'optimierungsalgorithmen';
    } else if (normalizedName.includes('weg') || normalizedName.includes('path')) {
      return 'kürzesterweg';
    }

    return ''; // Fallback zur Startseite
  }

  // Aktualisierte Methode für das Klicken auf ein Suchergebnis
  onErgebnisClick(ergebnis: SuchErgebnis) {
    if (ergebnis.route) {
      this.router.navigate([ergebnis.route]);
    }
  }
}
