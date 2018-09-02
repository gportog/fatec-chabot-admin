import React from "react";
import FeedbackService from '../../services/Feedback';
import loading from '../../assets/loading.gif';
import './FeedbackGetOne.css';

class FeedbackGetOne extends React.Component {
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
        if (this.props.location.state) {
            return this.setState({
                obj: this.props.location.state,
                isLoading: false
            })
        }
        FeedbackService.get(this.props.match.params.id)
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
        let objs = this.state.obj;
        return (
            <div className="container">
                <span onClick={this.props.history.goBack}
                    alt="Back" title="Back"
                    className="glyphicon glyphicon-circle-arrow-left"/>
                <h2>Feedback</h2>
                {this.state.isLoading ? 
                    <img src={loading} id="loading" 
                     alt="Carregando" title="Carregando"/> 
                    : this.state.gotError ?
                        <p id="error">{this.state.error}</p>
                        :
                <form>
                    <div className="form-group row">
                        <label for="inputUsername" 
                            className="col-sm-offset-3 col-sm-1 col-form-label">Usuário
                        </label>
                        <div className="col-sm-5">
                            <input type="text" value={objs.user} 
                                className="form-control" id="username" 
                                placeholder="Usuário"/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label for="inputContact" 
                            className="col-sm-offset-3 col-sm-1 col-form-label">Contato
                        </label>
                        <div className="col-sm-5">
                            <input type="text" value={objs.contact} 
                                className="form-control" id="contact" 
                                placeholder="Contato"/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label for="inputDate" 
                            className="col-sm-offset-3 col-sm-1 col-form-label">Data
                        </label>
                        <div className="col-sm-5">
                            <input type="text" value={objs.date}  
                                className="form-control" id="date" 
                                placeholder="Data"/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label for="inputEvaluation" 
                            className="col-sm-offset-3 col-sm-1 col-form-label">Avaliação
                        </label>
                        <div className="col-sm-5">
                            <input type="text" value={objs.evaluation}  
                                className="form-control" id="evaluation" 
                                placeholder="Avaliação"/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label for="inputComment" 
                            className="col-sm-offset-3 col-sm-1 col-form-label">Comentário
                        </label>
                        <div className="col-sm-5">
                            <textarea type="text" value={objs.comment}
                                className="form-control" id="comment" 
                                placeholder="Comentário"/>
                        </div>
                    </div>
                    { objs.history.length > 0 ?
                    <div className="form-group row">
                        <label for="inputHistory" 
                            className="col-sm-offset-3 col-sm-1 col-form-label">Histórico
                        </label>
                        <div className="col-sm-5">
                            <textarea type="text" rows="10" value={objs.history.map((obj, index) => {
                                return "Usuário: " + obj.input.text + "\n" + 
                                    "Chatbot: " + obj.output.text.join('\n') + "\n";
                        })}
                                className="form-control" id="history" 
                                placeholder="Histórico"/>
                        </div>
                    </div>
                    : null }
                </form>
                }
               </div>
        )
    }
}

export default FeedbackGetOne;
