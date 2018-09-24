import React from "react";
import './ManageAdmins.css';
import AuthService from '../../services/Auth';
import loading from '../../assets/loading.gif';

const $ = require('jquery');
$.DataTable = require('datatables.net');

class ManageAdminsTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false
        }
    }

    componentDidMount() {
        $(this.refs.main).DataTable({
            responsive: true,
            "pagingType": "full_numbers",
        });
    }

    render() {
        let confirmRemove;
        let checkProp;
        let removeAdmin = (id, rev) => {
            confirmRemove = window.confirm('Deseja realmente excluir esse admin?');
            if (confirmRemove) 
                document.getElementById('Admins-table').style.visibility = 'hidden';
                this.setState({
                    isLoading: true
                })
                AuthService.removeAdmin(id, rev)
                    .then(() => { return document.location.reload(true); })
                    .catch((err) => {
                        if (err === 'Unauthorized') return window.location.href = '/#/login';
                        alert(err);
                        document.getElementById('Admins-table').style.visibility = 'show';
                        return this.setState({
                            isLoading: false
                        })
                    })
        }
        let updateAdmin = (id) => {
            checkProp = document.getElementById(id + '-active').value;
            if(checkProp === 'true') checkProp = false;
            else checkProp = true;
            document.getElementById('Admins-table').style.visibility = 'hidden';
            this.setState({
                isLoading: true
            })
            let data = {
                active: checkProp
            }
            AuthService.activeAdmin(id, data)
                .then(() => { return document.location.reload(true); })
                .catch((err) => {
                    if (err === 'Unauthorized') return window.location.href = '/#/login';
                    alert(err);
                    document.getElementById('Admins-table').style.visibility = 'show';
                    return this.setState({
                        isLoading: false
                    })
                })
        }
        if (this.props.obj.length === 0) {
            return (
                <table ref="main" className="table-style table table-striped table-bordered 
                    table-condensed table-hover dt-responsive" align="center" cellSpacing="0" width="80% ">
                        <thead>
                        <tr>
                            <th>Deletar</th>
                            <th>Conta ativa</th>
                            <th>Nome</th>
                            <th>Email</th>
                        </tr>
                   </thead>
                </table>
            );
        }

        let objs = this.props.obj.map(function (obj, index) {
            return (
                ! obj.master ? 
                <tr key={index}>
                    <td>
                        <label onClick={() => removeAdmin(obj._id, obj._rev)}
                            className="glyphicon glyphicon-trash"></label>
                    </td>
                    <td>{obj.active ? <input type="checkbox" checked value={obj.active} id={obj._id + '-active'} 
                        onChange={() => { updateAdmin(obj._id);}}/> 
                        : 
                        <input type="checkbox" value={obj.active} id={obj._id + '-active'} 
                            onChange={() => { updateAdmin(obj._id); }}/>
                    }</td>
                    <td>{obj.user.name + ' ' + obj.user.surname}</td>
                    <td>{obj.email}</td>
                </tr>
                :
                null
            )
        })
        return (
            <div>
                <div id="Admins-table">
                    <table ref="main" className="table-style table table-striped table-bordered 
                        table-condensed table-hover dt-responsive" align="center" cellSpacing="0" width="80%">
                            <thead>
                            <tr>
                                <th>Deletar</th>
                                <th>Conta ativa</th>
                                <th>Nome</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {objs}
                        </tbody> 
                    </table >  
                </div>
            {this.state.isLoading ?
                <img src={loading} id="loading" alt="Carregando" title="Carregando"/> 
                : null } 
            </div>
        );
    }
}

export default ManageAdminsTable;
