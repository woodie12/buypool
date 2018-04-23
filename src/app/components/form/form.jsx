import React, { Component } from 'react'
import { Button, Card, Input,Icon,Checkbox, Menu, Dropdown, Form, Select, Divider} from 'semantic-ui-react'
import { Link, withRouter } from 'react-router-dom';
import {Redirect, browserHistory} from 'react-router';
import axios from 'axios';
import "./form.scss"

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}



class Forms extends Component{
    constructor(props){
        super(props);
        this.state = {
            title:"",
            link: "",
            address:"",
            type:"",
            description:"",
            contact:"",
            message:"",
            total:"",
            current:"",
            userId: "",
            userName: ""
        }
        this.handleTitle = this.handleTitle.bind(this)
        this.handleURL = this.handleURL.bind(this)
        this.handleAddress = this.handleAddress.bind(this)
        this.handleType = this.handleType.bind(this)
        this.handleDescription = this.handleDescription.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

        this.handleTotalMoney = this.handleTotalMoney.bind(this)
        this.handleCurrMoney = this.handleCurrMoney.bind(this)
    }
    handleTitle(e){
        console.log('title',e.target.value);
        this.setState({title: e.target.value});
    }
    handleURL(e){

        console.log('url',e.target.value);
        this.setState({link: e.target.value});
    }
    handleAddress(e){
        console.log('address',e.target.value);
        this.setState({address: e.target.value});

    }
    handleType(e,data){
        console.log('type',data.value);
        this.setState({type: data.value});
    }
    handleDescription(e){
        console.log('description',e.target.value);
        this.setState({description: e.target.value});
    }


    handleTotalMoney(e){
        console.log('total',e.target.value);
        this.setState({total: e.target.value});        
    }

    handleCurrMoney(e){
        console.log('current',e.target.value);
        this.setState({current: e.target.value});        
    }

    handleSubmit(e){

        const id = makeid();
        console.log(id);
        console.log(this.state);
        axios.post('/requests/api', {
            requestId: id,
            url: this.state.link,
            completed: 0,
            title: this.state.title,
            type: this.state.type,
            address: this.state.address,
            description: this.state.description,
            userId: "yzhan189",
            total: this.state.total,
            current: this.state.current
        }).then(function (req) {
            console.log('req',req)
            if(req.data.status === 200){
                console.log('in');
                this.setState({
                    message: 'Successfully update!'

                })    
            }
        }.bind(this))


    }





    render(){
        const options = [
            { key: 'f', text: 'food', value: 'food' },
            { key: 'c', text: 'clothes', value: 'clothes' },
            { key: 'c0', text: 'cosmetic', value: 'cosmetic' },
            { key: 'o', text: 'other', value: 'other' }
        ];

        return(
            <div className = "submit-form">
                <Card >
                    <Form className = "inner" onSubmit={this.handleSubmit}>
                            {/*TODO: add a join query for the request form, join the request and user*/}
                            <Card.Content>
                                <Card.Header>
                                    <h2> Request Form</h2>
                                    <Divider/>
                                </Card.Header>
                            </Card.Content>
                            <Card.Content>
                                Please fill in this form to submit a request.
                            </Card.Content>

                            <Divider/>

                            <Form.Field onChange = {this.handleTitle}>

                                <label>Title</label>
                                <input placeholder='title' />
                            </Form.Field>
                            <Form.Field onChange = {this.handleURL}>
                                <label>URL</label>
                                <input placeholder='URL of the website' />
                            </Form.Field>
                            <Form.Field onChange = {this.handleAddress}>
                                <label>Address</label>
                                <input placeholder='address' />
                            </Form.Field>
                            <Form.Field control={Select} label='Type' options={options} placeholder='type' onChange = {this.handleType}/>


                            <Form.Field onChange = {this.handleDescription}>
                                <label>Description</label>
                                <input placeholder='description' />
                            </Form.Field>
                            
                            <Form.Field onChange = {this.handleTotalMoney}>
                                <label>Money Goal</label>
                                <input placeholder='minimun goal for this pool' />
                            </Form.Field>

                            <Form.Field onChange = {this.handleCurrMoney}>
                                <label>Current Money</label>
                                <input placeholder='your contribution to the pool' />
                            </Form.Field>

                            <Button type='submit'>Submit</Button>
                            <Link to="/" >
                            <Button type='submit'>Cancel</Button>
                            </Link>
                            <Card.Content>
                            {this.state.message}
                            </Card.Content>

                    </Form>
                </Card>
            </div>
        )
    }
}


export default Forms
