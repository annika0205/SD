import { Injectable } from '@angular/core';
import { GradientDescentComponent } from './gradient-descent.component';

@Injectable({
  providedIn: 'root'
})
export class GradientDescentService {
  func(x: number): number {
    return x * x; // Beispiel f(x) = x²
  }

  async gradientDescent(startX: number, alpha: number, steps: number, component: GradientDescentComponent, gradient: (x: number) => number) {
    let x = startX;
    let points: {x: number, y: number}[] = [];
    
    for (let i = 0; i < steps; i++) {
        let grad = gradient(x);
        points.push({x: x, y: this.func(x)});
        
        component.drawFunction();
        // Zeichne Verlaufslinie
        component.drawPath(points, 'rgba(255,0,0,0.5)');
        // Zeichne aktuellen Punkt
        component.drawPoint(x, this.func(x), 'red');
        // Zeige Werte an
        component.drawText(`x: ${x.toFixed(3)}, grad: ${grad.toFixed(3)}`, 10, 20);
        
        await component.sleep(300);

        // Abbruch wenn Gradient sehr klein
        if (Math.abs(grad) < 0.01) break;
        
        x = x - alpha * grad;
    }
  }
}
