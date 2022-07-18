import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../helpers/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    
    if (!userId) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          error: 'UserID does not exist'
        })
      }
    }
    if (!newTodo) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Todo is invalid'
        })
      }
    }
    const todo = await createTodo(newTodo, userId);
    return {
      statusCode: 201,
      body: JSON.stringify({
        item: todo
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
