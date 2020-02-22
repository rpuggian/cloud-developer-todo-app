import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { v4 as uuid } from 'uuid';
import { recoverS3AttachmentURL } from "../utils/s3";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";

// POST, PUT, DELETE, GET, GET_ALL

export interface ITodoRepoAdapter {
    post(item: TodoItem)
    delete(key: string)
    getById(todoId: string): Promise<TodoItem>
    patch(todoId: string, todoItem: TodoItem)
    getTodosByUserId(userId: string): Promise<TodoItem[]> 
}

export class TodoRepository {

    constructor(
        private readonly store: ITodoRepoAdapter
    ) { }

    async createTodo(request: CreateTodoRequest, userId: string): Promise<TodoItem> {
        const createdAt = new Date().toISOString();
        const newItem: TodoItem = {
            todoId: uuid(),
            userId,
            createdAt,
            name: request.name,
            dueDate: request.dueDate,
            done: false
        }

        await this.store.post(newItem);
        return newItem
    }

    async deleteTodo(key: string) {
        await this.store.delete(key)
    }

    async getTodoById(todoId: string): Promise<TodoItem> {
        return await this.store.getById(todoId)
    }

    async updateTodoById(todoId: string, request: UpdateTodoRequest) : Promise<TodoItem> {
        let currentTodo = await this.getTodoById(todoId)
        let attUrl = recoverS3AttachmentURL(todoId)
        let updatedAt = new Date().toISOString();
        const newTodo = { ...currentTodo, ...request, attachmentUrl: attUrl, updatedAt };
        await this.store.patch(todoId, newTodo);
        return newTodo;
    }

    async getTodosByUserId(userId: string): Promise<TodoItem[]> {
        return this.store.getTodosByUserId(userId)
    }
}