import { CommonModule, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppStore } from './app.store';
import { provideComponentStore } from '@ngrx/component-store';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';

// can render vm without ngrxLet 
// is ngrxLet really necessary?  
// Todos are not gonna be zero / have to delete 200 todos to get to zero

@Component({
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, NgIf, TodoItemComponent],
  providers: [provideComponentStore(AppStore)],
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="vm$ | async as vm">
    <div *ngIf="vm.callState.toLowerCase() === 'loading'" >
        <app-loading-spinner></app-loading-spinner>
      </div>
      <app-todo-item *ngFor="let todo of vm.todos" [todo]="todo"></app-todo-item>
    </ng-container>
  `,
  styles: [],
})

export class AppComponent {

  private appStore = inject(AppStore);

  vm$ = this.appStore.vm$;

}


/*
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { AppStore } from './app.store';
import { TodoService } from './service/todo.service';

@Component({
  standalone: true,
  imports: [CommonModule, TodoItemComponent],
  providers: [AppStore],
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngFor="let todo of todos$ | async">
      <app-todo-item [todo]="todo"></app-todo-item>
    </div>
  `,
  styles: [],
})

export class AppComponent implements OnInit {

  todos$ = this.appStore.todos$;

  constructor(private readonly appStore: AppStore, private readonly todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService.getTodos().subscribe({
      next: (todos: any) => {
        this.appStore.loadTodos(todos);
      },
    });
  }
}
*/
