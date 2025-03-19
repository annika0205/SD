import { Component } from '@angular/core';

@Component({
  selector: 'app-startpage-v2',
  templateUrl: './startpage-v2.component.html',
  styleUrl: './startpage-v2.component.css'
})
export class StartpageV2Component {

  openCategory: number | null = null;

  categories = [
    {
      title: 'Sortieralgorithmen',
      color: 'bg-gradient-to-r from-red-500 to-pink-500',
      algorithms: [
        { name: 'Bubble Sort', description: 'Ein einfacher Sortieralgorithmus, der benachbarte Elemente vertauscht, wenn sie in der falschen Reihenfolge sind.' },
        { name: 'Merge Sort', description: 'Ein effizienter, auf Teilen-und-Herrsche basierender Sortieralgorithmus.' },
        { name: 'Quick Sort', description: 'Ein schneller, rekursiver Sortieralgorithmus, der ein Pivot-Element verwendet.' }
      ]
    },
    {
      title: 'Optimierungsalgorithmen',
      color: 'bg-gradient-to-r from-green-500 to-teal-500',
      algorithms: [
        { name: 'Genetischer Algorithmus', description: 'Ein evolutionärer Algorithmus, der natürliche Selektion nachahmt.' },
        { name: 'Hill Climbing', description: 'Ein algorithmischer Ansatz zur lokalen Optimierung.' },
        { name: 'Simulated Annealing', description: 'Ein probabilistischer Algorithmus zur Vermeidung lokaler Minima.' }
      ]
    },
    {
      title: 'Kürzester Weg Algorithmen',
      color: 'bg-gradient-to-r from-blue-500 to-indigo-500',
      algorithms: [
        { name: 'Dijkstra', description: 'Ein Algorithmus zur Berechnung des kürzesten Weges in einem Graphen.' },
        { name: 'A*', description: 'Ein heuristischer Suchalgorithmus zur Pfadfindung.' },
        { name: 'Bellman-Ford', description: 'Ein Algorithmus zur Berechnung kürzester Wege, der auch negative Kantengewichte unterstützt.' }
      ]
    }
  ];


toggleCategory(index: number) {
  // Wenn die aktuelle Box bereits geöffnet ist, schließe sie
  if (this.openCategory === index) {
    this.openCategory = null;
  } else {
    // Andernfalls öffne die angeklickte Box und schließe alle anderen
    this.openCategory = index;
  }
}
  
  getCategoryClass(index: number): string {
    const colorClasses = [
      'category-sorting',
      'category-search',
      'category-graph',
      'category-dynamic',
      'category-crypto',
      'category-math'
    ];
    
    return colorClasses[index % colorClasses.length];
  }
}
