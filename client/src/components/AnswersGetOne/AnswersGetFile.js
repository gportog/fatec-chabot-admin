import React from "react";
import AnswersService from '../../services/Answers';
import loading from '../../assets/loading.gif';
import './AnswersGetOne.css';

class AnswersGetFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pdf: '',
            isLoading: true,
            gotError: false,
            error: ''
        }
    }

    componentDidMount() {
        AnswersService.getEmbed(this.props.fileID)
            .then((data) => {
                return this.setState({
                    pdf: data,
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
                {this.state.isLoading ?
                    <img src={loading} id="loading"
                        alt="Carregando" title="Carregando" />
                    : this.state.gotError ?
                        <p id="error">{this.state.error}</p>
                        :
                        <iframe className="col-sm-offset-4 col-sm-5" 
                            src={this.state.pdf} frameBorder="0" 
                            allowFullScreen="true" height="500"></iframe>
                }
            </div>
        )
    }
}

export default AnswersGetFile;
