import React from "react";
import './AnswersGetAll.css';
import AnswersService from '../../services/Answers';
import {
    HashRouter,
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    Redirect
} from "react-router-dom";

const $ = require('jquery');
$.DataTable = require('datatables.net');

class AnswersGetAllTable extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        $(this.refs.main).DataTable({
            responsive: true,
            "pagingType": "full_numbers",
        });
    }

    render() {
        if (this.props.obj.length === 0) {
            return (
                <table ref="main" className="table-style table table-striped table-bordered 
                    table-condensed table-hover dt-responsive" align="center" cellSpacing="0" width="80% ">
                        < thead >
                        <tr>
                            <th>Editar</th>
                            <th>Intenção</th>
                            <th>Entidades</th>
                            <th>Resposta</th>
                            <th>PDF</th>
                        </tr>
                   </thead >
                </table >
            );
        }

        let openFileLink = (file) => {
            AnswersService.getEmbed(file)
                .then(data => window.open(data))
                .catch(err => console.error(err))
        }
        let objs = this.props.obj.map(function (obj, index) {
            return (
                <tr key={index}>
                    <td>
                        <Link to={{ pathname: "/respostas/" + obj._id, state: obj }}
                            className="glyphicon glyphicon-pencil"/>
                    </td>
                    <td>{obj.intent}</td>
                    <td>{obj.entities.map((obj) => {
                        return <p><b>{obj.entity}</b>: {obj.value}</p>
                        })}
                    </td>
                    <td>{obj.answer}</td>
                    <td>
                        {obj.file ? <a onClick={() => openFileLink(obj.file)} className="glyphicon glyphicon-eye-open"></a>
                            : null}
                    </td>
                </tr>
            )
        })
        return (
            <table ref="main" className="table-style table table-striped table-bordered 
                table-condensed table-hover dt-responsive" align="center" cellSpacing="0" width="80% ">
                    < thead >
                    <tr>
                        <th>Editar</th>
                        <th>Intenção</th>
                        <th>Entidades</th>
                        <th>Resposta</th>
                        <th>PDF</th>
                    </tr>
                 </thead >
            <tbody>
                {objs}
            </tbody> 
                </table >          
        );
    }
}

export default AnswersGetAllTable;
