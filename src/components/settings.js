import React, { Component } from 'react';
import axios from 'axios';


class SettingsComponents extends Component {
    constructor(){
        super();
        this.displayData = [];
        this.setSettings = [];
        this.state = {
            settings: this.readCookie('sessionSettings'),
            username: this.readCookie('sessionUser'),
            showData: this.displayData,
            set: this.setSettings,
            setTeam: '',
            currentTeam: '',
            TeamLogo: '',
            avatar: '',
        }

        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.writeCookie = this.writeCookie.bind(this);
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

    handleUpdate(){

        const user = this.state.username;

        const team = this.state.setTeam;

        axios.post('http://localhost:4200/DB/users/update/', {
            username: user,
            update: {
                Team: team,
                Settings: true,
            }
        })
        .then(function(response){

            console.log(response)

            this.setState({settings: true}, () => {

                this.writeCookie('sessionSettings', this.state.settings, 3);

                window.location.reload()
            })

        }.bind(this))
        .catch(error => console.log(error))

    }

    handleCheck(){

        const regTrue = /^true$/gmi

        if(regTrue.test(this.state.settings) !== true){
            console.log('%c> Settings are not configured on this account', 'color: #f2be42')

            axios.get('http://localhost:4200/DB/dataTeams')
            .then(function(response){

                const data = response.data;

                data.forEach(element => {

                    this.setSettings.push(
                        <div className='teamContainer' key={Math.random()}  onClick={event => this.setState({setTeam: element.Name}, () => {this.handleUpdate()})}>
                            
                            <div className="cover"></div>

                            <div className='teamLogo'>
                                <img src={element.Logo} alt={element.Name + ' Logo'}/>
                            </div>

                            <div className="teamCar">
                                <img src={element.Car} alt={element.Name + ' Car'}/>
                            </div>
                        </div>
                    );
                    this.setState({
                        set : this.setSettings,
                        postVal : ""
                    });

                });

                this.displayData.push(
                    <div key={Math.random()} className='componentContainer settingless'>
                        <div className="centerComponent">

                            <div className='settinglessTitle'>
                                <h3>Follow your team</h3>

                                <div className="setTeamContainer">
                                    {this.setSettings}
                                </div>
                            </div>

                        </div>
                    </div>
                );

                this.setState({
                    showdata : this.displayData,
                    postVal : ""
                 });
            }.bind(this))
            .catch(function(error){
                console.log(error)
            })     
            
        }else{
            console.log('%c> Settings are configured on this account', 'color: #778cfc')

            axios.post('http://localhost:4200/DB/name', {
                Username: this.state.username,
            })
            .then(response => {

                const data = response.data;

                this.setState({currentTeam: data.Team}, () => {

                    axios.post('http://localhost:4200/DB/f1/team/logo', {
                        Name: this.state.currentTeam,
                    })
                    .then(response => {
                        const teamData = response.data;

                        this.setState({TeamLogo: teamData.Logo}, () => {

                            this.setSettings.push(
                                <div className='lol' key={Math.random()}>
                                    
                                </div>
                            );
                            this.setState({
                                set : this.setSettings,
                                postVal : ""
                            });

                        })
                    })
                    .catch(error => console.log(error))

                })

            })
            .catch(error => console.log(error))

            this.displayData.push(
                <div key={Math.random()} className='componentContainer settingUp'>
                    <div className="centerComponent">

                        <div className='userInfoContainer'>
                            
                            <div className="avatarContainer">
                                <img src={this.state.avatar}></img>
                            </div>

                            <div className="changeAvatarContainer">
                                <select></select>
                                <button>Change Avatar</button>
                            </div>

                        </div>

                    </div>
                </div>
            );

            this.setState({
                showdata : this.displayData,
                postVal : ""
             });
        }
    }

    componentDidMount(){

        const sessionAvatar = this.readCookie('sessionAvatar');

        this.setState({avatar: sessionAvatar}, () =>{
            this.handleCheck();
        })        

    }

  render() {
    return (
        
        <div className="settings globalComponent">
            {this.displayData}
        </div>
        
    );
  }
}

export default SettingsComponents
