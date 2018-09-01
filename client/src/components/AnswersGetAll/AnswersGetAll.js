import React from "react";
import AnswersService from '../../services/Answers';
import loading from '../../assets/loading.gif';
import AnswersGetAllTable from './AnswersGetAllTable';
import './AnswersGetAll.css';

class AnswersGetAll extends React.Component {
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
        AnswersService.getAll()
            .then((data) => {
                return this.setState({
                    obj: data,
                    isLoading: false
                })
            })
            .catch((err) => {
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
                <h1>Respostas</h1>
                {this.state.isLoading ? 
                    <img src={loading} id="loading" 
                     alt="Carregando" title="Carregando"/> 
                    : this.state.gotError ?
                        <p id="error">{this.state.error}</p>
                        :
                        <AnswersGetAllTable obj={this.state.obj} />
                }
            </div>
        )
    }
}

export default AnswersGetAll;
