import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ComponentStore, OnStateInit, tapResponse } from '@ngrx/component-store';
import { Observable, exhaustMap, pipe, switchMap } from 'rxjs';

import { Todo } from './interfaces/Todo';
import { TodoService } from './service/todo.service';

export interface AppState {
    todos: Todo[];
    callState: string
}

// maybe better to add {providedIn: root} to Injectable 
// is it really necessary to create another store just for a presentational component?
// pass update / delete methods to TodoItemComponent?
@Injectable()
export class AppStore extends ComponentStore<AppState> implements OnStateInit {

    // making todo$ and callState$ -> private -> makes testing more difficult ?
    readonly todos$: Observable<Todo[]> = this.select((state) => state.todos);
    readonly callState$: Observable<string> = this.select((state) => state.callState);

    constructor(private todoService: TodoService) {
        super({ todos: [], callState: "Loading" });
        // this.fetchTodo(); -> remove onStateInit -> can call fetchTodo in constructor -> would have to change tests 
    }

    ngrxOnStateInit() {
        this.fetchTodo();
    }

    readonly vm$ = this.select(
        {
            todos: this.todos$,
            callState: this.callState$

        },
        { debounce: true }
    );

    // this is outdated ngrx syntax - don't need to use a trigger$ anymore
    readonly fetchTodo = this.effect<void>((trigger$) =>
        trigger$.pipe(
            exhaustMap(() =>
                this.todoService.getTodos().pipe(
                    tapResponse(
                        (todos: any) => this.patchState({ todos, callState: "LOADED" }),
                        (error: HttpErrorResponse) =>
                            this.patchState({ callState: error.message })
                    )
                )
            )
        )
    );

    readonly update = this.effect<number>(
        pipe(
            //tap(() => this.patchState({ callState: "Loading" })),
            switchMap((id) => this.todoService.updateTodo(id).pipe(
                tapResponse(
                    (todo: any) => this.updateTodo(todo),
                    (error: Error) =>
                        this.patchState({ callState: error.message })
                )
            )
            )
        )
    );

    readonly deleteTodo = this.effect<number>(
        pipe(
            //tap(() => this.patchState({ callState: "Loading" })),
            switchMap((id) => this.todoService.deleteTodo(id).pipe(
                tapResponse(
                    () => this.deleteTodoState(id),
                    (error: Error) =>
                        this.patchState({ callState: error.message })
                )
            )
            )
        )
    );

    readonly updateTodo = this.updater((state, todo: Todo) => ({
        ...state,
        todos: state.todos.map((t) => (t.id === todo.id ? { ...todo } : t)),
    }));

    readonly deleteTodoState = this.updater((state, todoId: number) => ({
        ...state,
        todos: state.todos.filter((todo) => todo.id !== todoId),
    }));

}
