import React from "react";
import AuthHeader from './AuthHeader';
import AuthService from '../../services/Auth';
import loading from '../../assets/loading.gif';
import './Login.css';
import {
    HashRouter,
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    Redirect
} from "react-router-dom";

class Login extends React.Component {
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
        let loginEntry = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        }
        AuthService.authenticate(loginEntry)
        .then(() => {
            window.location.href = '/#/';
        })
        .catch((err) => {
            if (err === 'Unauthorized') alert('Credenciais inválidas');
            else alert(err);
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
                    <h2>ADMIN</h2>
                    <form id="loginEntry" onSubmit={this.handleSubmit.bind(this)}>
                        <div className="form-group row">
                            <label for="inputEmail" 
                                className="col-sm-offset-3 col-sm-1 col-form-label">Email
                            </label>
                            <div className="col-sm-5">
                                <input type="email" className="form-control" 
                                    id="username" name="username" required
                                    placeholder="Email"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label for="inputContact" 
                                className="col-sm-offset-3 col-sm-1 col-form-label">Senha
                            </label>
                            <div className="col-sm-5">
                                <input type="password" className="form-control" 
                                    id="password" name="password" required
                                    placeholder="Senha"/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-offset-4">
                                <button type="submit" id="submitLogin"
                                        className="btn btn-success col-sm-7">
                                        LOGIN
                                </button>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-offset-3 col-sm-7">
                                <Link to={{pathname:"/reset"}}>
                                Esqueci a minha senha
                                </Link>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-offset-3 col-sm-7">
                                <Link to={{pathname:"/registrar"}}>
                                Solicitar acesso
                                </Link>
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

export default Login;