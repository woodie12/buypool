import React, { Component } from 'react'
import { Button, Card, Input,Icon, Modal , Divider, Dropdown, Form, Select, Item,Menu, Tab,Image,Rating,Progress } from 'semantic-ui-react'
import { Link, withRouter } from 'react-router-dom';
import {Redirect, browserHistory} from 'react-router';
import axios from 'axios';
import './account.scss'



class Account extends Component{
    constructor(props){
        super(props);
        this.state = {
            activeItem: 'home',
            current_user: null,
            pending_request: null,
            recommendation: null
        }
        // this.handleItemClick = this.handleItemClick.bind(this);
        this.requestPendingList = this.requestPendingList.bind(this);
        this.getCurrentUser = this.getCurrentUser.bind(this);
        this.handleComplete = this.handleComplete.bind(this);
        this.handleRate = this.handleRate.bind(this);
        this.linkToDetail = this.linkToDetail.bind(this);
        this.recommendation = this.recommendation.bind(this);
    //    ,cur_user: this.state.cur_user, state: this.state.logged_in
    }
    recommendation(){
        const RecommendationList = (props) => {
            console.log("((#####))",props)
            const RequestItems = props.recommend.map(request => {
                return (
                    <RecommendationItem
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
        const RecommendationItem = ({ request}) => {
            // const imageUrl = "http://image.tmdb.org/t/p/w150/"+ props.video.poster_path;
            // const start = new Date(apartment.dateStarted);
            // const end = new Date(apartment.dateEnd);

            return (


                <Card >
                    {/*<Link to={{ pathname: '/userrequest/'+request.requestId, state: { request: request, user: this.state.current_user } }}>*/}
                    {/*<Image fluid src='http://advantageproperties.com/wp-content/uploads/2015/01/1010WMA-2F-04-Kit-305-DSC_0136-small-Large.jpg' />*/}
                    {/*<Image fluid src='uploads/Cosmos02.jpg' />*/}
                    <Card.Content>
                        <Card.Header>
                            {/*<Link to={{ pathname: '/userrequest'+request.requestId, state: { request: request, user: this.state.current_user } }}>*/}
                            {request.title}
                            {/*</Link>*/}
                        </Card.Header>
                        <Card.Content><span className="location">{request.address}</span></Card.Content>
                        <Card.Content className="type">
                            type: {request.type}
                        </Card.Content>
                        <Card.Content>User: {request.username}</Card.Content>
                        <Card.Content>
                            <a>
                                $ need for minimum shipping:
                                <Icon name='dollar' />
                                {request.total}
                            </a>
                        </Card.Content>
                        <Card.Content>
                            <a>
                                $ current balance:
                                <Icon name='dollar' />
                                {request.current}
                            </a>
                        </Card.Content>

                        <Card.Content>
                            <Progress value={request.current} total={request.total}  progress='ratio' indicating />
                        </Card.Content>

                        {/*</Card.Content>*/}
                        <Card.Content description={request.description} />
                        {/*add username*/}
                    </Card.Content>
                    <Card.Content extra>

                        <div className='button'>
                            {/*to delete page*/}
                            <Button basic color='grey' as={Link}
                                    to={{
                                        pathname: '/join',
                                        state: { current:request.current,total:request.total,userId:request.userId,requestId:request.requestId }
                                    }}> Join
                            </Button>
                        </div>


                    </Card.Content>

                </Card>


            );
        };
        console.log(this.state.recommendation)
        const request = this.state.recommendation
        return (
            <div>
                <RecommendationList recommend={request} />
            </div>
        )
    }

    linkToDetail(id, request){
        console.log(this.state.current_user)
        this.props.history.push({pathname: '/userrequest/'+id, state: { request: request, user: this.state.current_user } })
    }

  handleRate(e, {rating, maxRating} ){
    console.log('enter handle rate', this.state.current_user);
    console.log("new rating "+rating);

    axios.put('/users/api/ratings/'+this.state.current_user.userId, {rating:rating} )
      .then(function(response,req) {
        console.log("-----------------",response);

        this.setState({
          current_user: response.data[0]
        });

        console.log(this.state)
      }.bind(this));

  }
    
    
    handleComplete(id,request){
        console.log("enter complete")
        console.log("****request is ",request)
        axios.put('/requests/api/'+id, {
            requestId: id,
            url: request.url,
            completed: 1,
            title: request.title,
            type: request.type,
            address: request.address,
            description: request.description,
            userId: request.userId
        })
            .then(function(res) {
                console.log("enter complete",this.state.pending_request)
                let request = this.state.pending_request
                for( let i = 0; i < request.length;i++){
                    if(request[i].requestId === id){
                        console.log('enter request hahahahahahah');
                        request.splice(i,1);
                        console.log("completed request", request[i])
                        this.setState({pending_request: request})
                    }
                }
                console.log(res)
            }.bind(this))

    }




    componentWillMount(){
        //get pending user
        console.log(this.props.location.state.user);
        this.setState({current_user: this.props.location.state.user})
        axios.get('/requests/api/search?completed=0')//search?userId=${current_user.userId},completed=0)
            .then(function (response,res){
                console.log('response is',response.data);
                const req = response.data;
                this.setState({pending_request: req});
                console.log(this.state.pending_request)


                console.log('requests/api/recommendation/'+ this.state.current_user.userId)
                axios.get('/requests/api/recommendation/'+ this.state.current_user.userId)//search?userId=${current_user.userId},completed=0)
                    .then(function (response,res){
                        console.log('我的天啊，response is',response.data,res);
                        const r = response.data;
                        this.setState({recommendation: r});
                        console.log(this.state.recommendation);

                    }.bind(this))
                    .catch(function(err){
                    console.log('我的娘啊',err)
                })

            }.bind(this));





    }

    getCurrentUser() {
        console.log('current_user',this.state.current_user);
        return (
            <div>
                <h2>User Info</h2>
                <Card fluid>
                <Card.Content header={this.state.current_user.username} />
                <Card.Content>
                    email: {this.state.current_user.email}
                </Card.Content>
                <Card.Content>
                phone: {this.state.current_user.phone}
                </Card.Content>
                <Card.Content>
                address: {this.state.current_user.address}
                </Card.Content>

                <Card.Content>
                    <span>
                        {this.state.current_user.rating}
                        <Rating icon='star' onRate={this.handleRate} rating={Math.round(Number(this.state.current_user.rating))} maxRating={5}/>
                        ({this.state.current_user.ratingWeight})
                    </span>
                </Card.Content>
                </Card>
            </div>
        )
    }

    requestPendingList() {
        const RequestList = (props) => {
            console.log("((#####))",this.props)
            const RequestItems = props.request.map(request => {
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


                <Card >
                    {/*<Link to={{ pathname: '/userrequest/'+request.requestId, state: { request: request, user: this.state.current_user } }}>*/}
                    {/*<Image fluid src='http://advantageproperties.com/wp-content/uploads/2015/01/1010WMA-2F-04-Kit-305-DSC_0136-small-Large.jpg' />*/}
                    {/*<Image fluid src='uploads/Cosmos02.jpg' />*/}
                    <Card.Content>
                        <Card.Header>
                            {/*<Link to={{ pathname: '/userrequest'+request.requestId, state: { request: request, user: this.state.current_user } }}>*/}
                                {request.title}
                            {/*</Link>*/}
                        </Card.Header>
                        <Card.Content><span className="location">{request.address}</span></Card.Content>
                        <Card.Content className="type">
                            type: {request.type}
                        </Card.Content>
                        <Card.Content>User: {request.username}</Card.Content>
                        <Card.Content>
                            <a>
                                $ need for minimum shipping:
                                <Icon name='dollar' />
                                {request.total}
                            </a>
                        </Card.Content>
                        <Card.Content>
                            <a>
                                $ current balance:
                                <Icon name='dollar' />
                                {request.current}
                            </a>
                        </Card.Content>

                        <Card.Content>
                        <Progress value={request.current} total={request.total}  progress='ratio' indicating />
                        </Card.Content>

                    {/*</Card.Content>*/}
                    <Card.Content description={request.description} />
                    {/*add username*/}
                    </Card.Content>
                    <Card.Content extra>

                        <div className='button'>
                            {/*to delete page*/}
                            <Button basic color='grey' onClick = {()=>this.handleComplete(request.requestId,request)}>completed</Button>
                            <Button basic color='grey' as={Link}
                                    to={{
                                        pathname: '/update',
                                        state: { request:request,requestId:request.requestId }
                                    }}> Update
                            </Button>
                            <Button basic color='grey' onClick = {()=>this.linkToDetail(request.requestId,request)}>Detail</Button>

                        </div>


                    </Card.Content>

                </Card>


            );
        };
        console.log(this.state.pending_request)
        const request = this.state.pending_request
        return (
            <div>
                <RequestList request={request} />
            </div>
        )
    }



    render(){

        const panes = [
            { menuItem: 'Personal info', render: ()=>
                    <Tab.Pane attached={false}>
                        <div className="content1">
                            {this.getCurrentUser()}
                        </div>
                    </Tab.Pane>

            },
            {
                menuItem: 'Pending invite', render: () => <Tab.Pane attached={false}>
                    <div className="content1">
                        {/*{*/}
                            {/*console.log("cur_user.local: ", this.state.cur_user.local.ownedApt)*/}
                        {/*}*/}
                        <div className="content1">
                            {this.getCurrentUser()}
                        </div>
                        <br/>
                        <hr/>
                        <h1>Pending List</h1>
                        <br/>
                        <div>
                        {this.requestPendingList()}
                        </div>
                        <hr/>
                        <h1>See more request you might be interested in and join</h1>
                        <div>
                            {this.recommendation()}
                        </div>
                    </div>
                </Tab.Pane>
            }
        ]
        return(
            <div className = "container">

                <div className="acc_content">

                    <Tab  panes={panes} />

                </div>
            </div>
        )
    }
}

export default Account;
