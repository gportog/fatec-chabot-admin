import React from "react";
import FeedbackService from '../../services/Feedback';
import loading from '../../assets/loading.gif';
import FeedbackGetAllTable from './FeedbackGetAllTable';
import './FeedbackGetAll.css';

class FeedbackGetAll extends React.Component {
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
        FeedbackService.getAll()
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
                <h1>Feedback</h1>
                {this.state.isLoading ? 
                    <img src={loading} id="loading" 
                     alt="Carregando" title="Carregando"/> 
                    : this.state.gotError ?
                        <p id="error">{this.state.error}</p>
                        :
                        <FeedbackGetAllTable obj={this.state.obj} />
                }
            </div>
        )
    }
}

export default FeedbackGetAll;
