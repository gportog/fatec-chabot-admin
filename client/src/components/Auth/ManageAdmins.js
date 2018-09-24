import React from "react";
import AuthService from '../../services/Auth';
import loading from '../../assets/loading.gif';
import ManageAdminsTable from './ManageAdminsTable';
import './ManageAdmins.css';

class ManageAdmins extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            obj: [],
            isLoading: true,
            gotError: false,
            error: ''
        }
    }

    componentDidMount() {
        AuthService.getAll()
            .then((data) => {
                return this.setState({
                    obj: data,
                    isLoading: false
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

    render() {
        return (
            <div>
                <h1>Admins</h1>
                {this.state.isLoading ?
                    <img src={loading} id="loading"
                        alt="Carregando" title="Carregando" />
                    : this.state.gotError ?
                        <p id="error">{this.state.error}</p>
                        : <ManageAdminsTable obj={this.state.obj} />
                }
            </div>
        )
    }
}

export default ManageAdmins;
