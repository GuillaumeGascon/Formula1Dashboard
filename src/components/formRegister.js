import React, { Component } from 'react';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import {IoMdCheckmarkCircleOutline, IoMdWarning} from 'react-icons/io';

import RegService from '../services/RegServices';

import longLogo from '../images/Logo_Long.png';

class FormRegister extends Component {
    constructor(){
        super();
        this.state = {
            username: '',
            password: '',
            confirm: '',
            email: '',
            veriUser: '',
            _id: '',
            avatar: 'https://www.formula1.com/content/fom-website/en/drivers/lewis-hamilton/_jcr_content/image.img.1920.medium.jpg/1554818913486.jpg',
            team: '',
            sessionSettings: false,
            sessionU: false,
        }

        this.addServices = new RegService();
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

        const veriUser = /^[a-zA-Z0-9/-/@éèàùêëüöïôû]{3,16}$/gmi;
        const veriPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/gmi;// eslint-disable-next-line
        const veriMail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gmi;

        if(this.state.username === '' || this.state.password === '' || this.state.confirm === '' || this.state.email === ''){

            text.innerHTML = 'You must fill all the input !';
            textContainer.style.opacity = 1;

        }else if(veriUser.test(this.state.username) !== true){

            text.innerHTML = 'Username must be between 3 and 16 characters and can only contain numbers and letters';
            textContainer.style.opacity = 1;

        }else if(veriPass.test(this.state.password) !== true){

            text.innerHTML = 'Password must be a least 8 characters and contain 1 uppercase characters';
            textContainer.style.opacity = 1;

        }else if(this.state.confirm !== this.state.password){

            text.innerHTML = 'The two password entered are not the same';
            textContainer.style.opacity = 1;

        }else if(veriMail.test(this.state.email) !== true){

            text.innerHTML = 'The email entered are not a valid email adress';
            textContainer.style.opacity = 1;

        }else{
            textContainer.style.opacity = 0;

            axios.post('http://localhost:4200/DB/name', {
                Username: this.state.username,
            })
            .then(function(response){
                console.log(response.data);
                if(response.data !== null){
                    text.innerHTML = 'This username already exist, please choose another one';
                    textContainer.style.opacity = 1;
                }else{
                    axios.post('http://localhost:4200/DB/mail', {
                      Email: this.state.email,  
                    })
                    .then(function(response){
                        console.log(response.data);
                        if(response.data !== null){
                            text.innerHTML = 'An account with this email already exist';
                            textContainer.style.opacity = 1;
                        }else{
                            
                            const saltRounds = 10;

                            bcrypt.genSalt(saltRounds, function(err, salt){

                                bcrypt.hash(this.state.password, salt, function(err, hash){

                                    this.addServices.sendData({
                                        username: this.state.username,
                                        password: hash, 
                                        email: this.state.email,
                                        settings: this.state.sessionSettings,
                                        avatar: this.state.avatar,
                                        team: this.state.team,
                                    });

                                    console.log(`%c> Logged In, welcome [${this.state.username}]`, 'color: #bada55')

                                    this.writeCookie('sessionUser', this.state.username, 3);
                                    this.writeCookie('sessionAvatar', this.state.avatar, 3);
                                    this.writeCookie('sessionSettings', this.state.settings, 3);

                                    window.location = 'http://localhost:3000/settings?sessionU='+this.state.username;

                                }.bind(this))

                            }.bind(this))

                        }
                    }.bind(this))
                    .catch(function(error){
                        console.log(error)
                    })
                }
            }.bind(this))
            .catch(function(error){
                console.log(error)
            })
        }

    }

    componentDidMount(){

        const sessionUser = this.readCookie('sessionUser');

        if(sessionUser === '' || sessionUser === null || sessionUser === false){
            
            this.setState({sessionU: false})

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
                <label>Username&nbsp;<IoMdCheckmarkCircleOutline id='checkUser' style={{display: 'none', color: 'green'}}/></label>
                <input 
                    type="text" 
                    name="username" 
                    placeholder="Username"
                    id='username'
                    value={this.state.username}
                    onChange={event => this.setState({username: event.target.value}, () => {
                       
                        const veriUser = /^[a-zA-Z0-9/-/@éèàùêëüöïôû]{3,16}$/gmi;
                        
                        if(veriUser.test(this.state.username) === true){
                            document.getElementById('username').style.border = '1px solid green';
                            document.getElementById('checkUser').style.display = 'block';
                        }else if(veriUser.test(this.state.username) === false){
                            document.getElementById('username').style.border = '1px solid red';
                            document.getElementById('checkUser').style.display = 'none';
                        }
                    })}
                    />
                <label>Password&nbsp;<IoMdCheckmarkCircleOutline id='checkPass' style={{display: 'none', color: 'green'}}/></label>
                <input 
                    type='password' 
                    name="password" 
                    placeholder="Password"
                    id='password'
                    value={this.state.password}
                    onChange={event => this.setState({password: event.target.value}, () => {
                        
                        const veriPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/gmi;

                        if(veriPass.test(this.state.password) === true){
                            document.getElementById('password').style.border = '1px solid green';
                            document.getElementById('checkPass').style.display = 'block';
                        }else if(veriPass.test(this.state.password) === false){
                            document.getElementById('password').style.border = '1px solid red';
                            document.getElementById('checkPass').style.display = 'none';
                        }
                    })}
                    />
                <label>Confirm password&nbsp;<IoMdCheckmarkCircleOutline id='checkConfirm' style={{display: 'none', color: 'green'}}/></label>
                <input 
                    type='password' 
                    name="confirm" 
                    placeholder="Confirm password"
                    id='confirm'
                    value={this.state.confirm}
                    onChange={event => this.setState({confirm: event.target.value}, () => {
                        
                        const veriPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/gmi;
                        
                        if(veriPass.test(this.state.confirm) === true && this.state.password === this.state.confirm){
                            document.getElementById('confirm').style.border = '1px solid green';
                            document.getElementById('checkConfirm').style.display = 'block';
                        }else if(veriPass.test(this.state.confirm) === false){
                            document.getElementById('confirm').style.border = '1px solid red';
                            document.getElementById('checkConfirm').style.display = 'none';
                        }
                    })}
                    />
                <label>Email&nbsp;<IoMdCheckmarkCircleOutline id='checkMail' style={{display: 'none', color: 'green'}}/></label>
                <input 
                    type='email' 
                    name="email" 
                    placeholder="Email"
                    id='email'
                    value={this.state.email}
                    onChange={event => this.setState({email: event.target.value}, () => {
                        // eslint-disable-next-line
                        const veriMail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gmi;

                        if(veriMail.test(this.state.email) === true){
                            document.getElementById('email').style.border = '1px solid green';
                            document.getElementById('checkMail').style.display = 'block';
                        }else if(veriMail.test(this.state.email) === false){
                            document.getElementById('email').style.border = '1px solid red';
                            document.getElementById('checkMail').style.display = 'none';
                        }
                    })}
                    />
                <button onClick={this.handleSubmit} disabled={
                    !this.state.email ||
                    !this.state.password ||
                    !this.state.username || 
                    !this.state.confirm 
                }>Register</button>
            </form>

            <div className="cent" id="redirect_content">
                <div id="content">
                    <div className="cent redirect">
                        <a href="http://localhost:3000/login">Already register ?</a>
                    </div>
                </div>
            </div>

        </div>
    );
  }
}

export default FormRegister