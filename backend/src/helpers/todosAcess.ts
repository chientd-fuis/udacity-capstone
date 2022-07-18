import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

export class TodosAccess {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todoTable = process.env.TODOS_TABLE) {
  }

  async createTodo(item: TodoItem): Promise<TodoItem> {
    logger.info('Start CREATE todo by: ', item.userId);
    await this.docClient.put({
      TableName: this.todoTable,
      Item: item
    }).promise()
    logger.info('End CREATE todo by: ', item.userId);
    return item
  }

  async updateTodo(item: TodoUpdate, todoId: string, userId: string): Promise<void> {
    logger.info('Start UPDATE todo by: ', userId);
    await this.docClient.update({
      TableName: this.todoTable,
      Key: {
        todoId: todoId,
        userId: userId
      },
      UpdateExpression: 'set name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeValues: {
        ':name': item.name,
        ':dueDate': item.dueDate,
        ':done': item.done
      }
    }).promise()
    logger.info('End UPDATE todo by: ', userId);
  }

  async deleteTodo(todoId: string, userId: string): Promise<void> {
    logger.info('Start DELETE todo by: ', userId);
    await this.docClient.delete({
      TableName: this.todoTable,
      Key: {
        userId: userId,
        todoId: todoId
      }
    }).promise()
    logger.info('End DELETE todo by: ', userId);
  }

  async getTodoByUserId(userId: string): Promise<TodoItem[]> {
    logger.info('Start GET todo by: ', userId);
    const res = await this.docClient.query({
      TableName: this.todoTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise();
    logger.info('End GET todo by: ', userId);
    return res.Items as TodoItem[];
  }

  async getTodoByTodoId(todoId: string, userId: string): Promise<TodoItem> {
    const res = await this.docClient.get({
      TableName: this.todoTable,
      Key: {
        todoId: todoId,
        userId: userId
      }
    }).promise();

    return res.Item as TodoItem;
  }
}

