import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { BubbleSortService } from './bubblesort-service';
import { ChartService } from '../services/chart.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-bubblesort',
  templateUrl: './bubblesort.component.html',
  styleUrls: ['./bubblesort.component.css'],
  providers: [BubbleSortService]
})
export class BubblesortComponent implements AfterViewInit {
  constructor(
    private bubbleSortService: BubbleSortService,
    private chartService: ChartService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  sidebarOpen = false;
  inputs: string[] = ["", "", "", "", ""];
  
  input_values = "";
  starting_values = [1, 2, 3, 4, 5];
  finishes_values: number[] = [];
  
  // Indizes der aktuell getauschten Elemente für die Bubbles
  currentSwapIndices: number[] = [-1, -1];
  private animationInProgress = false;
  
  private bubbleOverlayCanvas!: HTMLCanvasElement;
private bubbleOverlayCtx!: CanvasRenderingContext2D;

ngAfterViewInit(): void {
  // Only execute DOM-related code in the browser
  if (isPlatformBrowser(this.platformId)) {
    this.syncCanvasSize();
    this.chartService.createChart('myChart', this.starting_values, this.starting_values);

    const chartCanvas = document.getElementById('myChart') as HTMLCanvasElement;
    const overlay = document.getElementById('bubbleOverlay') as HTMLCanvasElement;

    if (chartCanvas && overlay) {
      overlay.width = chartCanvas.width;
      overlay.height = chartCanvas.height;

      this.bubbleOverlayCanvas = overlay;
      this.bubbleOverlayCtx = overlay.getContext('2d')!;
    }
  }
}
  
  sortMode: "min" | "max" = "min";
  
  onClick(): void {
    console.log(this.inputs);
    this.starting_values = this.inputs.map(num => parseInt(num.trim(), 10)).filter(num => !isNaN(num));
    console.log("Die Startwerte sind", this.starting_values);
    
    // Erst Chart aktualisieren
    this.chartService.updateChart(this.starting_values, 0, 0);
    
    // Sortierung durchführen
    this.bubbleSortService.sort([...this.starting_values], this.sortMode);
    
    // Animation der Sortierungsschritte starten (mit Bubbles)
    this.animateSortStepsWithBubbles();
  }
  
  onSortModeChange(mode: "min" | "max"): void {
    this.sortMode = mode;
    console.log(`Sortiermodus geändert: ${this.sortMode}`);
  }
  
  // Neue Methode zur Animation der Sortierungsschritte mit Bubbles
  private animateSortStepsWithBubbles(): void {
    // Verhindere mehrere gleichzeitige Animationen
    if (this.animationInProgress) {
      return;
    }
    
    this.animationInProgress = true;
    
    // Lösche alle bestehenden Timeouts
    for (let i = 0; i < 1000; i++) {
      clearTimeout(i);
    }
    
    // Anzahl der verfügbaren Schritte
    const steps = this.bubbleSortService.getSteps();
    
    // Animiere durch alle Schritte
    steps.forEach((step, index) => {
      setTimeout(() => {
        this.finishes_values = step;
        
        // Für Index 0 gibt es keinen Vergleich
        if (index === 0) {
          this.chartService.updateChart(step, -1, -1);
          this.currentSwapIndices = [-1, -1];
        } else {
          // In einfacher Form vergleichen wir immer zwei benachbarte Elemente
          // Dies ist eine Vereinfachung - für komplexere Logik müsstest du den Service erweitern
          const comparedIndex1 = index % (step.length - 1);
          const comparedIndex2 = comparedIndex1 + 1;
          
          // Setze die Indizes für das Zeichnen der Bubbles
          this.currentSwapIndices = [comparedIndex1, comparedIndex2];
          
          // Aktualisiere das Chart
          this.chartService.updateChart(step, comparedIndex1, comparedIndex2);
          
          // Zeichne die Bubbles nach der Chart-Aktualisierung
          //setTimeout(() => this.drawBubbles(), 50);
          requestAnimationFrame(() => this.drawBubbles());
        }
        
        // Animation beenden nach dem letzten Schritt
        if (index === steps.length - 1) {
          this.animationInProgress = false;
        }
      }, index * 1000);
    });
  }
  
  // Setup für das Bubble-Zeichnen
  private setupBubbleDrawing(): void {
    // Wir verwenden einen Observer, um Änderungen am Chart zu überwachen
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    // Observer für Chart-Änderungen
    const observer = new MutationObserver((mutations) => {
      // Nach einer Chart-Aktualisierung die Bubbles zeichnen
      if (this.currentSwapIndices[0] !== -1) {
        this.drawBubbles();
      }
    });
    
    // Chart-Container beobachten
    const chartContainer = canvas.parentElement;
    if (chartContainer) {
      observer.observe(chartContainer, { 
        attributes: true, 
        childList: true, 
        subtree: true 
      });
    }
  }
  
  // Methode zum Zeichnen der Bubbles
  private drawBubbles(): void {
    const ctx = this.bubbleOverlayCtx;
    if (!ctx || this.currentSwapIndices[0] === -1 || this.currentSwapIndices.length < 2) return;
  
    ctx.clearRect(0, 0, this.bubbleOverlayCanvas.width, this.bubbleOverlayCanvas.height);
  
    const canvas = this.bubbleOverlayCanvas;
    const chartHeight = canvas.height;
    const chartWidth = canvas.width;
    const barCount = this.finishes_values.length;
    const padding = 40;
    const availableWidth = chartWidth - (padding * 2);
    const segmentWidth = availableWidth / barCount;
  
    const [index1, index2] = this.currentSwapIndices;
  
    if (index1 < 0 || index2 < 0 || index1 >= this.finishes_values.length || index2 >= this.finishes_values.length) return;
  
    const value1 = this.finishes_values[index1];
    const value2 = this.finishes_values[index2];
    const maxValue = Math.max(...this.finishes_values);
  
    const barHeight1 = (value1 / maxValue) * (chartHeight * 0.7);
    const barHeight2 = (value2 / maxValue) * (chartHeight * 0.7);
  
    const x1 = padding + (index1 * segmentWidth) + (segmentWidth / 2);
    const x2 = padding + (index2 * segmentWidth) + (segmentWidth / 2);
    const y1 = chartHeight - barHeight1 - 30;
    const y2 = chartHeight - barHeight2 - 30;
  
    // Mittelpunkt der gemeinsamen Bubble
    const centerX = (x1 + x2) / 2;
    const centerY = Math.min(y1, y2) - 20;
  
    // Radius so groß, dass beide enthalten sind (plus Puffer)
    const distance = Math.abs(x2 - x1);
    const bubbleRadius = Math.max(distance / 2 + 30, 30);
  
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, bubbleRadius, 0, Math.PI * 2);
    ctx.strokeStyle = '#FF9800';
    ctx.lineWidth = 3;
    ctx.stroke();
  
    this.drawBubbleEffects(ctx, centerX, centerY, bubbleRadius);
    ctx.restore();
  }
  
  // Methode zum Zeichnen der Bubble-Effekte
  private drawBubbleEffects(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number): void {
    const bubbleCount = 3;
    
    for (let i = 0; i < bubbleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = radius * 0.7 * Math.random();
      const size = radius * 0.2 + Math.random() * radius * 0.15;
      
      const bubbleX = x + Math.cos(angle) * distance;
      const bubbleY = y + Math.sin(angle) * distance;
      
      ctx.beginPath();
      ctx.arc(bubbleX, bubbleY, size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 152, 0, 0.4)';
      ctx.fill();
    }
  }

  private clearBubbles(): void {
    if (this.bubbleOverlayCtx) {
      this.bubbleOverlayCtx.clearRect(0, 0, this.bubbleOverlayCanvas.width, this.bubbleOverlayCanvas.height);
    }
  }
  
  private syncCanvasSize(): void {
    // Only execute in browser environment
    if (isPlatformBrowser(this.platformId)) {
      const chartCanvas = document.getElementById('myChart') as HTMLCanvasElement;
      const overlay = document.getElementById('bubbleOverlay') as HTMLCanvasElement;
    
      if (chartCanvas && overlay) {
        const width = chartCanvas.clientWidth;
        const height = chartCanvas.clientHeight;
    
        chartCanvas.width = width;
        chartCanvas.height = height;
        overlay.width = width;
        overlay.height = height;
      }
    }
  }
  
}