import { Component, Input, EventEmitter, Output  } from '@angular/core';

@Component({
  selector: 'app-template-graphs',
  templateUrl: './template-graphs.component.html',
  styleUrl: './template-graphs.component.css'
})
export class TemplateGraphsComponent {
  @Input() description: string = "";

  sidebarOpen = false;
  
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

}
