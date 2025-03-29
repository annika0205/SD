import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

interface AlgorithmItem {
  items: string;
  description: string;
}

@Component({
  selector: 'app-optimizing',
  templateUrl: './optimizing.component.html',
  styleUrl: './optimizing.component.css'
})
export class OptimizingComponent implements OnInit {

  @Input() items: AlgorithmItem[] = []; // Änderung hier zu AlgorithmIte

  constructor(private router: Router, private route: ActivatedRoute) {}
  
    ngOnInit() {
      this.items = history.state.items || []; // Holt die Items aus dem Router-State
    }

    navigateToAlgo(index: number) {
      const routes = [
        'gradientdescent',
      ];
      
      this.router.navigate([routes[index]], { relativeTo: this.route });
    }
}
