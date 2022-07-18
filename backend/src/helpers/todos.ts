import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'
import * as createError from 'http-errors'
import { TodoUpdate } from '../models/TodoUpdate';

// TODO: Implement businessLogic

const todoAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()
const bucketName = process.env.ATTACHMENT_S3_BUCKET

export async function getTodosByUserId(userId: string): Promise<TodoItem[]> {
  return await todoAccess.getTodoByUserId(userId);
}

export async function createTodo(createRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {
  const todoId = uuid.v4();
  const item = {
    userId: userId,
    todoId: todoId,
    done: false,
    createdAt: new Date().toISOString(),
    attachmentUrl: `https://${bucketName}.s3.us-east-2.amazonaws.com/${todoId}`,
    ...createRequest
  } as TodoItem

  return await todoAccess.createTodo(item);
}

export async function updateTodo(updateRequest: UpdateTodoRequest, todoId: string, userId: string): Promise<void> {
  const existTodo = await todoAccess.getTodoByTodoId(todoId, userId);
  if (!existTodo) {
    throw createError(404, 'Todo does not exist')
  }

  await todoAccess.updateTodo(updateRequest as TodoUpdate, todoId, userId);
}

export async function deleteTodo(todoId: string, userId: string): Promise<void> {
  const existTodo = await todoAccess.getTodoByTodoId(todoId, userId);
  if (!existTodo) {
    throw createError(404, 'Todo does not exist')
  }

  await todoAccess.deleteTodo(todoId, userId);
}

export async function getImageUrl(todoId: string, userId: string): Promise<string> {
  const existTodo = await todoAccess.getTodoByTodoId(todoId, userId);
  if (!existTodo) {
    throw createError(404, 'Todo does not exist')
  }
  return attachmentUtils.getUploadUrl(todoId);
}