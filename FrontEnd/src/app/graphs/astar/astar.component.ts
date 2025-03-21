import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

interface Node {
  id: number;
  x: number;
  y: number;
  gScore: number;
  fScore: number;
  parent: Node | null;
}

interface Edge {
  from: Node;
  to: Node;
  weight: number;
}

@Component({
  selector: 'app-astar-visualization',
  templateUrl: './astar.component.html',
  styleUrls: ['./astar.component.css']
})
export class AstarComponent implements OnInit {
  @ViewChild('gridContainer') gridContainer?: ElementRef;
  @ViewChild('graphCanvas') graphCanvas?: ElementRef;
  
  mode: 'grid' | 'graph' = 'grid';
  isRunning = false;
  allowDiagonals = true;
  creatingEdge = false;
  
  // Grid properties
  grid: any[][] = [];
  gridSize = 20;
  startPos: [number, number] = [2, 2];
  endPos: [number, number] = [17, 17];
  
  // Graph properties
  nodes: Node[] = [];
  edges: Edge[] = [];
  selectedNode: Node | null = null;
  edgeStartNode: Node | null = null;
  startNode: Node | null = null;
  endNode: Node | null = null;
  ctx!: CanvasRenderingContext2D;
  
  // Algorithm properties
  openList: any[] = [];
  closedList: any[] = [];
  path: any[] = [];
  lastMouseX = 0;
  lastMouseY = 0;
  ngOnInit() {
    this.initializeGrid();
    setTimeout(() => {
      if (this.mode === 'graph') {
        this.initializeGraph();
      }
    }, 0);
  }
  
  setMode(mode: 'grid' | 'graph') {
    this.mode = mode;
    this.resetVisualization();
    
    if (mode === 'graph' && !this.ctx) {
      setTimeout(() => {
        this.initializeGraph();
      }, 0);
    }
  }
  
  // Grid methods
  initializeGrid() {
    this.grid = [];
    for (let i = 0; i < this.gridSize; i++) {
      const row = [];
      for (let j = 0; j < this.gridSize; j++) {
        row.push({
          x: i,
          y: j,
          isWall: false,
          isStart: i === this.startPos[0] && j === this.startPos[1],
          isEnd: i === this.endPos[0] && j === this.endPos[1],
          isOpen: false,
          isClosed: false,
          isPath: false,
          gScore: Infinity,
          fScore: Infinity,
          parent: null
        });
      }
      this.grid.push(row);
    }
  }
  
  getCellClass(cell: any) {
    if (cell.isStart) return 'start';
    if (cell.isEnd) return 'end';
    if (cell.isWall) return 'wall';
    if (cell.isPath) return 'path';
    if (cell.isOpen) return 'open';
    if (cell.isClosed) return 'closed';
    return '';
  }
  
  onCellClick(i: number, j: number) {
    if (this.isRunning) return;
    
    const cell = this.grid[i][j];
    
    // Cannot modify start or end cells
    if (cell.isStart || cell.isEnd) return;
    
    // Toggle wall
    cell.isWall = !cell.isWall;
  }
  
  onCellHover(i: number, j: number, event: MouseEvent) {
    if (this.isRunning) return;
    
    // If mouse is pressed (drag), toggle walls
    if (event.buttons === 1) {
      const cell = this.grid[i][j];
      if (!cell.isStart && !cell.isEnd) {
        cell.isWall = true;
      }
    }
  }
  
  randomizeObstacles() {
    if (this.isRunning) return;
    
    this.resetVisualization();
    
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const cell = this.grid[i][j];
        if (!cell.isStart && !cell.isEnd) {
          cell.isWall = Math.random() < 0.3;
        }
      }
    }
  }
  
  toggleDiagonals() {
    this.allowDiagonals = !this.allowDiagonals;
  }
  
  // Graph methods
  initializeGraph() {
    if (!this.graphCanvas) return;
    const canvas = this.graphCanvas.nativeElement;
    this.ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Add event listeners
    canvas.addEventListener('click', this.handleCanvasClick.bind(this));
    canvas.addEventListener('contextmenu', this.handleCanvasRightClick.bind(this));
    
    this.drawGraph();
  }
  
  handleCanvasClick(event: MouseEvent) {
    if (this.isRunning) return;
    if (!this.graphCanvas) return;
    

    const rect = this.graphCanvas.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    if (this.creatingEdge) {
      const clickedNode = this.findNodeAt(x, y);
      if (clickedNode) {
        if (!this.edgeStartNode) {
          this.edgeStartNode = clickedNode;
        } else if (this.edgeStartNode !== clickedNode) {
          // Create edge
          const distance = this.calculateDistance(
            this.edgeStartNode.x,
            this.edgeStartNode.y,
            clickedNode.x,
            clickedNode.y
          );
          
          this.edges.push({
            from: this.edgeStartNode,
            to: clickedNode,
            weight: distance
          });
          
          this.edgeStartNode = null;
          this.drawGraph();
        }
      }
    } else {
      // Check if clicked on existing node
      const existingNode = this.findNodeAt(x, y);
      if (!existingNode) {
        // Add new node
        const newNode: Node = {
          id: this.nodes.length,
          x: x,
          y: y,
          gScore: Infinity,
          fScore: Infinity,
          parent: null
        };
        
        this.nodes.push(newNode);
        this.drawGraph();
      }
    }
  }
  
  handleCanvasRightClick(event: MouseEvent) {
    event.preventDefault();
    if (this.isRunning) return;
    if (!this.graphCanvas) return;
    const rect = this.graphCanvas.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const clickedNode = this.findNodeAt(x, y);
    if (clickedNode) {
      // Toggle start/end node
      if (this.startNode === clickedNode) {
        this.startNode = null;
      } else if (this.endNode === clickedNode) {
        this.endNode = null;
      } else if (!this.startNode) {
        this.startNode = clickedNode;
      } else if (!this.endNode) {
        this.endNode = clickedNode;
      } else {
        // Both start and end are set, replace start
        this.startNode = clickedNode;
      }
      
      this.drawGraph();
    }
  }
  
  findNodeAt(x: number, y: number): Node | null {
    const radius = 15; // Node radius
    for (const node of this.nodes) {
      const distance = this.calculateDistance(x, y, node.x, node.y);
      if (distance <= radius) {
        return node;
      }
    }
    return null;
  }
  
  calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
  
  drawGraph() {
    if (!this.graphCanvas) return;
    const canvas = this.graphCanvas.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw edges
    this.ctx.strokeStyle = '#999';
    this.ctx.lineWidth = 2;
    for (const edge of this.edges) {
      this.ctx.beginPath();
      this.ctx.moveTo(edge.from.x, edge.from.y);
      this.ctx.lineTo(edge.to.x, edge.to.y);
      this.ctx.stroke();
      
      // Draw weight
      const midX = (edge.from.x + edge.to.x) / 2;
      const midY = (edge.from.y + edge.to.y) / 2;
      this.ctx.fillStyle = '#333';
      this.ctx.font = '12px Arial';
      this.ctx.fillText(edge.weight.toFixed(1), midX, midY);
    }
    
    // Draw path
    if (this.path.length > 0) {
      this.ctx.strokeStyle = '#FFC107';
      this.ctx.lineWidth = 4;
      this.ctx.beginPath();
      this.ctx.moveTo(this.path[0].x, this.path[0].y);
      for (let i = 1; i < this.path.length; i++) {
        this.ctx.lineTo(this.path[i].x, this.path[i].y);
      }
      this.ctx.stroke();
    }
    
    // Draw nodes
    const radius = 15;
    for (const node of this.nodes) {
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      
      // Select color based on node status
      if (node === this.startNode) {
        this.ctx.fillStyle = '#4CAF50';
      } else if (node === this.endNode) {
        this.ctx.fillStyle = '#F44336';
      } else if (this.openList.includes(node)) {
        this.ctx.fillStyle = '#2196F3';
      } else if (this.closedList.includes(node)) {
        this.ctx.fillStyle = '#9C27B0';
      } else {
        this.ctx.fillStyle = '#ddd';
      }
      
      this.ctx.fill();
      this.ctx.stroke();
      
      // Draw node ID
      this.ctx.fillStyle = '#000';
      this.ctx.font = '12px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(node.id.toString(), node.x, node.y);
    }
    
    // Draw creating edge line
    if (this.creatingEdge && this.edgeStartNode) {
      const rect = this.graphCanvas.nativeElement.getBoundingClientRect();
      const mouseX = this.lastMouseX - rect.left;
      const mouseY = this.lastMouseY - rect.top;
      
      this.ctx.strokeStyle = '#999';
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([5, 5]);
      this.ctx.beginPath();
      this.ctx.moveTo(this.edgeStartNode.x, this.edgeStartNode.y);
      this.ctx.lineTo(mouseX, mouseY);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }
  }
  

  
  addNode() {
    if (this.isRunning) return;
    if (!this.graphCanvas) return;
    const canvas = this.graphCanvas.nativeElement;
    const x = Math.random() * (canvas.width - 60) + 30;
    const y = Math.random() * (canvas.height - 60) + 30;
    
    const newNode: Node = {
      id: this.nodes.length,
      x: x,
      y: y,
      gScore: Infinity,
      fScore: Infinity,
      parent: null
    };
    
    this.nodes.push(newNode);
    this.drawGraph();
  }
  
  toggleEdgeCreation() {
    this.creatingEdge = !this.creatingEdge;
    this.edgeStartNode = null;
    if (!this.graphCanvas) return;
    if (this.creatingEdge) {
      // Add mouse move listener
      this.graphCanvas.nativeElement.addEventListener('mousemove', this.handleMouseMove.bind(this));
    } else {
      // Remove mouse move listener
      this.graphCanvas.nativeElement.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    }
  }
  
  handleMouseMove(event: MouseEvent) {
    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;
    
    if (this.creatingEdge && this.edgeStartNode) {
      this.drawGraph();
    }
  }
  
  // Algorithm methods
  async startAlgorithm() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.resetPathfinding();
    
    if (this.mode === 'grid') {
      await this.runGridAStar();
    } else {
      await this.runGraphAStar();
    }
    
    this.isRunning = false;
  }
  
  resetPathfinding() {
    if (this.mode === 'grid') {
      // Reset grid cells
      for (let i = 0; i < this.gridSize; i++) {
        for (let j = 0; j < this.gridSize; j++) {
          const cell = this.grid[i][j];
          cell.isOpen = false;
          cell.isClosed = false;
          cell.isPath = false;
          cell.gScore = Infinity;
          cell.fScore = Infinity;
          cell.parent = null;
        }
      }
    } else {
      // Reset graph nodes
      for (const node of this.nodes) {
        node.gScore = Infinity;
        node.fScore = Infinity;
        node.parent = null;
      }
    }
    
    this.openList = [];
    this.closedList = [];
    this.path = [];
  }
  
  async runGridAStar() {
    const startCell = this.grid[this.startPos[0]][this.startPos[1]];
    const endCell = this.grid[this.endPos[0]][this.endPos[1]];
    
    startCell.gScore = 0;
    startCell.fScore = this.heuristic(startCell, endCell);
    
    this.openList.push(startCell);
    
    while (this.openList.length > 0) {
      // Find node with lowest fScore
      const currentIndex = this.findLowestFScoreIndex(this.openList);
      const current = this.openList[currentIndex];
      
      // End condition
      if (current === endCell) {
        this.reconstructPath(current);
        return;
      }
      
      // Remove current from openList
      this.openList.splice(currentIndex, 1);
      this.closedList.push(current);
      current.isOpen = false;
      current.isClosed = true;
      
      // Get neighbors
      const neighbors = this.getGridNeighbors(current);
      
      for (const neighbor of neighbors) {
        if (neighbor.isWall || this.closedList.includes(neighbor)) {
          continue;
        }
        
        const tentativeGScore = current.gScore + 1;
        
        if (!this.openList.includes(neighbor)) {
          this.openList.push(neighbor);
          neighbor.isOpen = true;
        } else if (tentativeGScore >= neighbor.gScore) {
          continue;
        }
        
        neighbor.parent = current;
        neighbor.gScore = tentativeGScore;
        neighbor.fScore = neighbor.gScore + this.heuristic(neighbor, endCell);
      }
      
      // Visualization delay
      await this.delay(10);
    }
  }
  
  async runGraphAStar() {
    if (!this.startNode || !this.endNode) {
      alert('Bitte wählen Sie einen Start- und Endknoten aus.');
      this.isRunning = false;
      return;
    }
    
    this.startNode.gScore = 0;
    this.startNode.fScore = this.heuristicGraph(this.startNode, this.endNode);
    
    this.openList.push(this.startNode);
    
    while (this.openList.length > 0) {
      // Find node with lowest fScore
      const currentIndex = this.findLowestFScoreIndex(this.openList);
      const current = this.openList[currentIndex];
      
      // End condition
      if (current === this.endNode) {
        this.reconstructPath(current);
        this.drawGraph();
        return;
      }
      
      // Remove current from openList
      this.openList.splice(currentIndex, 1);
      this.closedList.push(current);
      
      // Get neighbors
      const neighbors = this.getGraphNeighbors(current);
      
      for (const [neighbor, weight] of neighbors) {
        if (this.closedList.includes(neighbor)) {
          continue;
        }
        
        const tentativeGScore = current.gScore + weight;
        
        if (!this.openList.includes(neighbor)) {
          this.openList.push(neighbor);
        } else if (tentativeGScore >= neighbor.gScore) {
          continue;
        }
        
        neighbor.parent = current;
        neighbor.gScore = tentativeGScore;
        neighbor.fScore = neighbor.gScore + this.heuristicGraph(neighbor, this.endNode);
      }
      
      // Visualization delay
      this.drawGraph();
      await this.delay(100);
    }
  }
  
  findLowestFScoreIndex(list: any[]): number {
    let lowestIndex = 0;
    for (let i = 1; i < list.length; i++) {
      if (list[i].fScore < list[lowestIndex].fScore) {
        lowestIndex = i;
      }
    }
    return lowestIndex;
  }
  
  getGridNeighbors(cell: any): any[] {
    const neighbors = [];
    const { x, y } = cell;
    const directions = [
      [0, 1], [1, 0], [0, -1], [-1, 0]  // Right, Down, Left, Up
    ];
    
    if (this.allowDiagonals) {
      directions.push(
        [1, 1], [1, -1], [-1, -1], [-1, 1]  // Diagonals
      );
    }
    
    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;
      
      if (newX >= 0 && newX < this.gridSize && newY >= 0 && newY < this.gridSize) {
        neighbors.push(this.grid[newX][newY]);
      }
    }
    
    return neighbors;
  }
  
  getGraphNeighbors(node: Node): [Node, number][] {
    const neighbors: [Node, number][] = [];
    
    for (const edge of this.edges) {
      if (edge.from === node) {
        neighbors.push([edge.to, edge.weight]);
      } else if (edge.to === node) {
        neighbors.push([edge.from, edge.weight]);
      }
    }
    
    return neighbors;
  }
  
  heuristic(a: any, b: any): number {
    // Manhattan distance
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }
  
  heuristicGraph(a: Node, b: Node): number {
    // Euclidean distance
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  }
  
  reconstructPath(current: any) {
    const path = [current];
    while (current.parent) {
      current = current.parent;
      path.unshift(current);
    }
    
    this.path = path;
    
    if (this.mode === 'grid') {
      // Mark path cells
      for (const cell of path) {
        if (!cell.isStart && !cell.isEnd) {
          cell.isPath = true;
        }
      }
    } else {
      this.drawGraph();
    }
  }
  
  resetVisualization() {
    this.isRunning = false;
    
    if (this.mode === 'grid') {
      this.initializeGrid();
    } else {
      this.resetPathfinding();
      this.drawGraph();
    }
  }
  
  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

interface Node {
  id: number;
  x: number;
  y: number;
  gScore: number;
  fScore: number;
  parent: Node | null;
}

interface Edge {
  from: Node;
  to: Node;
  weight: number;
}