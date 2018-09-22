import React, { Component } from 'react';
import userImg from '../assets/userImg.png';
import FeedbackGetAll from '../components/FeebackGetAll/FeedbackGetAll';
import FeedbackGetOne from '../components/FeedbackGetOne/FeedbackGetOne';
import AnswersGetAll from '../components/AnswersGetAll/AnswersGetAll';
import AnswersGetOne from '../components/AnswersGetOne/AnswersGetOne';
import UpdateAdmin from '../components/Auth/UpdateAdmin';
import AuthService from '../services/Auth';
import './Dashboard.css';
import {
    HashRouter,
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    Redirect
} from "react-router-dom";

class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            showUsrMng: false,
            getCookie: (cname) => {
                    let name = cname + '=';
                    let decodedCookie = decodeURIComponent(document.cookie);
                    let ca = decodedCookie.split(';');
                    for(let i = 0; i < ca.length; i++) {
                        let c = ca[i];
                        while (c.charAt(0) === ' ') {
                            c = c.substring(1);
                        }
                        if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
                    }
                    return '';
                }
        }
    }

    componentDidMount() {
        let userImage = document.getElementById('User-Photo');
        if(this.state.getCookie('username') === '') return window.location.href = '/#/login';
        AuthService.getUserPhoto(this.state.getCookie('_id'), this.state.getCookie('photo'))
        .then((blob) => {
            let objectURL = URL.createObjectURL(blob); 
            userImage.src = objectURL;          
        })
        .catch((err) => console.error(err))
    }

    UserManagement() {
        this.setState({
            showUsrMng: !this.state.showUsrMng
        });
    }

    logOut() {
        AuthService.logOut()
        .then(() => {return window.location.href = '/#/login'})
        .catch((err) => alert(err))
    }

    render() {
        let usrMng = (
            <div>
                <div id="Header-UsrMng-box">
                    <p className="Header-UsrInfo">
                        {this.state.getCookie('username') + ' ' + this.state.getCookie('surname')}
                        <br></br>
                        <span id="Header-UsrItem" onClick={() => {
                            return window.location.href = '/#/admins/' + this.state.getCookie('_id')
                            }}>Gerenciar Perfil</span>
                        <br></br><br></br>
                        <p className="Header-Logout" title="log out"
                        onClick={this.logOut.bind(this)}><b><span className="glyphicon glyphicon-log-out"></span> Log Out</b></p>
                    </p>
                </div>
            </div>);
        return (
            <div className="Dashboard">
                <header className="Dashboard-header">
                    <ul>
                        <li><a href="/#/feedback">Feedback</a></li>
                        <li><a href="/#/respostas">Respostas</a></li>
                        {this.state.getCookie('master') === 'true' ? <li><a href="/#/admin">ADMIN</a></li> : null}
                        <li><a href="https://fatec-chabot.mybluemix.net/#/" target="blank">Chatbot</a></li>
                    </ul>
                    <img src={userImg} id="User-Photo" className="Header-user" alt="User photo"
                        onClick={this.UserManagement.bind(this)} />
                    {this.state.showUsrMng ? usrMng : null}

                </header>
                <Switch>
                    <Route path="/feedback/:id" component={FeedbackGetOne} />
                    <Route path="/feedback" component={FeedbackGetAll} />
                    <Route path="/respostas/:id" component={AnswersGetOne} />
                    <Route path="/respostas" component={AnswersGetAll} />
                    <Route path="/admins/:id" component={UpdateAdmin} />
                    <Route path="/" component={FeedbackGetAll} />
                </Switch>
            </div>
        );
    }
}

export default Dashboard;
