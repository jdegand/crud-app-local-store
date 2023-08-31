import { TestBed } from '@angular/core/testing';
import { of, skip, take, throwError } from 'rxjs';

import { TodoService } from './service/todo.service';
import { Todo } from './interfaces/Todo';
import { TodoItemStore } from './todoItem.store';
import { AppStore } from './app.store';

describe('TodoItemStore', () => {
  let todoItemStore: TodoItemStore;
  let appStore: AppStore;
  let todoServiceSpy: jasmine.SpyObj<TodoService>;

  beforeEach(() => {
    const todoServiceSpyObj = jasmine.createSpyObj('TodoService', [
      'getTodos',
      'updateTodo',
      'deleteTodo'
    ]);

    TestBed.configureTestingModule({
      providers: [
        AppStore,
        TodoItemStore,
        { provide: TodoService, useValue: todoServiceSpyObj }
      ],
    });

    appStore = TestBed.inject(AppStore);
    todoItemStore = TestBed.inject(TodoItemStore);
    todoServiceSpy = TestBed.inject(
      TodoService
    ) as jasmine.SpyObj<TodoService>;
  });

  it('should be created', () => {
    expect(todoItemStore).toBeTruthy();
  });

  it('ngOnInit', (done: DoneFn) => {
    todoItemStore.ngOnInit();
    todoItemStore.todo$.subscribe({
      next: (todo: Todo | undefined) => {
        expect(todo).toBe(undefined);
        done();
      }
    })
  })

  describe('todo$ selector', () => {
    it('should return todos from state', (done: DoneFn) => {
      // Given

      const todos: Todo[] = getFakeTodos();

      appStore.setState({ todos, callState: '' });

      const todo: Todo = getFakeTodo();
      todoItemStore.setState({ todo, callState: 'LOADED' });

      // Then
      todoItemStore.todo$.pipe().subscribe({
        next: (todo: Todo | undefined) => {
          expect(todo?.title).toBe('Test todo 1');
          done();
        },
      });
    });
  });

  describe('callState$ selector', () => {
    it('should return callState from state', (done: DoneFn) => {
      // Given

      const todo: Todo = getFakeTodo();
      todoItemStore.setState({ todo, callState: 'LOADED' });

      // Then
      todoItemStore.callState$.subscribe({
        next: (state: any) => {
          expect(state).toBe('LOADED');
          done();
        },
      });
    });
  });

  describe('deleteTodo() method', () => {
    it('should delete todo', (done: DoneFn) => {

      const todos: Todo[] = getFakeTodos();

      appStore.setState({ todos, callState: '' });

      // Given

      todoServiceSpy.getTodos.and.returnValue(of(todos));
      todoServiceSpy.deleteTodo.and.returnValue(of(undefined));

      // Then
      appStore.state$.pipe(skip(2), take(1)).subscribe({ // have to skip 2 -> initial state - 0, then fetchTodo - 2 
        next: (state: any) => {
          expect(state.todos.length).toBe(1);
          done();
        },
      });

      // When
      appStore.fetchTodo();
      todoItemStore.deleteTodo(2);
    });

  })

  /*
  describe('updateTodo() TodoItemStore only', () => {
    it('should update todo', (done: DoneFn) => {
      // Given
      const todo: Todo = getFakeTodo();

      const callState = 'Loaded';

      todoItemStore.setState({ todo: todo, callState: callState });

      // When
      todoItemStore.update(1);

      todoServiceSpy.updateTodo.and.returnValue(of({
        userId: 1,
        id: 1,
        title: 'Updated todo 1',
        completed: false,
        body: 'Test todo 1'
      }));

      // Then
      todoItemStore.todo$.pipe(skip(1)).subscribe({
        next: (state: any) => {
          expect(state.todo.title).toBe("Updated todo 1");
          done();
        },
      });
    });
  })
  */

  // This is not good -> have to isolate todoItemStore from appStore 
  describe('updateTodo() method', () => {
    it('should update todo', (done: DoneFn) => {

      // Given
      const todos: Todo[] = getFakeTodos();

      appStore.setState({ todos, callState: '' });

      todoServiceSpy.getTodos.and.returnValue(of(todos));
      todoServiceSpy.updateTodo.and.returnValue(of({
        userId: 1,
        id: 1,
        title: 'Updated todo 1',
        completed: false,
        body: 'Test todo 1'
      }));

      // Then
      appStore.state$.pipe(skip(2), take(1)).subscribe({ // change skip # cause of tap
        next: (state: any) => {
          expect(state.todos[0].title).toBe("Updated todo 1");
          done();
        },
      });

      // When
      appStore.fetchTodo();
      todoItemStore.update(1);
    });

  })

  describe('updateTodo() method error', () => {
    it('should have error', (done: DoneFn) => {

      // Given
      const error = 'An error occurred';
      const todos: Todo[] = getFakeTodos();

      appStore.setState({ todos, callState: '' });

      todoServiceSpy.getTodos.and.returnValue(of(todos));
      todoServiceSpy.updateTodo.and.returnValue(throwError(() => new Error(error)));

      // Then
      todoItemStore.state$.pipe(skip(1)).subscribe({
        next: (state: any) => {
          expect(state.callState).toBe("An error occurred");
          done();
        },
      });

      // When
      appStore.fetchTodo();
      todoItemStore.update(1);
    });

  })

})

export function getFakeTodo(): Todo {
  return {
    userId: 1,
    id: 1,
    title: 'Test todo 1',
    completed: false,
    body: 'Test todo 1'
  };
}

export function getFakeTodos(): Todo[] {
  return [
    {
      userId: 1,
      id: 1,
      title: 'Test todo 1',
      completed: false,
      body: 'Test todo 1'
    },
    {
      userId: 2,
      id: 2,
      title: 'Test todo 2',
      completed: true,
      body: 'Test todo 2'
    },
  ]
}
