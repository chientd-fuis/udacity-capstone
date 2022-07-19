# Information
My project base on project 4: serverless One simple app get and update information your employee

# Run local
- cd to /client folder
- npm i 
- npm run start 
- open http://localhost:3000/

# TEST

I using postman to test API endpoint (Test file Final Project.postman_collection.json)
{{apiId}}: ec60ws9xs1
# NOTES
Get list profile by User:

![image](https://github.com/chientd-fuis/udacity-capstone/blob/main/images/demo.png)

# AWS Cloud Formation

![image](https://github.com/chientd-fuis/udacity-capstone/blob/main/images/cloudformation.png)

# Auth0

![image](https://github.com/chientd-fuis/udacity-capstone/blob/main/images/auth0.png)

# Serverless App

![image](https://github.com/chientd-fuis/udacity-capstone/blob/main/images/serverlessapp.png)

# Service Map

![image](https://github.com/chientd-fuis/udacity-capstone/blob/main/images/map.png)

# Trace

![image](https://github.com/chientd-fuis/udacity-capstone/blob/main/images/Trace.png)

# API endpoint

- GET - https://ec60ws9xs1.execute-api.us-east-2.amazonaws.com/dev/todos
- POST - https://ec60ws9xs1.execute-api.us-east-2.amazonaws.com/dev/todos
- PATCH - https://ec60ws9xs1.execute-api.us-east-2.amazonaws.com/dev/todos/{todoId}
- DELETE - https://ec60ws9xs1.execute-api.us-east-2.amazonaws.com/dev/todos/{todoId}
- POST - https://ec60ws9xs1.execute-api.us-east-2.amazonaws.com/dev/todos/{todoId}/attachment

# functions:
  - Auth: capstone-dev-Auth
  - GetTodos: capstone-dev-GetTodos
  - CreateTodo: capstone-dev-CreateTodo
  - UpdateTodo: capstone-dev-UpdateTodo
  - DeleteTodo: capstone-dev-DeleteTodo
  - GenerateUploadUrl: capstone-dev-GenerateUploadUrl
