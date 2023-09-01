import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoItemComponent } from './todo-item.component';
import { TodoItemStore } from 'src/app/todoItem.store';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { TodoService } from 'src/app/service/todo.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AppStore } from 'src/app/app.store';
import { of } from 'rxjs';

describe('TodoItemComponent', () => {
  let component: TodoItemComponent;
  let fixture: ComponentFixture<TodoItemComponent>;
  let todoItemStore: TodoItemStore;
  let todoServiceSpy: jasmine.SpyObj<TodoService>;

  // only TodoItemStore is used but providers array needed a ton of things to get 'should create' test to pass

  beforeEach(() => {

    const todoServiceSpyObj = jasmine.createSpyObj('TodoService', [
      'getTodos',
      'updateTodo',
      'deleteTodo'
    ]);

    TestBed.configureTestingModule({
      imports: [TodoItemComponent, LoadingSpinnerComponent],
      providers: [TodoItemStore, AppStore, { provide: TodoService, useValue: todoServiceSpyObj }, HttpClient, HttpHandler]
    });
    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;

    todoServiceSpy = TestBed.inject(
      TodoService
    ) as jasmine.SpyObj<TodoService>;

    // mock the @Input() ?

    component.todo = {
      userId: 1,
      id: 1,
      title: 'Test todo 1',
      completed: false,
      body: 'Test todo 1'
    };

    todoItemStore = TestBed.inject(TodoItemStore);
    // call todoItemStore.setState here?
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('click calls update event', () => {

    component.vm$ = of({
      todo: {
        userId: 1,
        id: 1,
        title: 'Test todo 1',
        completed: false,
        body: 'Test todo 1'
      }, callState: 'LOADED'
    });

    fixture.detectChanges();

    let button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    fixture.detectChanges();

    expect(todoServiceSpy.updateTodo).toHaveBeenCalledTimes(1);
  })

  it('click calls delete event', () => {

    component.vm$ = of({
      todo: {
        userId: 1,
        id: 1,
        title: 'Test todo 1',
        completed: false,
        body: 'Test todo 1'
      }, callState: 'LOADED'
    });

    fixture.detectChanges();

    let button = fixture.debugElement.nativeElement.querySelectorAll('button')[1];
    button.click();

    fixture.detectChanges();

    expect(todoServiceSpy.deleteTodo).toHaveBeenCalledTimes(1);
  })

});
