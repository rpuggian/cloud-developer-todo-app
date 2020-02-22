import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { recoverS3PreSignedUrl } from '../../utils/s3';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';

const generateUploadUrlHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const uploadUrl = recoverS3PreSignedUrl(todoId)
  return {
    statusCode: 200,
    body: JSON.stringify({ uploadUrl })
  }
};

export const handler =
  middy(generateUploadUrlHandler)
    .use(
      cors({
        credentials: true
      })
    );