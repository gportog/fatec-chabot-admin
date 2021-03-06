import React from "react";
import './FeedbackGetAll.css';
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

class FeedbackGetAllTable extends React.Component {
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
                            <th>Visualizar</th>
                            <th>Usuário</th>
                            <th>Avaliação</th>
                            <th>Comentário</th>
                            <th>Data</th>
                        </tr>
                   </thead >
                </table >
            );
        }
        let objs = this.props.obj.map(function (obj, index) {
            return (
                <tr key={index}>
                    <td>
                        <Link to={{ pathname: "/feedback/" + obj._id, state: obj }} 
                        className="glyphicon glyphicon-eye-open"/>
                    </td>
                    <td>{obj.user}</td>
                    <td>{obj.evaluation}</td>
                    <td>{obj.comment}</td>
                    <td>{obj.date}</td>
                </tr>
            )
        })
        return (
            <table ref="main" className="table-style table table-striped table-bordered 
                table-condensed table-hover dt-responsive" align="center" cellSpacing="0" width="80% ">
                    < thead >
                    <tr>
                        <th>Visualizar</th>
                        <th>Usuário</th>
                        <th>Avaliação</th>
                        <th>Comentário</th>
                        <th>Data</th>
                    </tr>
                 </thead >
            <tbody>
                {objs}
            </tbody> 
                </table >          
        );
    }
}

export default FeedbackGetAllTable;
