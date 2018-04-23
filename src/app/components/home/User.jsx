import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import axios from 'axios';
import './home.scss';
import { Button, Card, Modal, Header,Input, Icon } from 'semantic-ui-react'



class User extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            log_in: false,
            logged_in: false,
            registered: false,
            register: false,
            message: "",
            login_user: {
                email: '',
                password: ''
            },
            register_user: {
                name: '',
                email: '',
                password: '',
                address: '',
                phone: ''
            }
        },
        this.checklogin = this.checklogin.bind(this);
        this.showregister = this.showregister.bind(this);
        this.closeregister = this.closeregister.bind(this);
        this.onSignupSubmit = this.onSignupSubmit.bind(this);
        this.onChangeEmailSignUp = this.onChangeEmailSignUp.bind(this);
        this.onChangeNameSignUp = this.onChangeNameSignUp.bind(this);
        this.onChangeAddressSignUp = this.onChangeAddressSignUp.bind(this);
        this.onChangePhoneSignUp = this.onChangePhoneSignUp.bind(this);

        this.onChangePasswordSignUp = this.onChangePasswordSignUp.bind(this);
        // this.fetchUsers = this.fetchUsers.bind(this);
        this.showlog = this.showlog.bind(this);
        this.closelog = this.closelog.bind(this);
        this.onHandleSubmit = this.onHandleSubmit.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
    }
    onChangeEmailSignUp(e){
        console.log("target is ",e);
        const user = this.state.register_user;
        console.log(e.target);
        user.email = e.target.value;
        this.setState({
            register_user: user
        })
    }
    onChangeAddressSignUp(e){
        console.log("target is ",e);
        const user = this.state.register_user;
        console.log(e.target);
        user.address = e.target.value;
        this.setState({
            register_user: user
        })
    }
    onChangePhoneSignUp(e){
        console.log("target is ",e);
        const user = this.state.register_user;
        console.log(e.target);
        user.phone = e.target.value;
        this.setState({
            register_user: user
        })
    }

    onChangeNameSignUp(e){
        console.log("target is ",e);
        const user = this.state.register_user;
        console.log(e.target);
        user.name = e.target.value;
        this.setState({
            register_user: user
        })
    }

    onChangePasswordSignUp(e) {
        const user = this.state.register_user;
        user.password = e.target.value;
        this.setState({
            register_user: user
        })
    }

    onChangeEmail(e) {
        console.log(e);
        const user = this.state.login_user;
        user.email = e.target.value;
        this.setState({
            login_user:user
        });
    }

    onChangePassword(e) {
        const user = this.state.login_user;
        user.password = e.target.value;
        this.setState({
            login_user:user
        })
    }

    onHandleSubmit(e){
        e.preventDefault()
        console.log("enter onsubmit");
        console.log(this.state.login_user)
        let user = this.state.login_user;
        axios.post('users/api/login', user)
            .then(
                function(res,req){
                    console.log(res.data.user);
                    this.setState({message:res.data.message,
                                   user: res.data.user});
                    console.log(this.state)
                    //goes to another route
                    console.log('req is ',req);
                    this.props.history.push({
                        pathname: '/account/'+ this.state.user.userId,
                        state: {user: this.state.user}
                    })

                }.bind(this)
            )
            .catch(function(err){
                if (err.response) {
                    if(err.response.status !== 200){
                        this.setState({message:"unable to login"})
                    }

                }
            }.bind(this))

    }

    onSignupSubmit(e){
        e.preventDefault()
        console.log(this.state.register_user)
        let user = this.state.register_user;
        axios.post('users/api/signup', user)
            .then(
                function(res){
                    console.log(res);
                    this.setState({message:res.data.message,
                        user: res.data.user});
                    console.log(this.state)
                    this.props.history.push({
                        pathname: '/account/'+ this.state.user.id,
                        state: {user: this.state.user}
                    })
                    //goes to another route
                    // this.props.history.push('/account/'+ this.state.user.userId)

                }.bind(this)
            ) .catch(function(err){
                if (err.response) {
                    if(err.response.status !== 200){
                        this.setState({message:"account already exist"})
                    }

                }
            }.bind(this))

    }


    checklogin(e){
        if(this.state.logged_in){
            console.log("looged in here");
        }else{
            console.log("show log modal");
            e.preventDefault();
            this.setState({ log_in: true, register: false });

        }
    }
    showlog(e) {
        console.log("show log modal")
        e.preventDefault()

        this.setState({ log_in: true, register: false, message: "" })
    }

    closelog(e) {
        console.log("close log modal")
        e.preventDefault()
        this.setState({ log_in: false })
    }


    showregister(e) {
        console.log("show register modal")
        e.preventDefault()
        this.setState({ register: true, log_in: false, message: "" })
    }

    closeregister(e) {
        console.log("close register modal")
        e.preventDefault()
        this.setState({ register: false })
    }

    // componentWillMount() {
    //     // this.fetchUsers();
    // }

    render() {
        return (
            <div className="user">
                <div className='header'>
                    <div className='my_title'>
                        <center><p>Buypool</p></center>
                    </div>
                    <div className='my_login'>
                        <Button basic inverted color = 'black' content = "Login" onClick={this.checklogin}/>
                    </div>
                </div>
                <div className='goal'>
                    <center><p>A website to seek co-buyers.</p></center>
                </div>
                <img src={require('../../asset/shopping.jpg')} alt=""/>

                <div className='middle-left'>
                    <div className='middle-left-1'>
                        <Link to="/request" >
                            <Button id = 'top' basic inverted color='black' size = 'huge' content = 'Browse request' />
                        </Link>
                    </div>
                    <p> </p>
                    <div className='middle-left-2'>
                        <Link to="/form" >
                            <Button id = 'bottom' basic inverted color='black' size = 'huge' content = 'send request'/>
                        </Link>
                    </div>
                </div>
                <Modal
                    open={this.state.log_in}
                    onClose={this.closelog}
                >
                    <Modal.Header>Log In</Modal.Header>
                    <Icon name="close" onClick={this.closelog} />
                    <Modal.Content>
                        <form className="ui form" onSubmit = {this.onHandleSubmit}>
                            <div className="field">
                                <label>Email</label>
                                <Input type="text" name="email" placeholder="email" onChange={this.onChangeEmail}>
                                </Input>
                            </div>
                            <div className="field">
                                <label>Password</label>
                                <Input type="password" name="password" placeholder="password" onChange={this.onChangePassword}>
                                </Input>
                            </div>
                            <p>{this.state.message}</p>
                            <div>
                                <button className="ui button" type="submit" >Submit</button>
                            </div>
                        </form>

                        <div className="reg">
                            <div> You don't have an account?</div>
                            <div><Button onClick={this.showregister}>register</Button></div>
                        </div>
                    </Modal.Content>
                </Modal>

                <Modal open={this.state.register} onClose={this.closeregister}
                >
                    <Modal.Header>Register</Modal.Header>
                    <Icon name="close" onClick={this.closeregister} />
                    <Modal.Content>
                        <form className="ui form" onSubmit={this.onSignupSubmit}>
                            {/*<div className="field">*/}
                            {/*<label>Username</label>*/}
                            {/*<Input type="text" name="username" placeholder="username" onChange={this.onChangeNameSignUp}>*/}
                            {/*</Input>*/}
                            {/*</div>*/}
                            <div className="field">
                                <label>Username</label>
                                <Input type="text" name="name" placeholder="username" onChange={this.onChangeNameSignUp}>
                                </Input>
                            </div>
                            <div className="field">
                                <label>Email</label>
                                <Input type="text" name="email" placeholder="abc@mail.com" onChange={this.onChangeEmailSignUp}>
                                </Input>
                            </div>

                            <div className="field">
                                <label>Password</label>
                                <Input type="password" name="password" placeholder="password" onChange={this.onChangePasswordSignUp}>
                                </Input>
                            </div>

                            <div className="field">
                                <label>Phone</label>
                                <Input type="text" name="phone" placeholder="Phone" onChange={this.onChangePhoneSignUp}>
                                </Input>
                            </div>

                            <div className="field">
                                <label>Address</label>
                                <Input type="text" name="address" placeholder="Address" onChange={this.onChangeAddressSignUp}>
                                </Input>
                            </div>


                            <div>
                                <button className="ui button" type="submit">Submit</button>
                            </div>
                        </form>
                        <p>{this.state.message}</p>
                        <div className="reg">
                            <div> Already have an account? </div>
                            <div><Button onClick={this.showlog}>log in</Button></div>
                        </div >
                    </Modal.Content>
                </Modal>


            </div>
        );
    }
}

export default User;
