import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TodoService } from './todo.service';
import { Todo } from '../interfaces/Todo';

describe('TodoService', () => {
  let service: TodoService;
  let testingController: HttpTestingController;

  const mockTodos: Todo[] = [
    {
      userId: 1,
      id: 1,
      title: "Todo 1",
      completed: false,
      body: "Todo 1",
    }, {
      userId: 2,
      id: 2,
      title: "Todo 2",
      completed: true,
      body: "Todo 2",
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(TodoService);
    testingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getTodos()', () => {
    service.getTodos().subscribe((data: any) => {
      expect(data).toBeTruthy();
      expect(data.length).toBe(2);
      const secondTodo = mockTodos.find((todo: any) => todo.userId === 2);
      expect(secondTodo?.title).toBe("Todo 2");
    })

    const mockReq = testingController.expectOne("https://jsonplaceholder.typicode.com/todos");
    expect(mockReq.request.method).toEqual("GET");
    mockReq.flush(mockTodos);
  })

  // need to mock randText method ?
  it('updateTodo()', () => {

    const mockFalso = jasmine.createSpyObj(['randText']);

    mockFalso.randText.and.returnValue('Not so fast');

    service.updateTodo(2).subscribe((data: any) => {
      expect(data).toBeTruthy();
      expect(data.id).toBe(2);
      expect(data.title).toBe('Not so fast');
    })

    const mockReq = testingController.expectOne("https://jsonplaceholder.typicode.com/todos/2");
    expect(mockReq.request.method).toEqual("PUT");
  })

  it('deleteEvent()', () => {
    service.deleteTodo(2).subscribe((data: any) => { })

    const mockReq = testingController.expectOne("https://jsonplaceholder.typicode.com/todos/2");
    expect(mockReq.request.method).toEqual("DELETE");

    mockReq.flush(mockTodos[0]);
  })

  afterEach(() => {
    testingController.verify();
  })

});
