import React, { Component } from 'react'
import { Button, Card, Input,Icon,Modal, Divider, Dropdown, Form, Select, Item, Menu } from 'semantic-ui-react'
import { Link, withRouter } from 'react-router-dom';
import {Redirect, browserHistory} from 'react-router';
import axios from 'axios';
import "./update.scss"


class Update extends Component{
    constructor(props){
        super(props);
        this.state = {
            request:"",
            requestId:"",
            update: false,
            title:"",
            link: "",
            address:"",
            type:"",
            description:"",
            contact:"",
            message:"",
            userInput:"",
            total:"",
            current:"",

        };
        this.getRequests = this.getRequests.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleTitle = this.handleTitle.bind(this);
        this.handleURL = this.handleURL.bind(this);
        this.handleAddress = this.handleAddress.bind(this);
        this.handleType = this.handleType.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
        this.close = this.close.bind(this);
        this.handleTotalMoney = this.handleTotalMoney.bind(this);

    }


    getRequests(){
        this.state.request = this.props.location.state.request
        this.state.requestId = this.props.location.state.requestId
        //console.log(this.props.location.state.requestId);
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
    handleTotalMoney(e){
        console.log('total',e.target.value);
        this.setState({total: e.target.value});        
    }

    handleCurrMoney(e){
        console.log('current',e.target.value);
        this.setState({total: e.target.value});        
    }

    handleUpdate(id){
        axios.put('/requests/api/'+id, {
                url: this.state.link,
                completed: 0,
                title: this.state.title,
                type: this.state.type,
                address: this.state.address,
                description: this.state.description,
                total:this.state.total,
                current:this.state.current,
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
        	 <div className = "update-form">
        	  <Card>
        		 <Card.Content>
                                <Card.Header>
                                    <h2> Update Form</h2>
                                    <Divider/>
                                </Card.Header>
                            </Card.Content>
                            <Card.Content>
                                Please edit this form to update a request.
                            </Card.Content>

                            <Divider/>

				<Form className = "inner" onSubmit={()=>this.handleUpdate(this.state.requestId)}>
                                                
                <Form.Field onChange = {this.handleTitle}>
                <label>Title</label>
                <input placeholder={this.state.request.title} />
                </Form.Field>
                <Form.Field onChange = {this.handleURL}>
                <label>URL</label>
                <input placeholder={this.state.request.url}/>
				</Form.Field>
				<Form.Field onChange = {this.handleAddress}>
				<label>address</label>
				<input placeholder={this.state.request.address}/>
                </Form.Field>
                <Form.Field control={Select} label='Type' options={options} placeholder='type' onChange = {this.handleType}/>
                <Form.Field onChange = {this.handleDescription}>
                <label>description</label>
                <input placeholder={this.state.request.description} />
                </Form.Field>
                 <Form.Field onChange = {this.handleTotalMoney}>
                 <label>Money Goal</label>
                 <input placeholder={this.state.request.total} />
                 </Form.Field>

                
                <Button onClick = {this.handleUpdate}>Update</Button>
           
                <Button as={Link} to = 'request'>Back</Button>
          
              
  		   <Card.Content>
                            {this.state.message}
                            </Card.Content>

                    </Form>
                </Card>

                </div>

        )
    }
}


export default Update;
