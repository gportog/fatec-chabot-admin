import React, { Component } from 'react';
import userImg from '../assets/userImg.png';
import FeedbackGetAll from '../components/FeebackGetAll/FeedbackGetAll';
import AnswersGetAll from '../components/AnswersGetAll/AnswersGetAll';
import FeedbackService from '../services/Feedback';
import AnswersService from '../services/Answers';
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
            showUsrMng: false
        }
    }

    UserManagement() {
        this.setState({
            showUsrMng: !this.state.showUsrMng
        });
    }

    render() {
        let usrMng = (
            <div>
                <div id="Header-UsrMng-box">
                    <p className="Header-UsrInfo">
                        Admin
                        <br></br>
                        Gerenciar Perfil
                        <br></br><br></br>
                        <p className="Header-Logout" title="log out"><b><span className="glyphicon glyphicon-log-out"></span> Log Out</b></p>
                    </p>
                </div>
            </div>);
        return (
            <div className="Dashboard">
                <header className="Dashboard-header">
                    <ul>
                        <li><a href="/#/feedback">Feedback</a></li>
                        <li><a href="/#/respostas">Respostas</a></li>
                        <li><a href="/#/admin">ADMIN</a></li>
                        <li><a href="https://fatec-chabot.mybluemix.net/#/" target="blank">Chatbot</a></li>
                    </ul>
                    <img src={userImg} className="Header-user" alt="User photo"
                        onClick={this.UserManagement.bind(this)} />
                    {this.state.showUsrMng ? usrMng : null}

                </header>
                <Switch>
                    <Route path="/feedback" component={FeedbackGetAll} />
                    <Route path="/respostas" component={AnswersGetAll} />
                </Switch>
            </div>
        );
    }
}

export default Dashboard;
