import React, { Component } from 'react'
import { Button, Card, Input,Icon, Modal , Divider, Dropdown, Form, Select, Item,Menu, Tab} from 'semantic-ui-react'
import { Link, withRouter } from 'react-router-dom';
import {Redirect, browserHistory} from 'react-router';
import axios from 'axios';
import './account.scss'

const RequestList = props => {
    const RequestItems = props.requests.map(request => {
        return (
            <RequestListItem
                key={request.requestId}
                request={request}
            />
        );

    });

    return (
        <Card.Group stackable doubling itemsPerRow={3}>
            {RequestItems}
        </Card.Group>
    );
};


//request
const RequestListItem = ({ request}) => {
    // const imageUrl = "http://image.tmdb.org/t/p/w150/"+ props.video.poster_path;
    // const start = new Date(apartment.dateStarted);
    // const end = new Date(apartment.dateEnd);

    return (

        <Card>
            <Image fluid src='http://advantageproperties.com/wp-content/uploads/2015/01/1010WMA-2F-04-Kit-305-DSC_0136-small-Large.jpg' />
            {/*<Image fluid src='uploads/Cosmos02.jpg' />*/}
            <Card.Content>
                <Card.Header>
                    <Link to={{ pathname: '/request'+request.requestId, state: { request: request } }}>
                        {request.title}
                    </Link>
                </Card.Header>
                <Card.Meta><span className="location">{request.address}</span></Card.Meta>
                <Card.Meta className="type">
                    type: <p>{request.type}</p>
                </Card.Meta>

            </Card.Content>
            <Card.Content description={request.description} />
            {/*add username*/}
            <Card.Content>User: {request.username}</Card.Content>
            <Card.Content extra>
                <a>
                    $ need for minimum shipping:
                    <Icon name='dollar' />
                    {request.total}
                </a>
                <a>
                    $ current balance:
                    <Icon name='dollar' />
                    {request.current}
                </a>


            </Card.Content>

        </Card>

    );
};

class Account extends Component{
    constructor(props){
        super(props);
        this.state = {
            activeItem: 'home'
        }
        this.handleItemClick = this.handleItemClick.bind(this);
    //    ,cur_user: this.state.cur_user, state: this.state.logged_in
    }
    handleItemClick = (e, { name }) => {
        this.setState({ activeItem: name })
        if(name === "Personal info"){
            console.log(this.props);
        }
    };


    render(){
        const { activeItem } = this.state;
        return(
            <div className = "container">
                <div>
                    <Menu attached='top' tabular>
                        <Menu.Item name='Personal info'  active={activeItem === 'Personal info'} onClick={this.handleItemClick}>Personal info</Menu.Item>
                        <Menu.Item name='Home'  active={activeItem === 'Home'} onClick={this.handleItemClick}>Home</Menu.Item>
                        <Menu.Item name='Pending Request'  active={activeItem === 'Pending Request'} onClick={this.handleItemClick}>Pending Request</Menu.Item>
                        <Menu.Item name='History'  active={activeItem === 'History'} onClick={this.handleItemClick}>Complete Request</Menu.Item>
                        <Menu.Item position='right'>
                            <Button basic color='grey'>Log out</Button>
                        </Menu.Item>
                    </Menu>
                </div>
            </div>
        )
    }
}

export default Account;
