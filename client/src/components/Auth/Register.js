import React from "react";
import AuthService from '../../services/Auth';
import AuthHeader from './AuthHeader';
import loading from '../../assets/loading.gif';
import './Register.css';
import {
    HashRouter,
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    Redirect
} from "react-router-dom";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            adminPhoto: null
        }
    }

    handleSubmit(event) {
        this.setState({
            isLoading: true
        });
        let adminPhoto = this.state.adminPhoto;
        let data = new FormData();
        data.append('adminPhoto', adminPhoto);
        data.append('name', document.getElementById('name').value);
        data.append('surname', document.getElementById('surname').value);
        data.append('email', document.getElementById('email').value);
        data.append('password', document.getElementById('password').value);
        AuthService.requestAcess(data)
        .then(() => {
            alert('Acesso solicitado com sucesso. Assim que o administrador aprovar sua solicitação, você será notificado no email cadastrado.');
            window.location.href = '/#/login';
        })
        .catch((err) => {
            alert(err);
            return this.setState({
                isLoading: false
            });
        })
        event.preventDefault();
    }

    handleFile(event) {
        if (event.target.files.length > 0)
            return this.setState({
                adminPhoto: event.target.files[0]
            });
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
                <form id="adminEntry"onSubmit={this.handleSubmit.bind(this)}>
                    <div className="form-group row">
                        <label for="inputPhoto" 
                            className="col-sm-offset-3 col-sm-1 col-form-label">Foto
                        </label>
                        <div className="col-sm-5">
                            <input type="file" accept="image/jpeg, image/png, image/jpg" 
                                id="adminPhoto" name="adminPhoto" 
                                onChange={(e) => { this.handleFile(e) }} required/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label for="inputName" 
                            className="col-sm-offset-3 col-sm-1 col-form-label">Nome
                        </label>
                        <div className="col-sm-5">
                            <input type="text" className="form-control" 
                                id="name" name="name" required
                                placeholder="Nome"/>
                        </div>
                    </div>   
                    <div className="form-group row">
                        <label for="inputName" 
                            className="col-sm-offset-3 col-sm-1 col-form-label">Sobrenome
                        </label>
                        <div className="col-sm-5">
                            <input type="text" className="form-control" 
                                id="surname" name="surname" required
                                placeholder="Sobrenome"/>
                        </div>
                    </div>                 
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
                        <label for="inputPassword" 
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
                            <button type="submit" id="submitRegistration"
                                     className="btn btn-success col-sm-7">
                                       SOLICITAR ACESSO
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

export default Register;
