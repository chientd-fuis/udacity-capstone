import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getTodosByUserId } from '../../helpers/todos'
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger'

const logger = createLogger('GenerateUploadUrl')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Start HTTP gets by user")
    const userId = getUserId(event)
    const item = await getTodosByUserId(userId);
    return {
      statusCode: 200,
      body: JSON.stringify({
        items: item
      })
    }
  }
)

handler
.use(httpErrorHandler())
.use(
  cors({
    credentials: true
  })
)
