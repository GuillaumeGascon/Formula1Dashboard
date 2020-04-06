import React, { Component } from 'react';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import {IoMdWarning} from 'react-icons/io';

import longLogo from '../images/Logo_Long.png';

class FormLogin extends Component {
    constructor(){
        super();
        this.state = {
            username: '',
            password: '',
            veriUser: '',
            veriPass: '',
            _id: '',
            sessionU: false,
            settings: '',
            avatar: '',
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.writeCookie = this.writeCookie.bind(this);
    }

    writeCookie(name,value,days) {
        var date, expires;
        if (days) {
            date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            expires = "; expires=" + date.toGMTString();
                }else{
            expires = "";
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    readCookie(name) {
        var i, c, ca, nameEQ = name + "=";
        ca = document.cookie.split(';');
        for(i=0;i < ca.length;i++) {
            c = ca[i];
            while (c.charAt(0)===' ') {
                c = c.substring(1,c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length,c.length);
            }
        }
        return '';
    }

    handleSubmit(e){
        e.preventDefault();

        const text = document.getElementById('innerText');
        const textContainer = document.getElementById('errorHandler');

        axios.post('http://localhost:4200/DB/name', {
            Username: this.state.username,
        })
        .then(function(response){
            const data = response.data;

            if(data === null){

                text.innerHTML = "This username doesn't exist on our website";
                textContainer.style.opacity = 1;

            }else{
                this.setState({
                    veriUser: data.Username,
                    veriPass: data.Password,
                    _id: data._id,
                    avatar: data.Avatar,
                    settings: data.Settings,
                }, () =>{
                    bcrypt.compare(this.state.password, this.state.veriPass, function(err, res){

                        if(res !== true){
                            text.innerHTML = "Please check your password and your username";
                            textContainer.style.opacity = 1;
                        }else{
                            console.log(`> Logged In, welcome [${this.state.username}]`)

                            this.writeCookie('sessionId', this.state._id, 3);
                            this.writeCookie('sessionUser', this.state.username, 3);
                            this.writeCookie('sessionAvatar', this.state.avatar, 3);
                            this.writeCookie('sessionSettings', this.state.settings, 3);

                            if(this.state.settings === false){
                                window.location = 'http://localhost:3000/settings?sessionU='+this.state.username;
                            }else{
                                window.location = 'http://localhost:3000/content'
                            }
                        }

                    }.bind(this))
                })
            }
        }.bind(this))
        .catch(function(error){
            console.log(error)
        })

    }

    componentDidMount(){
        const sessionUser = this.readCookie('sessionUser');

        if(sessionUser === '' || sessionUser === null || sessionUser === false){
            
            this.setState({sessionU: false})

            console.log('false')

        }else{

            this.setState({sessionU: true}, () =>{
                window.location = 'http://localhost:3000/content';
            })

        }
        
    }

  render() {
    return (
        <div id="form">

            <div id="errorHandler">
                <div className="errorIcon">
                    <IoMdWarning/>                    
                </div>

                <div className="errorText">
                    <p id="innerText">Ceci est un message d'erreur de test afin de styliser le container</p>
                </div>
            </div>

            <div id="logo_container">
                <img src={longLogo} alt='Logo Long'/>
            </div>

            <span></span>

            <form>
                <label>Username</label>
                <input 
                    type="text" 
                    name="username" 
                    placeholder="Username"
                    value={this.state.username}
                    onChange={event => this.setState({username: event.target.value})}/>
                <label>Password</label>
                <input 
                    type='password' 
                    name="password" 
                    placeholder="password"
                    value={this.state.password}
                    onChange={event => this.setState({password: event.target.value})}
                    />
                <button onClick={this.handleSubmit}>Login</button>
            </form>

            <div className="cent" id="redirect_content">
                <div id="content">
                    <div className="equal redirect">
                        <a href="http://localhost:3000/register">Not register ?</a>
                    </div>
                    <div className="equal redirect">
                        <a href="http://localhost:3000/">Can't login ?</a>
                    </div>
                </div>
            </div>

        </div>
    );
  }
}

export default FormLogin