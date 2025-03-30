import { Injectable } from '@angular/core';
import { ChartService } from '../../sorting/services/chart.service';

@Injectable({
  providedIn: 'root'
})
export class GradientDescentService {
  differential: number[] = [];
  differential2D: number[][] = [] // [[x], [y]]

  gradient2D(func: number[]) {
    // Parse the function into x, y, and constant components
    let [x, y, c] = this.parseFunction2D(func);

    this.differential2D = [[], []];

    // For x^2 + y^2, the gradient should be [2x, 2y]
    for (let i = 0; i < x.length; i++) {
      this.differential2D[0][i] = x[i] * (i+1);
    }
    for (let i = 0; i < y.length; i++) {
      this.differential2D[1][i] = y[i] * (i+1);
    }
    
    console.log('2D Function parsed:', x, y, c);
    console.log('2D Gradient:', this.differential2D);
  }

  parseFunction2D(func: number[]): [number[], number[], number] {
    let funcCopy = [...func].reverse();
    console.log("func: "+ funcCopy)
    let c: number = funcCopy[0] || 0;  // Use 0 as default if undefined
    let x: number[] = [];
    let y: number[] = [];

    // For x^2 + y^2, the function should be [1, 1, 0, 0, 0] 
    // func[0]=1 is x^2 coefficient, func[1]=1 is y^2 coefficient
    for (let i = 1; i < funcCopy.length; i++) {
      if (i % 2 === 0) {
        x.push(funcCopy[i] || 0);  // Use 0 as default if undefined
      } else {
        y.push(funcCopy[i] || 0);  // Use 0 as default if undefined
      }
    }

    // Make sure x and y have the same length by padding with zeros if necessary
    while (x.length < y.length) x.push(0);
    while (y.length < x.length) y.push(0);

    console.log("Parsed function:", x, y, c);
    return [x, y, c];
  }

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
    onPointFound?: (point: number) => void, onError?: (message: string) => void, useLineSearch: boolean = false, onAlphaFound?: (alpha: number) => void, termination: number=0.01) {  
    let x = startX;
    let points: {x: number, y: number}[] = [];
    this.gradient(func);
    console.log('Function:', func);
    console.log('Gradient:', this.differential);
    for (let i = 0; i < steps+1; i++) {
        let x_alt = x;
        points.push({x: x, y: func.reduce((acc, val, index) => acc + val * Math.pow(x, func.length-1-index), 0)});
        
        chartService.updateGradientPath(points);
        
        await new Promise(resolve => setTimeout(resolve, 300));

        let grad = this.differential.reduce((acc, val, index) => acc + val * Math.pow(x, this.differential.length-1-index), 0);
        console.log('Step:', i, 'x:', x, 'Gradient:', grad);
        if (Math.abs(grad) < termination) {
          console.log('Gradient is close to zero', grad);
          onPointFound?.(x_alt);
          break;
        }
        
        let nextX = x_alt - alpha * grad;
        let currentValue = func.reduce((acc, val, index) => 
          acc + val * Math.pow(x_alt, func.length-1-index), 0);
        let nextValue = func.reduce((acc, val, index) => 
          acc + val * Math.pow(nextX, func.length-1-index), 0);

        if (nextValue > currentValue) {
          if (useLineSearch) {
            let rho = 0.5;
            let tempAlpha = alpha;
            let maxAttempts = 10;
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
            alpha = tempAlpha;
            onAlphaFound?.(tempAlpha);
          } else {
            onError?.('Alpha wurde schlecht gewählt. Versuche line search oder wähle ein anderes alpha');
            break;
          }
        } else {
          x = nextX;
          onAlphaFound?.(alpha);
        }

        if (i === steps) {
          onPointFound?.(x_alt);
        }
    }
  }

  async gradientDescent2D(
    func: number[], 
    startPoint: {x: number, y: number}, 
    alpha: number, 
    steps: number, 
    chartService: ChartService,
    onPointFound?: (point: {x: number, y: number}) => void,
    onGradientFound?: (gradient: {x: number, y: number}) => void,
    onError?: (message: string) => void,
    useLineSearch: boolean = false,
    onAlphaFound?: (alpha: number) => void,
    termination: number = 0.01
  ) {
    let currentPoint = {...startPoint};
    let points: {x: number, y: number, z: number}[] = [];
    
    this.gradient2D(func);
    
    let [xCoeffs, yCoeffs, constant] = this.parseFunction2D(func);
    
    for (let i = 0; i < steps; i++) {
      let funcValue = this.evaluateFunction2D(currentPoint.x, currentPoint.y, xCoeffs, yCoeffs, constant);
      
      points.push({x: currentPoint.x, y: currentPoint.y, z: funcValue});
      
      chartService.updateGradient3DPath('plot3d', points);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let gradX = this.evaluateGradientComponent(currentPoint.x, this.differential2D[0]);
      let gradY = this.evaluateGradientComponent(currentPoint.y, this.differential2D[1]);
      
      let gradMagnitude = Math.sqrt(gradX * gradX + gradY * gradY);
      console.log('Step:', i, 'Position:', currentPoint, 'Gradient:', {x: gradX, y: gradY}, 'Magnitude:', gradMagnitude);
      
      if (gradMagnitude < termination) {
        console.log('Gradient magnitude is below termination threshold');
        onPointFound?.(currentPoint);
        onGradientFound?.({x: gradX, y: gradY});
        break;
      }
      
      let nextPoint = {
        x: currentPoint.x - alpha * gradX,
        y: currentPoint.y - alpha * gradY
      };
      
      let nextFuncValue = this.evaluateFunction2D(nextPoint.x, nextPoint.y, xCoeffs, yCoeffs, constant);
      
      if (nextFuncValue > funcValue) {
        if (useLineSearch) {
          let rho = 0.5;
          let tempAlpha = alpha;
          let maxAttempts = 10;
          let attempts = 0;
          
          while (nextFuncValue > funcValue && attempts < maxAttempts) {
            tempAlpha *= rho;
            nextPoint = {
              x: currentPoint.x - tempAlpha * gradX,
              y: currentPoint.y - tempAlpha * gradY
            };
            nextFuncValue = this.evaluateFunction2D(nextPoint.x, nextPoint.y, xCoeffs, yCoeffs, constant);
            attempts++;
          }
          
          if (attempts === maxAttempts) {
            onError?.('Line search konnte keine geeignete Schrittweite finden.');
            break;
          }
          
          currentPoint = nextPoint;
          alpha = tempAlpha;
          onAlphaFound?.(tempAlpha);
        } else {
          onError?.('Alpha wurde schlecht gewählt. Versuche line search oder wähle ein anderes alpha');
          break;
        }
      } else {
        currentPoint = nextPoint;
        onAlphaFound?.(alpha);
      }
      
      if (i === steps - 1) {
        onPointFound?.(currentPoint);
        onGradientFound?.({x: gradX, y: gradY});
      }
    }
  }
  
  evaluateFunction2D(x: number, y: number, xCoeffs: number[], yCoeffs: number[], constant: number): number {
    let result = constant;
    console.log("Eval: x: "+ xCoeffs+ " y: " + yCoeffs);
    
    for (let i = 0; i < xCoeffs.length; i++) {
      result += xCoeffs[i] * Math.pow(x, i + 1);
    }
    
    for (let i = 0; i < yCoeffs.length; i++) {
      result += yCoeffs[i] * Math.pow(y, i + 1);
    }
    
    return result;
  }
  
  evaluateGradientComponent(value: number, coeffs: number[]): number {
    let result = 0;
    
    for (let i = 0; i < coeffs.length; i++) {
      result += coeffs[i] * Math.pow(value, i);
    }
    
    return result;
  }
}
