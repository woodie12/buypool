import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import axios from 'axios';
import './home.scss';
import { Button, Card, Modal, Header,Input, Icon, Menu } from 'semantic-ui-react'



class User extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {
                name: ''
            },
            log_in: false,
            logged_in: false,
            registered: false,
            register: false,
        }
        this.checklogin = this.checklogin.bind(this);
        this.showregister = this.showregister.bind(this);
        this.closeregister = this.closeregister.bind(this);
        // this.fetchUsers = this.fetchUsers.bind(this);
        this.showlog = this.showlog.bind(this);
        this.closelog = this.closelog.bind(this);
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
                <Menu secondary>
                    <Menu.Menu position='right'>
                        <Menu.Item name='home' color = 'red' as={Link} to="/" />
                        <Menu.Item name='User' color = 'green' as={Link} to="/account" />
                        <Menu.Item>
                            <Button inverted color='blue' content = "Login" onClick={this.checklogin}/>
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
                <center><h2>A website to seek co-buyers.</h2></center>
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
                        <form className="ui form" onSubmit = {this.onSubmit}>
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
                                <label>Email</label>
                                <Input type="text" name="email" placeholder="abc@mail.com" onChange={this.onChangeEmailSignUp}>
                                </Input>
                            </div>
                            <div className="field">
                                <label>Password</label>
                                <Input type="password" name="password" placeholder="password" onChange={this.onChangePasswordSignUp}>
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
