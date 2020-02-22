import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserIdFromJwt } from '../../auth/utils'
import { createLogger } from '../../utils/logger'
import { TodoRepository } from '../../repository/todoRepository';
import { TodoAccess } from '../../infra/TodoAccess';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';

const logger = createLogger('getTodos')
const repository = new TodoRepository(new TodoAccess());

const getAllTodosHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = getUserIdFromJwt(event);
    const result = await repository.getTodosByUserId(userId)
    return {
      statusCode: 200,
      body: JSON.stringify({ items: result })
    }
  }
  catch (e) {
    logger.error('Unable to scan TODO', { e });
    return {
      statusCode: 500,
      body: e.message
    }
  }
};

export const handler = middy(getAllTodosHandler)
  .use(
    cors({
      credentials: true
    })
  );