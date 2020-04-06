import axios from 'axios';

class RegService{
    sendData(data){
        console.log(data);
        axios.post('http://localhost:4200/DB/add', {
            Username: data.username,
            Password: data.password,
            Email: data.email,
            Settings: data.settings,
            Avatar: data.avatar,
            Team: data.team,
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        })
    }
}

export default RegService;