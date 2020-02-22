import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { TodoRepository } from '../../repository/todoRepository';
import { TodoAccess } from '../../infra/TodoAccess';
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('deleteTodo')
const repository = new TodoRepository(new TodoAccess());

const deleteHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  try {
    await repository.deleteTodo(todoId);
    logger.info('Deleted TODO', { todoId });
    return {
      statusCode: 204,
      body: ''
    }
  }
  catch (e) {
    logger.error('Unable to delete TODO', { e });
    return {
      statusCode: 500,
      body: e.message
    }
  }
};

export const handler =
  middy(deleteHandler)
    .use(
      cors({
        credentials: true
      })
    );
