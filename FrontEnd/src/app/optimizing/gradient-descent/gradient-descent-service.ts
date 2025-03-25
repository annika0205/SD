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
  
  async gradientDescent(func:number[], startX: number, alpha: number, steps: number, chartService: ChartService, 
    onPointFound?: (point: number) => void) {  // Add callback parameter
    let x = startX;
    let points: {x: number, y: number}[] = [];
    this.gradient(func);
    console.log('Function:', func);
    console.log('Gradient:', this.differential);
    //Abbruchbedingung für unsinnvolle Alpha-Werte einbauen 
    //Hinweis an Nutzer -> Verlinkung an Line Search?
    for (let i = 0; i < steps+1; i++) {
        let x_alt = x;
        points.push({x: x, y: func.reduce((acc, val, index) => acc + val * Math.pow(x, func.length-1-index), 0)});
        
        chartService.updateGradientPath(points);
        
        await new Promise(resolve => setTimeout(resolve, 300));

        let grad = this.differential.reduce((acc, val, index) => acc + val * Math.pow(x, this.differential.length-1-index), 0);
        console.log('Step:', i, 'x:', x, 'Gradient:', grad);
        //Bedingung noch variabel machen
        if (Math.abs(grad) < 0.01) {
          console.log('Gradient is close to zero', grad);
          onPointFound?.(x_alt); // Call callback with found point
          break;
        }
        
        x = x_alt - alpha * grad;
        if (func.reduce((acc, val, index) => acc + val * Math.pow(x, func.length-1-index), 0) > func.reduce((acc, val, index) => acc + val * Math.pow(x_alt, func.length-1-index), 0)) {
          //schöner schreiben
          console.log('Function value increased. Ein Verfahren wie line search solle verwendet werden.');
          onPointFound?.(x_alt); // Call callback with found point
          break;
          //alpha = alpha / 2;
          //console.log('Alpha halved to', alpha);
          //x = x_alt - alpha * grad;
        }
    }
  }
}
