import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
import { TodoRepository } from '../../repository/todoRepository';
import { TodoAccess } from '../../infra/TodoAccess';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';

const logger = createLogger('updateTodo')
const repository = new TodoRepository(new TodoAccess());

const updateTodoHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  try {
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    await repository.updateTodoById(todoId, updatedTodo)
    logger.info('Updated TODO', { todoId });
    return {
      statusCode: 204,
      body: ''
    }
  }
  catch (e) {
    logger.error('Unable to update TODO', { e });
    return {
      statusCode: 500,
      body: e.message
    }
  }
};

export const handler = middy(updateTodoHandler)
  .use(
    cors({
      credentials: true
    })
  );