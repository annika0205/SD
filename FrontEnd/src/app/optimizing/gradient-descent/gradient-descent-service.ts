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
    onPointFound?: (point: number) => void, onError?: (message: string) => void, useLineSearch: boolean = false, onAlphaFound?: (alpha: number) => void, termination: number=0.01) {  // Add callback parameter
    let x = startX;
    let points: {x: number, y: number}[] = [];
    this.gradient(func);
    console.log('Function:', func);
    console.log('Gradient:', this.differential);
    //Hinweis an Nutzer -> Verlinkung an Line Search?
    for (let i = 0; i < steps+1; i++) {
        let x_alt = x;
        points.push({x: x, y: func.reduce((acc, val, index) => acc + val * Math.pow(x, func.length-1-index), 0)});
        
        chartService.updateGradientPath(points);
        
        await new Promise(resolve => setTimeout(resolve, 300));

        let grad = this.differential.reduce((acc, val, index) => acc + val * Math.pow(x, this.differential.length-1-index), 0);
        console.log('Step:', i, 'x:', x, 'Gradient:', grad);
        //Bedingung noch variabel machen
        if (Math.abs(grad) < termination) {
          console.log('Gradient is close to zero', grad);
          onPointFound?.(x_alt); // Call callback with found point
          break;
        }
        
        let nextX = x_alt - alpha * grad;
        let currentValue = func.reduce((acc, val, index) => 
          acc + val * Math.pow(x_alt, func.length-1-index), 0);
        let nextValue = func.reduce((acc, val, index) => 
          acc + val * Math.pow(nextX, func.length-1-index), 0);

        if (nextValue > currentValue) {
          if (useLineSearch) {
            // Implement backtracking line search
            let rho = 0.5; // Default backtracking parameter
            let tempAlpha = alpha;
            let maxAttempts = 10; // Prevent infinite loops
            let attempts = 0;

            while (nextValue > currentValue && attempts < maxAttempts) {
              tempAlpha *= rho;
              nextX = x_alt - tempAlpha * grad;
              nextValue = func.reduce((acc, val, index) => 
                acc + val * Math.pow(nextX, func.length-1-index), 0);
              attempts++;
            }

            if (attempts === maxAttempts) {
              onError?.('Line search konnte keine geeignete Schrittweite finden.');
              break;
            }
            
            x = nextX;
            alpha = tempAlpha; // Update alpha for next iteration
            onAlphaFound?.(tempAlpha); // Report found alpha
          } else {
            onError?.('Alpha wurde schlecht gewählt. Versuche line search oder wähle ein anderes alpha');
            break;
          }
        } else {
          x = nextX;
          onAlphaFound?.(alpha); // Report current alpha
        }

        // Wenn wir am Ende der Schleife sind und nicht abgebrochen haben
        if (i === steps) {
          onPointFound?.(x_alt);
        }
    }
    
  }
}
