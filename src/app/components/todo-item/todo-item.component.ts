import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
})

// conditionally render loading spinner

export class TodoItemComponent {
  @Input() todo: any;

  update(id: number) {
 
  }

  delete(id: number) {
    
  }
}
