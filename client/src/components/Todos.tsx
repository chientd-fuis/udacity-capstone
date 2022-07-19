import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Card,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Checkbox,
  Message
} from 'semantic-ui-react'

import { createTodo, deleteTodo, getTodos, patchTodo } from '../api/todos-api'
import Auth from '../auth/Auth'
import { Todo } from '../types/Todo'

interface TodosProps {
  auth: Auth
  history: History
}

interface TodosState {
  todos: Todo[]
  newTodoName: string
  description: string
  loadingTodos: boolean
  isHasImage: boolean
  isSuccess:boolean
  isError: boolean
}

export class Todos extends React.PureComponent<TodosProps, TodosState> {
  state: TodosState = {
    todos: [],
    newTodoName: '',
    description: '',
    loadingTodos: true,
    isHasImage: false,
    isSuccess: false,
    isError: false,
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTodoName: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ description: event.target.value })
  }


  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/todos/${todoId}/edit`)
  }

  onTodoCreate = async () => {
    try {
      const dueDate = this.calculateDueDate()
      const newTodo = await createTodo(this.props.auth.getIdToken(), {
        name: this.state.newTodoName,
        description: this.state.description,
        dueDate
      })
      this.setState({
        todos: [...this.state.todos, newTodo],
        newTodoName: '',
        description: '',
        isSuccess: true
      })
    } catch {
      this.setState({
        isError: true,
        isSuccess: false
      })
    }
    this.closeMessage()
  }

  onTodoDelete = async (todoId: string) => {
    try {
      await deleteTodo(this.props.auth.getIdToken(), todoId)
      this.setState({
        todos: this.state.todos.filter(todo => todo.todoId !== todoId),
        isSuccess: true,
      })
    } catch {
      this.setState({
        isError: true,
        isSuccess: false
      })
    }
    this.closeMessage()
  }

  onTodoCheck = async (pos: number) => {
    try {
      const todo = this.state.todos[pos]
      await patchTodo(this.props.auth.getIdToken(), todo.todoId, {
        name: todo.name,
        dueDate: todo.dueDate,
        done: !todo.done
      })
      this.setState({
        todos: update(this.state.todos, {
          [pos]: { done: { $set: !todo.done } }
        })
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  closeMessage() {
    setTimeout(() => {
      this.setState({
        isError: false,
        isSuccess: false
      })
    }, 5000);
  }

  async componentDidMount() {
    try {
      const todos = await getTodos(this.props.auth.getIdToken())
      this.setState({
        todos,
        loadingTodos: false
      })
    } catch (e: any) {
      this.setState({
        isError: true,
        isSuccess: false
      })
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">LIST</Header>

        {this.renderCreateTodoInput()}
        {this.state.isSuccess && (<Message positive>
          <Message.Header>Successfully!!!</Message.Header>
          <p>
            Your process is <b>success</b> 
          </p>
        </Message>)}
        {this.state.isError && (<Message negative>
          <Message.Header>Failed!!!</Message.Header>
          <p>
            Your process is <b>failed</b> 
          </p>
        </Message>)}
        {this.renderTodos()}
      </div>
    )
  }

  renderCreateTodoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            style={{ marginLeft: 16}}
            label={{ icon: 'asterisk' }}
            labelPosition='left corner'
            placeholder='Name'
            onChange={this.handleNameChange}
            value={this.state.newTodoName}
          />
          <Input
            style={{ marginLeft: 8, marginRight: 8}}
            label={{ icon: 'asterisk' }}
            labelPosition='left corner'
            placeholder='Description'
            onChange={this.handleDescriptionChange}
            value={this.state.description}
          />
          <Button onClick={this.onTodoCreate} color='teal'><Icon name='add' />Add</Button>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderTodos() {
    if (this.state.loadingTodos) {
      return this.renderLoading()
    }

    return this.renderTodosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading TODOs
        </Loader>
      </Grid.Row>
    )
  }

  renderTodosList() {
    return (
      <Grid padded>
        <Card.Group>
        {this.state.todos.map((todo, pos) => {
          return (
            <Card key={todo.todoId}>
              <Card.Content>
                {todo.attachmentUrl && (
                <Image src={todo.attachmentUrl} floated='right' size='tiny' />
              )}
                <Card.Header>{todo.name}</Card.Header>
                <Card.Meta>{todo.dueDate}</Card.Meta>
                <Card.Description>
                <strong>{todo.description}</strong>
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Checkbox
                  onChange={() => this.onTodoCheck(pos)}
                  checked={todo.done}
                  label={{ children: 'Make profile visible' }}
                  style={{ marginBottom: '8px' }}
                />
                <div className='ui two buttons'>
                  <Button basic color='green' onClick={() => this.onEditButtonClick(todo.todoId)}>
                  <Icon name="pencil" /> Upload
                  </Button>
                  <Button basic color='red' onClick={() => this.onTodoDelete(todo.todoId)}>
                  <Icon name="delete" /> Delete
                  </Button>
                </div>
              </Card.Content>
            </Card>
          )
        })}
        </Card.Group>
      </Grid>
    )
  }

   checkImage(url?:string): boolean {
     if (!url) {
       return false;
     }
     const a = false;
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.send();
    request.onload = function() {
      const status = request.status;
      if (request.status == 200) //if(statusText == OK)
      {
        return true
      } else {
        return false
      }
    }
    return false;
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
