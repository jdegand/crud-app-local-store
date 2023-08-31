import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
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
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
  // might not need changeDetection: ChangeDetectionStrategy.OnPush, as @Input() will cause the component to be updated 
})

export class TodoItemComponent {
  @Input() set todo(todo:Todo) { 
    this.todoItemStore.setState({todo: todo, callState: 'LOADED' });  // patchState doesn't work 
  }

  // can't use patchState - when there is no initial state -> Thomas' solution uses patchState
  // His setInitState function -> calls setState and adds a callState property as well
  // Wouldn't recommend using his library -> always better to have a dependency free solution

  private todoItemStore = inject(TodoItemStore);

  vm$ = this.todoItemStore.vm$;

  update(todoId: any) {
    this.todoItemStore.update(todoId);
  }

  delete(todoId: any) {
    this.todoItemStore.deleteTodo(todoId);
  }
}
