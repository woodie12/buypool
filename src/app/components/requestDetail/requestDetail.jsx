import React, { Component } from 'react'
import {Button, Card, Divider, Input, Icon, Modal, Menu, Dropdown, Form, Progress, Item, Select} from 'semantic-ui-react'
import { Link, withRouter } from 'react-router-dom';
import {Redirect, browserHistory} from 'react-router';
import axios from 'axios';
import "./requestDetail.scss"

class RequestDetail extends Component{
  constructor(props){
    super(props);
    this.state = {
      request: {},
      recommendRequests: [],
    };

    this.getRequest = this.getRequest.bind(this);
    this.getRecommendRequest = this.getRecommendRequest.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleTitle = this.handleTitle.bind(this)
    this.handleURL = this.handleURL.bind(this)
    this.handleAddress = this.handleAddress.bind(this)
    this.handleType = this.handleType.bind(this)
    this.handleDescription = this.handleDescription.bind(this)
    this.close = this.close.bind(this);
  }


  getRequest(){
    //this.setState({request: this.props.location.state.request});
    console.log("enter get request"+this.props.location.state.request.requestId)
    axios.get('/requests/api/'+this.props.location.state.request.requestId)
      .then(function (response){
        console.log('response is',response);
        this.setState({request: response.data[0]});

      }.bind(this));
  }

  getRecommendRequest(){

    console.log("enter recommend request"+this.props.location.state.request.requestId)
    axios.get('/requests/api/similar/'+this.props.location.state.request.requestId)
      .then(function (response){
        console.log('recommend is',response);
        this.setState({recommendRequests: response.data});

      }.bind(this));
  }

  componentWillMount(){
    this.getRequest();
    this.getRecommendRequest();
  }




  close(){
    this.setState({update: !this.state.update})
  }
  handleClick(){
    this.setState({update: true})
  }

  handleTitle(e){
    console.log('title',e.target.value);
    if(e.target.value) {
      this.setState({title: e.target.value});
    }
  }
  handleURL(e){
    console.log('URL',e.target.value);
    if(e.target.value)
      this.setState({link: e.target.value});
  }
  handleAddress(e){
    console.log('address',e.target.value);
    if(e.target.value)
      this.setState({address: e.target.value});

  }
  handleType(e,data){
    console.log('type',data.value);
    if(data.value)
      this.setState({type: data.value});
  }
  handleDescription(e){
    console.log('description',e.target.value);
    if(e.target.value)
      this.setState({description: e.target.value});
  }


  handleUpdate(id){
    axios.put('/requests/api/'+id, {
      requestId: id,
      url: this.state.link,
      completed: 0,
      title: this.state.title,
      type: this.state.type,
      address: this.state.address,
      description: this.state.description,
      userId: "yzhan189"
    })



      .then(function(res) {
        if(res.data.status === 200){
          console.log('in');
          this.getRequests();
          console.log(this.state.requests)
          this.setState({
            message: 'Successfully update!',
            update: false,
          })

        }
        console.log(res)
      }.bind(this))
  }

  handleDelete(id){
    axios.delete('/requests/api/'+id)
      .then(function (response){
        console.log('response is',response);
        this.getRequests();

      }.bind(this));
  }


  render(){
    console.log(this.state);

    const options = [
      { key: 'Title', text: 'Title', value: 'title' },
      { key: 'address', text: 'Address', value: 'address' },
      { key: 'url', text: 'Url', value: 'url' }
    ]

    return(
      <div>
        <div>
          <h1>{this.state.request.title}</h1>
        </div>

        <Divider/>

        <Item.Group>

          <Item>
            <Item.Content>
              <Item.Header as='a'>Started by</Item.Header>
              <Item.Description>
                {this.state.request.username}
              </Item.Description>
            </Item.Content>
          </Item>

          <Item>
            <Item.Content>
              <Item.Header as='a'>Website</Item.Header>
              <Item.Description>
                {this.state.request.url}
              </Item.Description>
            </Item.Content>
          </Item>

          <Item>
            <Item.Content>
              <Item.Header as='a'>Shopping Category</Item.Header>
              <Item.Description>
                {this.state.request.type}
              </Item.Description>
            </Item.Content>
          </Item>

          <Item>
            <Item.Content>
              <Item.Header as='a'>Pick Up Address</Item.Header>
              <Item.Description>
                {this.state.request.address}
              </Item.Description>
            </Item.Content>
          </Item>

          <Item>
            <Item.Content>
              <Item.Header as='a'>Description</Item.Header>
              <Item.Description>
                {this.state.request.description}
              </Item.Description>
            </Item.Content>
          </Item>

          <Item>
            <Item.Content>
              <Item.Header as='a'>Pool Progress</Item.Header>
              <Progress value={this.state.request.current} total={this.props.location.state.request.total} progress='ratio' indicating/>
              <Item.Extra>{this.state.request.current} out of {this.props.location.state.request.total} has been collected.</Item.Extra>
            </Item.Content>
          </Item>
        </Item.Group>

        <Divider/>

        <div>
          <h2>Similar Request</h2>
        </div>

        <Divider/>

        <Divider/>

        <div>
        <Card.Group stackable doubling itemsPerRow={3}>
          {console.log('0000090909',this.state)}
          {this.state.recommendRequests.map((request)=>{
            return(
              <Link to = {{pathname : '/request/'+ request.requestId,state: {request: request}}}>
                <Card key = {request.requestId} >

                  <Card.Content>
                    <Card.Header>{request.title}</Card.Header>
                    <Card.Meta>{request.type}</Card.Meta>
                    <Card.Content>{request.url}</Card.Content>
                    <Card.Content>{request.address}</Card.Content>
                    <Card.Description>{request.description}</Card.Description>
                    <Card.Content extra>
                      <div className='button'>
                        {/*to delete page*/}
                        <Button basic color='grey' onClick = {()=>this.handleDelete(request.requestId)}>completed</Button>
                        <Button basic color='grey' onClick = {this.handleClick}>Update</Button>

                      </div>
                      {/*()=>this.handleUpdate(request.requestId)*/}
                      <Modal
                        open={this.state.update}
                        onClose={this.close}
                      >
                        <Modal.Header>Edit request</Modal.Header>
                        <Icon name="close" onClick={this.close} />
                        <Modal.Content>
                          <Form onSubmit={()=>this.handleUpdate(request.requestId)}>
                            <Form.Field onChange = {this.handleTitle}>
                              <label>title</label>
                              <input placeholder='title' />
                            </Form.Field>
                            <Form.Field onChange = {this.handleURL}>
                              <label>URL</label>
                              <input placeholder='URL of the website you want to do online shopping' />
                            </Form.Field>
                            <Form.Field onChange = {this.handleAddress}>
                              <label>address</label>
                              <input placeholder='address' />
                            </Form.Field>
                            <Form.Field control={Select} label='Type' options={options} placeholder='type' onChange = {this.handleType}/>


                            <Form.Field onChange = {this.handleDescription}>
                              <label>description</label>
                              <input placeholder='description' />
                            </Form.Field>
                            <Button type='submit'>Submit</Button>
                            <p>{this.state.message}</p >
                          </Form>
                        </Modal.Content>
                      </Modal>
                    </Card.Content>
                  </Card.Content>

                </Card>
              </Link>);
          })}
        </Card.Group>
        </div>

      </div>
    )
  }
}



export default RequestDetail

