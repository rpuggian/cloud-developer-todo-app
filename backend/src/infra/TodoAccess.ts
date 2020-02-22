import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ITodoRepoAdapter } from '../repository/todoRepository';
import { TodoItem } from "../models/TodoItem";
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
const XAWS = AWSXRay.captureAWS(AWS)

export class TodoAccess implements ITodoRepoAdapter {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todoTable = process.env.TODO_TABLE,
        private readonly userIdIndex = process.env.INDEX_NAME
    ) { }

    async post(item: TodoItem) {
        const params = {
            TableName: this.todoTable,
            Item: item
        };

        await this.docClient.put(params).promise();
    }

    async delete(key: string) {
        const params = {
            TableName: this.todoTable,
            Key: { todoId: key }
        };

        await this.docClient.delete(params).promise();
    }

    async getById(todoId: string): Promise<TodoItem> {
        const params = { TableName: this.todoTable, Key: { todoId } };
        const results = await this.docClient.get(params).promise();
        return results.Item as TodoItem;
    }

    async patch(todoId: string, todoItem: TodoItem) {
        const params = {
            TableName: this.todoTable,
            Key: { todoId },
            UpdateExpression: 'set attachmentUrl = :u, dueDate = :due, done = :done, updatedAt = :updatedAt',
            ExpressionAttributeValues: {
              ':u': todoItem.attachmentUrl,
              ':due': todoItem.dueDate,
              ':done': todoItem.done,
              ':updatedAt': todoItem.updatedAt
            }
          };
          await this.docClient.update(params).promise();
    }

    async getTodosByUserId(userId: string): Promise<TodoItem[]> {
        return this.getTodosByUserIdWithQuery(userId);
    }

    async getTodosByUserIdWithQuery(userId: string): Promise<TodoItem[]> {
        const params = {
            TableName: this.todoTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: 'userId = :u',
            ExpressionAttributeValues: { 
                ':u': userId 
            }
          };
      
          const result = await this.docClient.query(params).promise();
          return result.Items as TodoItem[]
    }

    async getTodosByUserIdWithScan(userId: string): Promise<TodoItem[]> {
        const params = {
            TableName: this.todoTable,
            IndexName: this.userIdIndex,
            FilterExpression: 'userId=:u',
            ExpressionAttributeValues: { ':u': userId }
          };
      
          const result = await this.docClient.scan(params).promise();
          return result.Items as TodoItem[]
    }
}
