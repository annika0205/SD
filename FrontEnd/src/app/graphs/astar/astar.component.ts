import { Component, OnInit, ViewChild, ElementRef, PLATFORM_ID, Inject, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface Node {
  x: number;
  y: number;
  q: number; // Für hexagonales Gitter
  r: number; // Für hexagonales Gitter
  f: number; // F-Wert (G + H)
  g: number; // G-Wert (Distanz vom Start)
  h: number; // H-Wert (Heuristik zum Ziel)
  walkable: boolean; // Ist begehbar (keine Wand)
  closed: boolean; // In geschlossener Liste
  parent: Node | null; // Elternknoten für Pfadrekonstruktion
  isStart: boolean; // Ist Startknoten
  isEnd: boolean; // Ist Endknoten
  isPath: boolean; // Ist Teil des gefundenen Pfades
  isOpen: boolean; // In offener Liste
}

@Component({
  selector: 'app-astar',
  templateUrl: './astar.component.html',
  styleUrls: ['./astar.component.css']
})
export class AstarComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  // Grid-Eigenschaften
  grid: Node[][] = [];
  startNode: Node | null = null;
  endNode: Node | null = null;
  openList: Node[] = [];
  
  // Konfiguration
  gridSize: number = 20;
  cellSize: number = 25;
  isHexGrid: boolean = false;
  isRunning: boolean = false;
  isDraggingStart: boolean = false;
  isDraggingEnd: boolean = false;
  isDrawingWalls: boolean = false;
  animationSpeed: number = 50;
  animationInterval: any = null;
  
  // UI-Steuerung
  showHexOption: boolean = true;
  isBrowser: boolean = false;
  ctx!: CanvasRenderingContext2D;
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.initializeGrid();
    }
  }
  
  ngAfterViewInit(): void {
    if (this.isBrowser && this.canvasRef) {
      this.setupCanvas();
    }
  }
  
  setupCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');
    
    if (!context) {
      console.error('Could not get 2D context from canvas element');
      return;
    }
    
    this.ctx = context;
    this.updateCanvasSize();
    
    // Event-Listener für Benutzerinteraktionen
    canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
    
    this.drawGrid();
  }
  
  // Touch-Event-Handler
  handleTouchStart(event: TouchEvent): void {
    event.preventDefault();
    const touch = event.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    this.handleMouseDown(mouseEvent);
  }
  
  handleTouchMove(event: TouchEvent): void {
    event.preventDefault();
    const touch = event.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    this.handleMouseMove(mouseEvent);
  }
  
  handleTouchEnd(): void {
    this.handleMouseUp();
  }
  
  private initializeGrid(): void {
    this.grid = [];
    
    if (this.isHexGrid) {
      const radius = Math.floor(this.gridSize / 2);
      
      for (let q = -radius; q <= radius; q++) {
        const r1 = Math.max(-radius, -q - radius);
        const r2 = Math.min(radius, -q + radius);
        for (let r = r1; r <= r2; r++) {
          if (!this.grid[q + radius]) {
            this.grid[q + radius] = [];
          }
          this.grid[q + radius][r + radius] = {
            x: q + radius,
            y: r + radius,
            q: q,
            r: r,
            f: 0,
            g: 0,
            h: 0,
            walkable: true,
            closed: false,
            parent: null,
            isStart: false,
            isEnd: false,
            isPath: false,
            isOpen: false
          };
        }
      }
      
      const startQ = -Math.floor(radius/2);
      const startR = 0;
      const endQ = Math.floor(radius/2);
      const endR = 0;
      
      if (this.grid[radius + startQ] && this.grid[radius + startQ][radius + startR]) {
        this.startNode = this.grid[radius + startQ][radius + startR];
        this.startNode.isStart = true;
      }
      
      if (this.grid[radius + endQ] && this.grid[radius + endQ][radius + endR]) {
        this.endNode = this.grid[radius + endQ][radius + endR];
        this.endNode.isEnd = true;
      }
    } else {
      for (let x = 0; x < this.gridSize; x++) {
        this.grid[x] = [];
        for (let y = 0; y < this.gridSize; y++) {
          this.grid[x][y] = {
            x: x,
            y: y,
            q: 0,
            r: 0,
            f: 0,
            g: 0,
            h: 0,
            walkable: true,
            closed: false,
            parent: null,
            isStart: false,
            isEnd: false,
            isPath: false,
            isOpen: false
          };
        }
      }
      
      const startX = Math.floor(this.gridSize / 4);
      const startY = Math.floor(this.gridSize / 2);
      const endX = Math.floor(this.gridSize * 3 / 4);
      const endY = Math.floor(this.gridSize / 2);
      
      this.startNode = this.grid[startX][startY];
      this.startNode.isStart = true;
      this.endNode = this.grid[endX][endY];
      this.endNode.isEnd = true;
    }
  }

  private drawGrid(): void {
    if (!this.ctx) return;
    
    this.ctx.fillStyle = '#f0f0f0';
    this.ctx.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    
    if (this.isHexGrid) {
      this.drawHexGrid();
    } else {
      this.drawSquareGrid();
    }
  }

  private drawSquareGrid(): void {
    for (let x = 0; x < this.gridSize; x++) {
      for (let y = 0; y < this.gridSize; y++) {
        const node = this.grid[x][y];
        const cellX = x * this.cellSize;
        const cellY = y * this.cellSize;
        
        this.setCellColor(node);
        this.ctx.fillRect(cellX, cellY, this.cellSize, this.cellSize);
        this.ctx.strokeStyle = '#E0E0E0';
        this.ctx.strokeRect(cellX, cellY, this.cellSize, this.cellSize);
        
        // F-, G-, H-Werte anzeigen für nicht-Start/End/Wall-Knoten
        if (!node.isStart && !node.isEnd && node.walkable && (node.isOpen || node.closed)) {
          const fontSize = Math.floor(this.cellSize / 6);
          this.ctx.font = `${fontSize}px Arial`;
          this.ctx.fillStyle = 'black';
          
          // F-Wert oben mittig
          this.ctx.fillText(`F:${Math.floor(node.f)}`, cellX + this.cellSize / 2 - fontSize, cellY + fontSize);
          
          // G-Wert unten links
          this.ctx.fillText(`G:${Math.floor(node.g)}`, cellX + 2, cellY + this.cellSize - 2);
          
          // H-Wert unten rechts
          this.ctx.fillText(`H:${Math.floor(node.h)}`, cellX + this.cellSize - fontSize * 2, cellY + this.cellSize - 2);
        }
      }
    }
  }

  private drawHexGrid(): void {
    const radius = Math.floor(this.gridSize / 2);
    for (let q = -radius; q <= radius; q++) {
      const r1 = Math.max(-radius, -q - radius);
      const r2 = Math.min(radius, -q + radius);
      for (let r = r1; r <= r2; r++) {
        const gridQ = q + radius;
        const gridR = r + radius;
        if (this.grid[gridQ] && this.grid[gridQ][gridR]) {
          const node = this.grid[gridQ][gridR];
          const [x, y] = this.hexToPixel(q, r);
          this.setCellColor(node);
          this.drawHexagon(x, y);
          
          // F-, G-, H-Werte für Hex-Knoten anzeigen
          if (!node.isStart && !node.isEnd && node.walkable && (node.isOpen || node.closed)) {
            const fontSize = Math.floor(this.cellSize / 6);
            this.ctx.font = `${fontSize}px Arial`;
            this.ctx.fillStyle = 'black';
            
            // F-Wert mittig
            this.ctx.fillText(`F:${Math.floor(node.f)}`, x - fontSize, y);
            
            // G-Wert unten links
            this.ctx.fillText(`G:${Math.floor(node.g)}`, x - fontSize * 1.5, y + fontSize * 1.5);
            
            // H-Wert unten rechts
            this.ctx.fillText(`H:${Math.floor(node.h)}`, x + fontSize * 0.5, y + fontSize * 1.5);
          }
        }
      }
    }
  }

  private setCellColor(node: Node): void {
    if (node.isStart) {
      this.ctx.fillStyle = '#4CAF50'; // Grün
    } else if (node.isEnd) {
      this.ctx.fillStyle = '#F44336'; // Rot
    } else if (!node.walkable) {
      this.ctx.fillStyle = '#616161'; // Dunkelgrau
    } else if (node.isPath) {
      this.ctx.fillStyle = '#FFC107'; // Gelb
    } else if (node.closed) {
      this.ctx.fillStyle = 'rgba(244, 67, 54, 0.3)'; // Rot mit Transparenz
    } else if (node.isOpen) {
      this.ctx.fillStyle = 'rgba(76, 175, 80, 0.3)'; // Grün mit Transparenz
    } else {
      this.ctx.fillStyle = '#FFFFFF'; // Weiß
    }
  }

  private drawHexagon(x: number, y: number): void {
    const size = this.cellSize / 2;
    
    this.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60 + 30) * Math.PI / 180;
      const px = x + size * Math.cos(angle);
      const py = y + size * Math.sin(angle);
      if (i === 0) {
        this.ctx.moveTo(px, py);
      } else {
        this.ctx.lineTo(px, py);
      }
    }
    this.ctx.closePath();
    
    this.ctx.fill();
    this.ctx.strokeStyle = '#E0E0E0';
    this.ctx.stroke();
  }

  private hexToPixel(q: number, r: number): [number, number] {
    const size = this.cellSize / 2;
    const x = size * (Math.sqrt(3) * q + Math.sqrt(3)/2 * r);
    const y = size * (3/2 * r);
    return [
      x + this.canvasRef.nativeElement.width/2, 
      y + this.canvasRef.nativeElement.height/2
    ];
  }

  private getNodeFromMousePosition(e: MouseEvent): Node | null {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    if (this.isHexGrid) {
      const [q, r] = this.pixelToHex(mouseX, mouseY);
      const radius = Math.floor(this.gridSize / 2);
      const gridQ = q + radius;
      const gridR = r + radius;
      
      if (this.grid[gridQ] && this.grid[gridQ][gridR]) {
        return this.grid[gridQ][gridR];
      }
    } else {
      const col = Math.floor(mouseX / this.cellSize);
      const row = Math.floor(mouseY / this.cellSize);
      
      if (col >= 0 && col < this.gridSize && row >= 0 && row < this.gridSize) {
        return this.grid[col][row];
      }
    }
    
    return null;
  }

  private pixelToHex(x: number, y: number): [number, number] {
    const size = this.cellSize / 2;
    x = x - this.canvasRef.nativeElement.width/2;
    y = y - this.canvasRef.nativeElement.height/2;
    
    const q = (Math.sqrt(3)/3 * x - 1/3 * y) / size;
    const r = (2/3 * y) / size;
    
    return this.roundHex(q, r);
  }

  private roundHex(q: number, r: number): [number, number] {
    let s = -q - r;
    let rq = Math.round(q);
    let rr = Math.round(r);
    let rs = Math.round(s);
    
    const qDiff = Math.abs(rq - q);
    const rDiff = Math.abs(rr - r);
    const sDiff = Math.abs(rs - s);
    
    if (qDiff > rDiff && qDiff > sDiff) {
      rq = -rr - rs;
    } else if (rDiff > sDiff) {
      rr = -rq - rs;
    } else {
      rs = -rq - rr;
    }
    
    return [rq, rr];
  }

  handleMouseDown(e: MouseEvent): void {
    if (this.isRunning) return;
    
    const node = this.getNodeFromMousePosition(e);
    if (!node) return;
    
    if (node.isStart) {
      this.isDraggingStart = true;
    } else if (node.isEnd) {
      this.isDraggingEnd = true;
    } else {
      this.isDrawingWalls = true;
      node.walkable = !node.walkable;
      this.drawGrid();
    }
  }

  handleMouseMove(e: MouseEvent): void {
    if (this.isRunning) return;
    
    const node = this.getNodeFromMousePosition(e);
    if (!node) return;
    
    if (this.isDraggingStart && !node.isEnd && node.walkable) {
      if (this.startNode) {
        this.startNode.isStart = false;
      }
      this.startNode = node;
      node.isStart = true;
      this.drawGrid();
    } else if (this.isDraggingEnd && !node.isStart && node.walkable) {
      if (this.endNode) {
        this.endNode.isEnd = false;
      }
      this.endNode = node;
      node.isEnd = true;
      this.drawGrid();
    } else if (this.isDrawingWalls && !node.isStart && !node.isEnd) {
      node.walkable = !node.walkable;
      this.drawGrid();
    }
  }

  handleMouseUp(): void {
    this.isDraggingStart = false;
    this.isDraggingEnd = false;
    this.isDrawingWalls = false;
  }

  startAStarAlgorithm(): void {
    if (this.isRunning || !this.startNode || !this.endNode) return;
    
    this.resetPathfinding();
    this.isRunning = true;
    
    this.openList = [this.startNode];
    this.startNode.g = 0;
    this.startNode.h = this.heuristic(this.startNode, this.endNode);
    this.startNode.f = this.startNode.g + this.startNode.h;
    this.startNode.isOpen = true;
    
    this.animationInterval = window.setInterval(() => {
      this.aStarStep();
    }, this.animationSpeed);
  }

  private aStarStep(): void {
    if (!this.startNode || !this.endNode) return;
    if (this.openList.length === 0) {
      this.finishAlgorithm(false);
      return;
    }
    
    let currentIndex = 0;
    for (let i = 1; i < this.openList.length; i++) {
      if (this.openList[i].f < this.openList[currentIndex].f) {
        currentIndex = i;
      }
    }
    const currentNode = this.openList[currentIndex];
    
    if (currentNode === this.endNode) {
      this.tracePath();
      this.finishAlgorithm(true);
      return;
    }
    
    this.openList.splice(currentIndex, 1);
    currentNode.closed = true;
    currentNode.isOpen = false;
    
    const neighbors = this.getNeighbors(currentNode);
    for (const neighbor of neighbors) {
      if (neighbor.closed) continue;
      
      const gScore = currentNode.g + this.getDistance(currentNode, neighbor);
      const wasInOpenList = neighbor.isOpen;
      
      if (!wasInOpenList || gScore < neighbor.g) {
        neighbor.g = gScore;
        neighbor.h = this.heuristic(neighbor, this.endNode!);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = currentNode;
        
        if (!wasInOpenList) {
          this.openList.push(neighbor);
          neighbor.isOpen = true;
        }
      }
    }
    
    this.drawGrid();
  }

  private getNeighbors(node: Node): Node[] {
    const neighbors: Node[] = [];
    
    if (this.isHexGrid) {
      const directions = [
        [1, -1], [1, 0], [0, 1],
        [-1, 1], [-1, 0], [0, -1]
      ];
      
      const radius = Math.floor(this.gridSize / 2);
      
      for (const [dq, dr] of directions) {
        const newQ = node.q + dq;
        const newR = node.r + dr;
        const newS = -newQ - newR;
        
        if (Math.abs(newQ) <= radius && 
            Math.abs(newR) <= radius && 
            Math.abs(newS) <= radius) {
          const gridQ = newQ + radius;
          const gridR = newR + radius;
          
          if (this.grid[gridQ] && this.grid[gridQ][gridR] && 
              this.grid[gridQ][gridR].walkable) {
            neighbors.push(this.grid[gridQ][gridR]);
          }
        }
      }
    } else {
      // Option für diagonale Bewegungen (auskommentiert)
      // const directions = [
      //   [0, -1], [1, -1], [1, 0], [1, 1], 
      //   [0, 1], [-1, 1], [-1, 0], [-1, -1]
      // ];
      
      // Nur orthogonale Bewegungen (oben, rechts, unten, links)
      const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
      
      for (const [dx, dy] of directions) {
        const newX = node.x + dx;
        const newY = node.y + dy;
        
        if (newX >= 0 && newX < this.gridSize && 
            newY >= 0 && newY < this.gridSize && 
            this.grid[newX][newY].walkable) {
          neighbors.push(this.grid[newX][newY]);
        }
      }
    }
    
    return neighbors;
  }

  private heuristic(a: Node, b: Node): number {
    if (this.isHexGrid) {
      // Hexagonale Entfernung (Maximal-Metrik)
      const dq = Math.abs(a.q - b.q);
      const dr = Math.abs(a.r - b.r);
      const ds = Math.abs((-a.q - a.r) - (-b.q - b.r));
      return Math.max(dq, dr, ds) * 10;
    } else {
      // Manhattan-Distanz (Quadratisches Gitter)
      const dx = Math.abs(a.x - b.x);
      const dy = Math.abs(a.y - b.y);
      return (dx + dy) * 10; // * 10 für mehr Präzision
    }
  }

  private getDistance(a: Node, b: Node): number {
    // Einheitliche Kosten (10 für orthogonale, 14 für diagonale Bewegungen)
    if (this.isHexGrid) {
      return 10;  // Einheitliche Kosten für Hex-Bewegungen
    } else {
      return (a.x !== b.x && a.y !== b.y) ? 14 : 10; // 14 für Diagonale (√2 * 10)
    }
  }

  private tracePath(): void {
    if (!this.endNode) return;
    
    let current: Node | null = this.endNode;
    while (current && current !== this.startNode) {
      current = current.parent;
      if (current && current !== this.startNode) {
        current.isPath = true;
      }
    }
  }

  private finishAlgorithm(success: boolean): void {
    if (this.animationInterval !== null) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
    this.isRunning = false;
    this.drawGrid();
    
    if (success) {
      console.log('Pfad gefunden!');
    } else {
      console.log('Kein Pfad gefunden!');
    }
  }

  resetPathfinding(): void {
    if (this.isRunning && this.animationInterval !== null) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
    this.isRunning = false;
    
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        if (this.grid[i][j]) {
          const node = this.grid[i][j];
          node.f = 0;
          node.g = 0;
          node.h = 0;
          node.closed = false;
          node.parent = null;
          node.isPath = false;
          node.isOpen = false;
        }
      }
    }
    
    this.openList = [];
    this.drawGrid();
  }

  resetGrid(): void {
    if (this.isRunning && this.animationInterval !== null) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
    this.isRunning = false;
    this.initializeGrid();
    this.drawGrid();
  }

  setGridType(hexagonal: boolean): void {
    if (this.isHexGrid === hexagonal) return;
    this.isHexGrid = hexagonal;
    
    this.updateCanvasSize();
    this.resetGrid();
  }

  private updateCanvasSize(): void {
    if (this.isHexGrid) {
      const size = this.cellSize / 2;
      const radius = Math.floor(this.gridSize / 2);
      const width = size * Math.sqrt(3) * (2 * radius + 1);
      const height = size * 3 * (2 * radius + 1) / 2;
      
      this.canvasRef.nativeElement.width = width + this.cellSize;
      this.canvasRef.nativeElement.height = height + this.cellSize;
    } else {
      this.canvasRef.nativeElement.width = this.gridSize * this.cellSize;
      this.canvasRef.nativeElement.height = this.gridSize * this.cellSize;
    }
  }

  handleGridSizeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newSize = parseInt(target.value, 10);
    this.gridSize = Math.min(40, Math.max(5, newSize));
    this.updateCanvasSize();
    this.resetGrid();
  }
  handleSpeedChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.animationSpeed = 210 - parseInt(input.value, 10);
    
    if (this.isRunning && this.animationInterval !== null) {
      clearInterval(this.animationInterval);
      this.animationInterval = window.setInterval(() => {
        this.aStarStep();
      }, this.animationSpeed);
    }
  }

  // Diagonale Bewegung umschalten
  toggleDiagonal(): void {
    this.resetPathfinding();
    // Diese Methode können Sie implementieren, um zwischen orthogonalen 
    // und diagonalen Bewegungen zu wechseln
  }
}