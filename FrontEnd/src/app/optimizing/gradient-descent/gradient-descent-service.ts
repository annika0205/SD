import { Injectable } from '@angular/core';
import { ChartService } from '../../sorting/services/chart.service';

@Injectable({
  providedIn: 'root'
})
export class GradientDescentService {
  func(x: number): number {
    return x * x; // Beispiel f(x) = x²
  }

  async gradientDescent(startX: number, alpha: number, steps: number, chartService: ChartService) {
    let x = startX;
    let points: {x: number, y: number}[] = [];
    
    for (let i = 0; i < steps; i++) {
        let grad = 2 * x;
        points.push({x: x, y: this.func(x)});
        
        chartService.updateGradientPath(points);
        
        await new Promise(resolve => setTimeout(resolve, 300));

        if (Math.abs(grad) < 0.01) break;
        
        x = x - alpha * grad;
    }
  }
}
