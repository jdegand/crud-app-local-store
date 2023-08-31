import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoItemComponent } from './todo-item.component';
import { TodoItemStore } from 'src/app/todoItem.store';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

describe('TodoItemComponent', () => {
  let component: TodoItemComponent;
  let fixture: ComponentFixture<TodoItemComponent>;

  // missing provide for HttpClient -> only store is used ?

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TodoItemComponent, LoadingSpinnerComponent],
      providers: [TodoItemStore]
    });
    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;

    // mock the @Input() ?

    component.todo = {
      userId: 1,
      id: 1,
      title: 'Test todo 1',
      completed: false,
      body: 'Test todo 1'
    };

    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
