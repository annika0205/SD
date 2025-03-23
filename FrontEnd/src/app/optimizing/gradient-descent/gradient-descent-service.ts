import { Injectable } from '@angular/core';
import { ChartService } from '../../sorting/services/chart.service';

@Injectable({
  providedIn: 'root'
})
export class GradientDescentService {
  differential: number[] = [];
  gradient(func: number[]) {
    this.differential = new Array(func.length - 1).fill(0);
    for (let i = 0; i < this.differential.length; i++) {
      const power = func.length - 1 - i;
      if (power > 0) {
        this.differential[i] = func[i] * power;
      }
    }
  }

  async gradientDescent(func:number[], startX: number, alpha: number, steps: number, chartService: ChartService) {
    let x = startX;
    let points: {x: number, y: number}[] = [];
    //let grad: number;
    for (let i = 0; i < steps; i++) {
      
        //grad war 2x
        this.gradient(func);
        points.push({x: x, y: func.reduce((acc, val, index) => acc + val * Math.pow(x, func.length-1-index), 0)});
        
        chartService.updateGradientPath(points);
        
        await new Promise(resolve => setTimeout(resolve, 300));

        let grad = this.differential.reduce((acc, val, index) => acc + val * Math.pow(x, this.differential.length-1-index), 0);
        //Bedingung noch variabel machen
        if (Math.abs(grad) < 0.01) {
          console.log('Gradient is close to zero', grad);
          break;
        }
        
        x = x - alpha * grad;
    }
  }
} 
