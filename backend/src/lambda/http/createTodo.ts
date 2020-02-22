import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger'
import { getUserIdFromJwt } from '../../auth/utils';
import { TodoRepository } from '../../repository/todoRepository';
import { TodoAccess } from '../../infra/TodoAccess';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';

const logger = createLogger('createTodo')
const repository = new TodoRepository(new TodoAccess());

const createHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const request = JSON.parse(event.body) as CreateTodoRequest
    const userId = getUserIdFromJwt(event);
    var newItem = await repository.createTodo(request, userId)
    logger.info("New todo item created", {item: newItem })
    return {
      statusCode: 201,
      body: JSON.stringify({ item: newItem })
    }
  }
  catch (e) {
    logger.error('Unable to create TODO', { e });
    return {
      statusCode: 500,
      body: e.message
    }
  }
};

export const handler =
  middy(createHandler)
    .use(
      cors({
        credentials: true
      })
    );