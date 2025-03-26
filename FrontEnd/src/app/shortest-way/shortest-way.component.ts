import { Component ,Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';


interface AlgorithmItem {
  items: string;
  description: string;
}

@Component({
  selector: 'app-shortest-way',
  templateUrl: './shortest-way.component.html',
  styleUrl: './shortest-way.component.css'
})
export class ShortestWayComponent implements OnInit{

  @Input() items: AlgorithmItem[] = []; // Änderung hier zu AlgorithmIte

  constructor(private router: Router) {}
    
      ngOnInit() {
        this.items = history.state.items || []; // Holt die Items aus dem Router-State
      }
      
      navigateToAlgo(index: number) {
        const routes = [
          '/dijkstra',
          '/a*',
        ];
        
        this.router.navigate([routes[index]]);
      }
}
