import React from "react";
import AuthService from '../../services/Auth';
import AuthHeader from './AuthHeader';
import loading from '../../assets/loading.gif';
import './ResetPassword.css';
import {
    HashRouter,
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    Redirect
} from "react-router-dom";

class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        }
    }

    handleSubmit(event) {
        this.setState({
            isLoading: true
        });
        let emailEntry = {
            email: document.getElementById('email').value
        }
        AuthService.resetPassword(emailEntry)
        .then(() => {
            alert('Sua nova senha foi enviada para o/a ' + emailEntry.email);
            window.location.href = '/#/login';
        })
        .catch((err) => {
            alert(err);
            return this.setState({
                isLoading: false
            })
        })
        event.preventDefault();
    }

    render() {
        return (
            <div className="Auth">
            <AuthHeader />
            <div className="container">
                <div>
                <span onClick={this.props.history.goBack}
                    alt="Back" title="Back"
                    className="glyphicon glyphicon-circle-arrow-left"/>
                </div>
                <h2>ADMIN</h2>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <div className="form-group row">
                        <label for="inputEmail" 
                            className="col-sm-offset-3 col-sm-1 col-form-label">Email
                        </label>
                        <div className="col-sm-5">
                            <input type="email" className="form-control" 
                                id="email" name="email" required
                                placeholder="Email"/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-offset-4">
                            <button type="submit" id="submitEmail"
                                     className="btn btn-success col-sm-7">
                                       GERAR NOVA SENHA
                            </button>
                        </div>
                    </div>
                    <div className="form-group row">
                            <div className="col-sm-offset-3 col-sm-7">
                                {this.state.isLoading ?
                                <img src={loading} id="loading" alt="Checando" title="Checando" /> :
                                null}
                            </div>                    
                    </div>
                </form>
               </div>
            </div>
        )
    }
}

export default ResetPassword;