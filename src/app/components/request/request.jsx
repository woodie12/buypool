import React, { Component } from 'react'
import { Button, Card, Input,Icon,Modal, Menu, Dropdown, Form, Select, Image } from 'semantic-ui-react'
import { Link, withRouter } from 'react-router-dom';
import {Redirect, browserHistory} from 'react-router';
import axios from 'axios';
import "./request.scss"

class Request extends Component{
    constructor(props){
        super(props);
        this.state = {
            requests:[],
            update: false,
            title:"",
            link: "",
            address:"",
            type:"",
            description:"",
            contact:"",
            message:""

        };
        this.getRequests = this.getRequests.bind(this);
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


    getRequests(){
        console.log("enter get request")
        axios.get('/requests/api')
            .then(function (response){
                console.log('response is',response);
                const req = response.data;
                this.setState({requests: req});
                console.log(this.state.requests)

            }.bind(this));
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
            }
        )
            .then((res) => {
                console.log('res',res.data)
                //find out the same index and than update
                const idx = this.state.requests.findIndex(r_id=>r_id ==res.data.id)
                const reqs = this.state.requests
                reqs[idx] = {
                    requestId: id,
                    url: this.state.link,
                    completed: 0,
                    title: this.state.title,
                    type: this.state.type,
                    address: this.state.address,
                    description: this.state.description,
                    userId: "yzhan189"
                }
                console.log(reqs);
                if(res.data.status === 200){
                    console.log('in');
                    this.getRequests();
                    this.setState({
                        message: 'Successfully update!',
                        update: false,

                    })


                }
                console.log(res)
            }).bind(this)
    }

    handleDelete(id){
        axios.delete('/requests/api/'+id)
            .then(function (response){
                console.log('response is',response);
                this.getRequests();

            }.bind(this));
    }

    componentWillMount(){
        this.getRequests();
    }






    render(){
        const options = [
            { key: 'f', text: 'food', value: 'food' },
            { key: 'c', text: 'clothes', value: 'clothes' },
            { key: 'c0', text: 'cosmetic', value: 'cosmetic' },
            { key: 'o', text: 'other', value: 'other' }
        ];
        return(
            <div>
                <h1>list of requests</h1>

                <Card.Group stackable doubling itemsPerRow={3}>
                    {this.state.requests.map((request)=>{
                        return(
                            <Card key = {request.requestId}>

                                <Card.Content>
                                    <Card.Header>{request.title}</Card.Header>
                                    <Card.Meta>{request.type}</Card.Meta>
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
                                                    <p>{this.state.message}</p>
                                                </Form>
                                            </Modal.Content>
                                        </Modal>
                                    </Card.Content>
                                </Card.Content>
                            </Card>                    );
                    })}
                </Card.Group>
            </div>
        )
    }
}

export default Request

