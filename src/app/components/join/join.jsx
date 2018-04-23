import React, { Component } from 'react'
import { Button, Card, Input,Icon,Modal, Divider, Dropdown, Form, Select, Item, Menu } from 'semantic-ui-react'
import { Link, withRouter } from 'react-router-dom';
import {Redirect, browserHistory} from 'react-router';
import axios from 'axios';
import "./join.scss"


class Join extends Component{
    constructor(props){
        super(props);
        this.state = {
            request:"",
            requestId:"",
            userId:"",
            total:"",
            current:"",
            amount:"",
            message:"",

        };
        this.getRequests = this.getRequests.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.close = this.close.bind(this);
        this.handleAmount = this.handleAmount.bind(this);

    }


    getRequests(){
        this.state.current = this.props.location.state.current;
        this.state.total = this.props.location.state.total;
        this.state.requestId = this.props.location.state.requestId;
        this.state.userId = this.props.location.state.userId;
        console.log(this.props.location.state);
    }

    clearInput(){
        this.setState({ userInput: "", movies: [] });
    };


    close(){
        this.setState({update: !this.state.update})
    }
    handleClick(){
        this.setState({update: true})
    }

    handleAmount(e){
        console.log('amount',e.target.value);
        this.setState({amount: e.target.value});        
    }

    handleUpdate(id){
   
        axios.put('/requests/api/join/'+id, {
                amount:this.state.amount,
                requestId:this.state.requestId,
                userId:this.state.userId
            })


            .then(function(res) {
                // console.log('res',res.data)
                // //find out the same index and than update
                // const idx = this.state.requests.findIndex(r_id=>r_id ==res.data.id)
                // const reqs = this.state.requests
                // reqs[idx] = {
                //     requestId: id,
                //     url: this.state.link,
                //     completed: 0,
                //     title: this.state.title,
                //     type: this.state.type,
                //     address: this.state.address,
                //     description: this.state.description,
                //     userId: "yzhan189"
                // }
                // console.log(reqs);

                if(res.data.status === 200){
                    console.log('in');
                    this.getRequests();
                    console.log(this.state.requests)
                    this.setState({
                        message: 'Successfully joined!',
                        //update: false,
                    })

                }
                console.log(res)
            }.bind(this))
    }


    componentWillMount(){
        this.getRequests();
    }

    render(){
        return(
        	 <div className = "update-form">
        	   
                <Card>
                 <Card.Content>
                                <Card.Header>
                                    <h2>Join A Pool</h2>
                                
                                </Card.Header>
                            </Card.Content>
                            <Card.Content>Current Money in Pool: {this.state.current}</Card.Content>
                            <Card.Content>Goal: {this.state.total}</Card.Content>
                            <Card.Content>User: {this.state.userId}</Card.Content>
                            <Divider/>
                            <Form className = "inner" onSubmit={()=>this.handleUpdate(this.state.requestId)}>
                            <Form.Field onChange = {this.handleAmount}>
                        <label>Money You Would Like to Put in the Pool</label>
                        <input placeholder="Pleasd Enter Your Amount" />
                        </Form.Field>

                        <Button>Join</Button>

                         <Button as={Link} to = 'request'>Cancel</Button>

                            </Form>
           <Card.Content>
                            {this.state.message}
                            </Card.Content>
                             </Card>
                </div>

        )
    }
}


export default Join;
