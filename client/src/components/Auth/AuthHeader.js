import React, { Component } from 'react';
import fatecJDI from '../../assets/fatecJDI.png';
import './AuthHeader.css';

class Auth extends Component {
    render() {
        return (
            <div className="Auth">
                <header className="Auth-header">
                    <img src={fatecJDI} id="Auth-fatec" alt="Fatec Jundiaí logo"/>
                    <label id="Auth-title">FATEC-JD CHATBOT ADMIN</label>
                </header>
            </div>
        );
    }
}

export default Auth;
