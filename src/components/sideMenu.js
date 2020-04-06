import React, { Component } from 'react';

import longLogo from '../images/Logo_Long.png';

class SideMenu extends Component {
    constructor(){
        super();
        this.state = {
            sessionU: false,
            username: '',
            avatar: '',
            testSetting: false,
        }
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

    deleteCookie(){
        var cookies = document.cookie.split(";");

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }

        window.location = 'http://localhost:3000/login';
      }

    componentDidMount(){
        const sessionUser = this.readCookie('sessionUser');
        const sessionAvatar = this.readCookie('sessionAvatar');
        const sessionSettings = this.readCookie('sessionSettings');

        if(sessionUser === '' || sessionUser === null || sessionUser === false){
            window.location = 'http://localhost:3000/login';
        }else{
            this.setState({
                sessionU: true,
                username: sessionUser,
                avatar: sessionAvatar,
                testSetting: sessionSettings,
                }, () => {

                    const regTrue = /^true$/gmi
                    
                    console.log('%c> Welcome aboard '+this.state.username, 'color: #bada55');

                    if(regTrue.test(this.state.testSetting) !== true && window.location.href !== 'http://localhost:3000/settings?sessionU='+this.state.username){
                        window.location = 'http://localhost:3000/settings?sessionU='+this.state.username;
                    }

            })
        }

        const url = window.location.href;
        const dashboard = document.getElementById('dashboard');
        const setting = document.getElementById('settings');
        const regUrl = /^.*?(settings).*?$/gmi;

        const test = regUrl.test(url);
        
        if(test === true){
            setting.classList.add('active');
        }else{
            dashboard.classList.add('active');
        }

        let cube = document.getElementById('hexa');

        let avatar = document.getElementById('avatar');

        let cubeW = cube.offsetWidth

        cube.style.height = cubeW * 2 +'px'
        
        avatar.style.backgroundImage = 'url('+sessionAvatar+')'

    }

  render() {
    return (
      
        <div className="sideMenuContainer">
            
            <div className="logoContainer"> 
                <img src={longLogo} alt='Logo Long'/>
            </div>

            <div className="userContainer">
                <div className="hexagon" id="hexa">
                    <div className="hexagon-in">
                        <div className="hexagon-avatar" id='avatar'>
                        </div>
                    </div>
                </div>
                <div className="linkContainer">
                    <a href={`http://localhost:3000/settings?sessionU=`+this.state.username}>{this.state.username}<br/>
                    <i>adjust your settings</i></a> 
                </div>               
            </div>

            <div className="menuContainer">
                <ul>
                    <li>
                        <a href='http://localhost:3000/content' id="dashboard">Dashboard</a>
                    </li>
                    <li>
                        <a href={`http://localhost:3000/settings?sessionU=`+this.state.username} id="settings">Settings</a>
                    </li>
                </ul>
            </div>

            <div className="logoutContainer">
                <button onClick={this.deleteCookie}>Disconnect</button>
            </div>
        </div>

    );
  }
}

export default SideMenu
