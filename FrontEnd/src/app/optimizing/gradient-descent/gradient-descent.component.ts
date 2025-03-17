import { Component } from '@angular/core';
import { AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { GradientDescentService } from './gradient-descent-service';

@Component({
  selector: 'app-gradient-descent',
  templateUrl: './gradient-descent.component.html',
  styleUrl: './gradient-descent.component.css'
})
export class GradientDescentComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;

  constructor(private gradientDescentService: GradientDescentService) {}

  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.drawFunction();
    this.gradientDescentService.gradientDescent(-3, 0.8, 30, this, this.gradient);
  }

  drawFunction() {
    const ctx = this.ctx;
    const width = this.canvasRef.nativeElement.width;
    const height = this.canvasRef.nativeElement.height;

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.strokeStyle = 'blue';

    for (let x = -3; x <= 3; x += 0.1) {
      let screenX = this.scaleX(x, width);
      let screenY = this.scaleY(this.gradientDescentService.func(x), height);
      if (x === -3) ctx.moveTo(screenX, screenY);
      else ctx.lineTo(screenX, screenY);
    }
    ctx.stroke();
  }

  gradient(x: number): number {
    return 2 * x; // Ableitung von f(x) = x² ist f'(x) = 2x
  }

  drawPoint(x: number, y: number, color: string) {
    const ctx = this.ctx;
    const screenX = this.scaleX(x, this.canvasRef.nativeElement.width);
    const screenY = this.scaleY(y, this.canvasRef.nativeElement.height);
    
    ctx.beginPath();
    ctx.arc(screenX, screenY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }

  scaleX(x: number, width: number): number {
    return (x + 3) * (width / 6);
  }

  scaleY(y: number, height: number): number {
    return height - (y * (height / 10) + height / 2);
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  drawPath(points: {x: number, y: number}[], color: string) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.strokeStyle = color;
    points.forEach((point, index) => {
        const screenX = this.scaleX(point.x, this.canvasRef.nativeElement.width);
        const screenY = this.scaleY(point.y, this.canvasRef.nativeElement.height);
        if (index === 0) ctx.moveTo(screenX, screenY);
        else ctx.lineTo(screenX, screenY);
    });
    ctx.stroke();
  }

  drawText(text: string, x: number, y: number) {
    const ctx = this.ctx;
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.fillText(text, x, y);
  }
}
