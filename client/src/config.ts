// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '52aye99609'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`

export const authConfig = {
  domain: 'chientd-udacity.us.auth0.com',            // Auth0 domain
  clientId: '5GugLAOfTDY8O0Z8VW09I8dysENNRlCo',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
