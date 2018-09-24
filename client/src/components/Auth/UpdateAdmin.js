import React from "react";
import AuthService from '../../services/Auth';
import loading from '../../assets/loading.gif';
import './UpdateAdmin.css';
import {
    HashRouter,
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    Redirect
} from "react-router-dom";

class UpdateAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            obj: {},
            isLoading: true,
            gotError: false,
            error: '',
            newPassword: null,
            adminPhoto: null,
            showPassInput: false,
            showPhotoInput: false
        }
    }

    componentDidMount() {
        AuthService.get(this.props.match.params.id)
        .then((data) => {
            return this.setState({
                obj: data,
                isLoading: false,
            })
        })
        .catch((err) => {
            if (err === 'Unauthorized') return window.location.href = '/#/login';
            return this.setState({
                gotError: true,
                error: err,
                isLoading: false
            })
        })
    }

    handleChange(key, value) {
        let objToChange = this.state.obj;
        objToChange.user[key] = value;
        this.setState({
            obj: objToChange
        })
    }

    updatePasswordStatus(status) {
        if(status === 'update')
            return this.setState({
                showPassInput: true
            })
        else
            return this.setState({
                showPassInput: false
            })
    }

    updatePhotoStatus(status) {
        if(status === 'update')
            return this.setState({
                showPhotoInput: true
            })
        else
            return this.setState({
                showPhotoInput: false,
                adminPhoto: null
            })
    }

    handleSubmit(event) {
        this.setState({
            isLoading: true
        });
        let adminPhoto = this.state.adminPhoto;
        let data = new FormData();
        data.append('adminPhoto', adminPhoto);
        data.append('_id', this.state.obj._id);
        data.append('_rev', this.state.obj._rev);
        data.append('email', this.state.obj.email);
        data.append('_attachments', this.state.obj._attachments);
        data.append('name', document.getElementById('name').value);
        data.append('surname', document.getElementById('surname').value);
        data.append('password', this.state.obj.password);
        if(document.getElementById('newPassword'))
            data.append('newPassword', document.getElementById('newPassword').value);
        AuthService.updateAdmin(this.state.obj._id, this.state.obj._rev, data)
        .then(() => {
            alert('Dados atualizados com sucesso. As alterações serão refletidas no próximo login.');
            return window.location.href = '/#/';
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
            <div className="container">
                <div>
                <span onClick={this.props.history.goBack}
                    alt="Back" title="Back"
                    className="glyphicon glyphicon-circle-arrow-left"/>
                </div>
                <h2>ADMIN</h2>
                {this.state.isLoading ?
                    <img src={loading} id="loading"
                        alt="Carregando" title="Carregando" />
                    : this.state.gotError ?
                        <p id="error">{this.state.error}</p>
                        :                
                <form id="adminEntry" onSubmit={this.handleSubmit.bind(this)}>
                    <div className="form-group row">
                        <label for="inputName" 
                            className="col-sm-offset-3 col-sm-1 col-form-label">Nome
                        </label>
                        <div className="col-sm-5">
                            <input type="text" className="form-control" 
                                id="name" name="name" required
                                value={this.state.obj.user.name}
                                onChange={() => {
                                    this.handleChange("name", document.getElementById("name").value)
                                }}
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
                                value={this.state.obj.user.surname}
                                onChange={() => {
                                    this.handleChange("surname", document.getElementById("surname").value)
                                }}
                                placeholder="Sobrenome"/>
                        </div>
                    </div>                 
                    <div className="form-group row">
                        <label for="inputEmail" 
                            className="col-sm-offset-3 col-sm-1 col-form-label">Email
                        </label>
                        <div className="col-sm-5">
                            <input type="email" className="form-control" 
                                id="email" name="email" disabled
                                value={this.state.obj.email}
                                placeholder="Email"/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="inputPassword"
                               className="col-sm-offset-3 col-sm-1 col-form-label">Senha
                        </label>
                            <div className="col-sm-5">
                               <select className="form-control"
                                       onChange={() => {
                                           this.updatePasswordStatus(document.getElementById("passwordStatus").value);
                                        }}
                                        id="passwordStatus" name="passwordStatus">
                                    <option value="keep" selected>Manter senha</option>
                                    <option value="update">Atualizar</option>
                                </select>
                            </div>
                    </div>
                    {this.state.showPassInput ?
                    <div className="form-group row">
                        <label for="inputPassword" 
                            className="col-sm-offset-3 col-sm-1 col-form-label">Nova senha
                        </label>
                        <div className="col-sm-5">
                            <input type="password" className="form-control" 
                                id="newPassword" name="newPassword" required
                                placeholder="Senha"/>
                        </div>
                    </div>: null}  
                    <div className="form-group row">
                        <label htmlFor="inputPhoto"
                               className="col-sm-offset-3 col-sm-1 col-form-label">Foto
                        </label>
                            <div className="col-sm-5">
                               <select className="form-control"
                                       onChange={() => {
                                           this.updatePhotoStatus(document.getElementById("photoStatus").value);
                                        }}
                                        id="photoStatus" name="photoStatus">
                                    <option value="keep" selected>Manter foto</option>
                                    <option value="update">Atualizar</option>
                                </select>
                            </div>
                    </div>
                    {this.state.showPhotoInput ?
                    <div className="form-group row">
                        <label for="inputPhoto" 
                            className="col-sm-offset-3 col-sm-1 col-form-label">Nova foto
                        </label>
                        <div className="col-sm-5">
                            <input type="file" accept="image/jpeg, image/png, image/jpg" 
                                id="adminPhoto" name="adminPhoto" 
                                onChange={(e) => { this.handleFile(e) }} required/>
                        </div>
                    </div> : null}
                    <div className="form-group row">
                        <div className="col-sm-offset-4">
                            <button type="submit" id="submitUpdate"
                                     className="btn btn-success col-sm-7">
                                       ATUALIZAR
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
                </form>}
               </div>
        );
    }
}

export default UpdateAdmin;
