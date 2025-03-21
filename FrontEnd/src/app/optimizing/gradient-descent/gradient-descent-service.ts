import { Injectable } from '@angular/core';
import { ChartService } from '../../sorting/services/chart.service';

@Injectable({
  providedIn: 'root'
})
export class GradientDescentService {

  async gradientDescent(func:number[], gradient: number[], startX: number, alpha: number, steps: number, chartService: ChartService) {
    let x = startX;
    let points: {x: number, y: number}[] = [];
    
    for (let i = 0; i < steps; i++) {
        let grad = 2 * x;
        points.push({x: x, y: func.reduce((acc, val, index) => acc + val * Math.pow(x, func.length-1-index), 0)});
        
        chartService.updateGradientPath(points);
        
        await new Promise(resolve => setTimeout(resolve, 300));

        if (Math.abs(grad) < 0.01) break;
        
        x = x - alpha * grad;
    }
  }
  
}
