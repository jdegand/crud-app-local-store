import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { TodoItemStore } from 'src/app/todoItem.store';
import { provideComponentStore } from '@ngrx/component-store';
import { Todo } from 'src/app/interfaces/Todo';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  providers: [provideComponentStore(TodoItemStore)],
  templateUrl: './todo-item.component.html'
  // might not need changeDetection: ChangeDetectionStrategy.OnPush, as @Input() will cause the component to be updated 
})

export class TodoItemComponent {
  @Input() set todo(todo:Todo) { 
    this.todoItemStore.patchState({todo: todo, callState: 'LOADED' }); 
  }

  private todoItemStore = inject(TodoItemStore);

  vm$ = this.todoItemStore.vm$;

  update(todoId: any) {
    this.todoItemStore.update(todoId);
  }

  delete(todoId: any) {
    this.todoItemStore.deleteTodo(todoId);
  }
}
