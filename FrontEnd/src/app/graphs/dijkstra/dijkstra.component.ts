import { Component, OnInit, ViewChild, ElementRef, PLATFORM_ID, Inject, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface Node {
  x: number;
  y: number;
  q: number; // Für hexagonales Gitter
  r: number; // Für hexagonales Gitter
  f: number; // Wird in Dijkstra nicht verwendet
  g: number; // Distanz vom Start (in Dijkstra die einzige relevante Metrik)
  h: number; // Wird in Dijkstra nicht verwendet
  isOnPath: boolean;
  isVisited: boolean;
  isInOpenSet: boolean;
  walkable: boolean; // Ist begehbar (keine Wand)
  closed: boolean; // In geschlossener Liste
  parent: Node | null; // Elternknoten für Pfadrekonstruktion
  isStart: boolean; // Ist Startknoten
  isEnd: boolean; // Ist Endknoten
  isPath: boolean; // Ist Teil des gefundenen Pfades
  isOpen: boolean; // In offener Liste
}

@Component({
  selector: 'app-dijkstra',
  templateUrl: './dijkstra.component.html',
  styleUrls: ['./dijkstra.component.css']
})
export class DijkstraComponent implements OnInit, AfterViewInit {
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
  statisticsVisible: boolean = false;
  
  // UI-Steuerung
  showHexOption: boolean = true;
  isBrowser: boolean = false;
  ctx!: CanvasRenderingContext2D;
  
  // Statistiken
  pathFound: boolean = false;
  executionTime: number = 0;
  visitedNodesCount: number = 0;
  pathLength: number = 0;
  calculationsCount: number = 0;
  startTime: number = 0;
  
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

  showStatistics(): boolean {
    return this.statisticsVisible;
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
            g: Infinity, // Dijkstra: Initialisiere Distanz mit Unendlich
            h: 0,
            walkable: true,
            closed: false,
            parent: null,
            isStart: false,
            isEnd: false,
            isPath: false,
            isOpen: false,
            isOnPath: false,
            isVisited: false,
            isInOpenSet: false,
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
            g: Infinity, // Dijkstra: Initialisiere Distanz mit Unendlich
            h: 0,
            walkable: true,
            closed: false,
            parent: null,
            isStart: false,
            isEnd: false,
            isPath: false,
            isOpen: false,
            isOnPath: false,
            isVisited: false,
            isInOpenSet: false,
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
    
    this.ctx.fillStyle = 'transparent'
    //this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
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
        this.ctx.strokeStyle = '#999999';
        this.ctx.strokeRect(cellX, cellY, this.cellSize, this.cellSize);
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
      this.ctx.fillStyle = '#ddd'; // Weiß
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
    this.ctx.strokeStyle = '#999999';
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
    const scaleX = this.canvasRef.nativeElement.width / rect.width;
    const scaleY = this.canvasRef.nativeElement.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    
    if (this.isHexGrid) {
      const [q, r] = this.pixelToHex(mouseX, mouseY);
      const radius = Math.floor(this.gridSize / 2);
      const gridQ = q + radius;
      const gridR = r + radius;
      
      if (this.grid[gridQ] && this.grid[gridQ][gridR]) {
        return this.grid[gridQ][gridR];
      }
    } else {
      let col, row;
      
      if (this.cellSize >= 39) {
        col = Math.floor((mouseX + 0.5) / this.cellSize);
        row = Math.floor((mouseY + 0.5) / this.cellSize);
      } else {
        col = Math.floor(mouseX / this.cellSize);
        row = Math.floor(mouseY / this.cellSize);
      }
      
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

  startDijkstraAlgorithm(): void {
    if (this.isRunning || !this.startNode || !this.endNode) return;
    
    this.resetPathfinding();
    this.isRunning = true;
    this.pathFound = false;
    
    this.startTime = performance.now();
    this.calculationsCount = 0;
    
    // Dijkstra: Initialisiere Startknoten mit Distanz 0
    this.openList = [this.startNode];
    this.startNode.g = 0;
    this.startNode.isOpen = true;
    
    this.animationInterval = window.setInterval(() => {
      this.dijkstraStep();
    }, this.animationSpeed);
  }

  private dijkstraStep(): void {
    this.calculationsCount++;
    
    if (!this.startNode || !this.endNode) return;
    if (this.openList.length === 0) {
      this.finishAlgorithm(false);
      this.statisticsVisible = true;
      return;
    }
    
    // Finde den Knoten mit der kleinsten Distanz
    let currentIndex = 0;
    for (let i = 1; i < this.openList.length; i++) {
      if (this.openList[i].g < this.openList[currentIndex].g) {
        currentIndex = i;
      }
    }
    const currentNode = this.openList[currentIndex];
    
    if (currentNode === this.endNode) {
      this.pathFound = true;
      this.tracePath();
      this.finishAlgorithm(true);
      this.statisticsVisible = true;
      return;
    }
    
    this.openList.splice(currentIndex, 1);
    currentNode.closed = true;
    currentNode.isOpen = false;
    
    const neighbors = this.getNeighbors(currentNode);
    for (const neighbor of neighbors) {
      if (neighbor.closed) continue;
      
      const distance = currentNode.g + this.getDistance(currentNode, neighbor);
      
      if (!neighbor.isOpen || distance < neighbor.g) {
        neighbor.g = distance;
        neighbor.parent = currentNode;
        
        if (!neighbor.isOpen) {
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

  private getDistance(a: Node, b: Node): number {
    return 1; // Dijkstra verwendet einheitliche Kantengewichte
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
    
    const endTime = performance.now();
    this.executionTime = endTime - this.startTime;
    this.visitedNodesCount = this.countVisitedNodes();
    this.pathLength = this.calculatePathLength();
    
    if (success) {
      this.pathFound = true;
      console.log('Pfad gefunden!');
    } else {
      this.pathFound = false;
      console.log('Kein Pfad gefunden!');
    }
    
    this.drawGrid();
  }

  private countVisitedNodes(): number {
    let count = 0;
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        if (this.grid[i][j] && this.grid[i][j].closed) {
          count++;
        }
      }
    }
    return count;
  }

  private calculatePathLength(): number {
    let length = 0;
    let current = this.endNode;
    
    while (current && current !== this.startNode) {
      length++;
      current = current.parent;
    }
    
    return length;
  }

  resetPathfinding(): void {
    if (this.isRunning && this.animationInterval !== null) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
    this.statisticsVisible = false;
    this.isRunning = false;
    this.pathFound = false;
    
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        if (this.grid[i][j]) {
          const node = this.grid[i][j];
          node.g = Infinity;
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
    this.statisticsVisible = false;
    this.isRunning = false;
    this.pathFound = false;
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
      const gridPixelSize = this.gridSize * this.cellSize;
      this.canvasRef.nativeElement.width = gridPixelSize;
      this.canvasRef.nativeElement.height = gridPixelSize;
    }
  }

  handleGridSizeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newSize = parseInt(target.value, 10);
    this.gridSize = Math.min(50, Math.max(5, newSize));
    this.cellSize = Math.max(15, Math.min(38, Math.floor(1000 / this.gridSize)));
    
    console.log(`Grid size: ${this.gridSize}, Cell size: ${this.cellSize}`);
    
    this.updateCanvasSize();
    this.resetGrid();
  }

  handleSpeedChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.animationSpeed = 210 - parseInt(input.value, 10);
    
    if (this.isRunning && this.animationInterval !== null) {
      clearInterval(this.animationInterval);
      this.animationInterval = window.setInterval(() => {
        this.dijkstraStep();
      }, this.animationSpeed);
    }
  }

  getGridCellsCount(): number {
    if (this.isHexGrid) {
      let count = 0;
      const radius = Math.floor(this.gridSize / 2);
      
      for (let q = -radius; q <= radius; q++) {
        const r1 = Math.max(-radius, -q - radius);
        const r2 = Math.min(radius, -q + radius);
        count += (r2 - r1 + 1);
      }
      
      return count;
    } else {
      return this.gridSize * this.gridSize;
    }
  }

  getObstaclesCount(): number {
    let count = 0;
    
    if (this.isHexGrid) {
      const radius = Math.floor(this.gridSize / 2);
      
      for (let q = -radius; q <= radius; q++) {
        const r1 = Math.max(-radius, -q - radius);
        const r2 = Math.min(radius, -q + radius);
        
        for (let r = r1; r <= r2; r++) {
          const gridQ = q + radius;
          const gridR = r + radius;
          
          if (this.grid[gridQ] && this.grid[gridQ][gridR] && 
              !this.grid[gridQ][gridR].walkable) {
            count++;
          }
        }
      }
    } else {
      for (let x = 0; x < this.gridSize; x++) {
        for (let y = 0; y < this.gridSize; y++) {
          if (this.grid[x] && this.grid[x][y] && !this.grid[x][y].walkable) {
            count++;
          }
        }
      }
    }
    
    return count;
  }

  createRandomGrid(): void {
    if (this.isRunning) return;
    this.statisticsVisible = false;
    
    this.resetPathfinding();
    this.openList = [];
    this.pathFound = false;
    
    if (this.isHexGrid) {
      this.createRandomHexGrid();
    } else {
      this.createRandomSquareGrid();
    }
    
    this.drawGrid();
  }
  
  private createRandomSquareGrid(): void {
    for (let x = 0; x < this.gridSize; x++) {
      for (let y = 0; y < this.gridSize; y++) {
        if (this.grid[x] && this.grid[x][y]) {
          const node = this.grid[x][y];
          node.isStart = false;
          node.isEnd = false;
          node.walkable = true;
          node.g = Infinity;
          node.parent = null;
          node.isPath = false;
          node.isOpen = false;
          node.closed = false;
        }
      }
    }
    
    const obstaclePercentage = 0.25;
    const minStartEndDistance = Math.floor(this.gridSize / 3);
    const margin = 2;
    
    const startX = margin + Math.floor(Math.random() * (this.gridSize - 2 * margin));
    const startY = margin + Math.floor(Math.random() * (this.gridSize - 2 * margin));
    
    this.startNode = this.grid[startX][startY];
    this.startNode.isStart = true;
    
    let endX, endY;
    let isValidEndPosition = false;
    let attempts = 0;
    const maxAttempts = 100;
    
    do {
      endX = margin + Math.floor(Math.random() * (this.gridSize - 2 * margin));
      endY = margin + Math.floor(Math.random() * (this.gridSize - 2 * margin));
      
      const manhattanDistance = Math.abs(startX - endX) + Math.abs(startY - endY);
      isValidEndPosition = (manhattanDistance >= minStartEndDistance);
      attempts++;
    } while (!isValidEndPosition && attempts < maxAttempts);
    
    this.endNode = this.grid[endX][endY];
    this.endNode.isEnd = true;
    
    for (let x = 0; x < this.gridSize; x++) {
      for (let y = 0; y < this.gridSize; y++) {
        if ((this.grid[x][y] !== this.startNode) && (this.grid[x][y] !== this.endNode)) {
          if (Math.random() < obstaclePercentage) {
            this.grid[x][y].walkable = false;
          }
        }
      }
    }
  }
  
  private createRandomHexGrid(): void {
    const radius = Math.floor(this.gridSize / 2);
    
    // Zurücksetzen aller Knoten im Hex-Grid
    for (let q = -radius; q <= radius; q++) {
      const r1 = Math.max(-radius, -q - radius);
      const r2 = Math.min(radius, -q + radius);
      for (let r = r1; r <= r2; r++) {
        const gridQ = q + radius;
        const gridR = r + radius;
        
        if (this.grid[gridQ] && this.grid[gridQ][gridR]) {
          const node = this.grid[gridQ][gridR];
          node.isStart = false;
          node.isEnd = false;
          node.walkable = true;
          node.g = Infinity;
          node.parent = null;
          node.isPath = false;
          node.isOpen = false;
          node.closed = false;
        }
      }
    }
    
    // Prozentsatz der Hindernisse
    const obstaclePercentage = 0.25;
    const minHexDistance = Math.floor(radius / 2);
    
    // Erzeugen einer Liste gültiger Koordinaten
    const validCoords: [number, number][] = [];
    for (let q = -radius; q <= radius; q++) {
      const r1 = Math.max(-radius, -q - radius);
      const r2 = Math.min(radius, -q + radius);
      for (let r = r1; r <= r2; r++) {
        validCoords.push([q, r]);
      }
    }
    
    // Keine gültigen Koordinaten? Abbrechen
    if (validCoords.length === 0) {
      console.error("Keine gültigen Hex-Koordinaten gefunden!");
      return;
    }
    
    // Zufällige Position für Start
    const startIdx = Math.floor(Math.random() * validCoords.length);
    const [startQ, startR] = validCoords[startIdx];
    const gridStartQ = startQ + radius;
    const gridStartR = startR + radius;
    
    if (this.grid[gridStartQ] && this.grid[gridStartQ][gridStartR]) {
      this.startNode = this.grid[gridStartQ][gridStartR];
      this.startNode.isStart = true;
    } else {
      console.error("Ungültige Start-Koordinaten!");
      return;
    }
    
    // Finde gültige End-Position mit Mindestabstand
    let endIdx;
    let endQ, endR, gridEndQ, gridEndR;
    let isValidEndPosition = false;
    let attempts = 0;
    const maxAttempts = 100;
    
    do {
      endIdx = Math.floor(Math.random() * validCoords.length);
      [endQ, endR] = validCoords[endIdx];
      
      // Berechne hexagonale Distanz
      const hexDistance = Math.max(
        Math.abs(startQ - endQ),
        Math.abs(startR - endR),
        Math.abs((-startQ - startR) - (-endQ - endR))
      );
      
      isValidEndPosition = (hexDistance >= minHexDistance);
      attempts++;
      
    } while (!isValidEndPosition && attempts < maxAttempts);
    
    gridEndQ = endQ + radius;
    gridEndR = endR + radius;
    
    if (this.grid[gridEndQ] && this.grid[gridEndQ][gridEndR]) {
      this.endNode = this.grid[gridEndQ][gridEndR];
      this.endNode.isEnd = true;
    } else {
      console.error("Ungültige End-Koordinaten!");
      return;
    }
    
    // Zufällige Hindernisse platzieren
    for (let q = -radius; q <= radius; q++) {
      const r1 = Math.max(-radius, -q - radius);
      const r2 = Math.min(radius, -q + radius);
      for (let r = r1; r <= r2; r++) {
        const gridQ = q + radius;
        const gridR = r + radius;
        
        if (this.grid[gridQ] && this.grid[gridQ][gridR]) {
          const node = this.grid[gridQ][gridR];
          if (node === this.startNode || node === this.endNode) {
            continue;
          }
          
          if (Math.random() < obstaclePercentage) {
            node.walkable = false;
          }
        }
      }
    }
    
    // Etwas Platz um Start und Ziel freihalten
    this.clearAroundHexNode(this.startNode, 1);
    this.clearAroundHexNode(this.endNode, 1);
  }
  
  private clearAroundHexNode(node: Node, radius: number = 1): void {
    if (!node || !this.isHexGrid) return;
    
    const gridRadius = Math.floor(this.gridSize / 2);
    const directions = [
      [0, 0],  // Der Knoten selbst
      [1, 0],  // Rechts
      [1, -1], // Rechts oben
      [0, 1],  // Links unten
      [-1, 1], // Links
      [-1, 0], // Links oben
      [0, -1]  // Rechts unten
    ];
    
    for (const [dq, dr] of directions) {
      const nq = node.q + dq;
      const nr = node.r + dr;
      
      if (Math.abs(nq) <= gridRadius && 
          Math.abs(nr) <= gridRadius && 
          Math.abs(-nq - nr) <= gridRadius) {
        
        const gridQ = nq + gridRadius;
        const gridR = nr + gridRadius;
        
        if (this.grid[gridQ] && this.grid[gridQ][gridR]) {
          this.grid[gridQ][gridR].walkable = true;
        }
      }
    }
  }
  
  private clearAroundNode(node: Node, radius: number = 1): void {
    if (!node) return;
    
    if (this.isHexGrid) {
      const gridRadius = Math.floor(this.gridSize / 2);
      
      for (let q = -radius; q <= radius; q++) {
        for (let r = Math.max(-radius, -q-radius); r <= Math.min(radius, -q+radius); r++) {
          const neighborQ = node.q + q;
          const neighborR = node.r + r;
          
          if (Math.abs(neighborQ) <= gridRadius && 
              Math.abs(neighborR) <= gridRadius && 
              Math.abs(-neighborQ - neighborR) <= gridRadius) {
            const gridQ = neighborQ + gridRadius;
            const gridR = neighborR + gridRadius;
            
            if (this.grid[gridQ] && this.grid[gridQ][gridR]) {
              this.grid[gridQ][gridR].walkable = true;
            }
          }
        }
      }
    } else {
      for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {
          const nx = node.x + dx;
          const ny = node.y + dy;
          
          if (nx >= 0 && nx < this.gridSize && ny >= 0 && ny < this.gridSize) {
            this.grid[nx][ny].walkable = true;
          }
        }
      }
    }
  }
  
  private findNodeWithLowestDistance(): Node {
    let lowestIndex = 0;
    for (let i = 1; i < this.openList.length; i++) {
      if (this.openList[i].g < this.openList[lowestIndex].g) {
        lowestIndex = i;
      }
    }
    return this.openList[lowestIndex];
  }
  
  private calculateStepsPerSecond(): number {
    if (this.executionTime <= 0) return 0;
    return Math.round(this.calculationsCount / (this.executionTime / 1000));
  }
  
  private visualizeProgress(): void {
    let totalNodes = 0;
    let visitedCount = 0;
    
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        if (this.grid[i][j]) {
          totalNodes++;
          if (this.grid[i][j].closed || this.grid[i][j].isOpen) {
            visitedCount++;
          }
        }
      }
    }
    
    const progressPercentage = totalNodes > 0 ? (visitedCount / totalNodes) * 100 : 0;
    console.log(`Suchfortschritt: ${progressPercentage.toFixed(1)}% (${visitedCount}/${totalNodes} Knoten)`);
  }
  
  checkPathExists(): boolean {
    if (!this.startNode || !this.endNode) return false;
    
    const visited: boolean[][] = Array(this.gridSize).fill(false).map(() => Array(this.gridSize).fill(false));
    const queue: Node[] = [this.startNode];
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      
      if (current === this.endNode) {
        return true;
      }
      
      const x = current.x;
      const y = current.y;
      
      if (visited[x][y]) continue;
      visited[x][y] = true;
      
      const neighbors = this.getNeighbors(current);
      for (const neighbor of neighbors) {
        if (!visited[neighbor.x][neighbor.y]) {
          queue.push(neighbor);
        }
      }
    }
    
    return false;
  }
}