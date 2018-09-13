import React from "react";
import AnswersGetFile from "./AnswersGetFile";
import AnswersService from '../../services/Answers';
import loading from '../../assets/loading.gif';
import './AnswersGetOne.css';

class AnswersGetOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            obj: [],
            isLoading: true,
            fileStatus: 'keep',
            answerFile: null,
            gotError: false,
            showPDF: false,
            showNewUpload: false,
            error: ''
        }
    }

    componentDidMount() {
        if (this.props.location.state) {
            if (this.props.location.state.file) {
                return this.setState({
                    obj: this.props.location.state,
                    showPDF: true,
                    isLoading: false
                })
            }
            return this.setState({
                obj: this.props.location.state,
                isLoading: false
            })
        }
        AnswersService.get(this.props.match.params.id)
            .then((data) => {
                if (data.file) {
                    return this.setState({
                        obj: data,
                        showPDF: true,
                        isLoading: false
                    })
                }
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

    updateFileStatus(status) {
        if (status === 'new')
            return this.setState({
                fileStatus: 'new'
            })
        else if (status === 'update')
            return this.setState({
                fileStatus: 'update',
                showPDF: false,
                showNewUpload: true
            })
        else if (status === 'delete')
            return this.setState({
                fileStatus: 'delete',
                showPDF: false,
                showNewUpload: false
            })
        else
            return this.setState({
                fileStatus: 'keep',
                showPDF: true,
                showNewUpload: false
            })
    }

    handleFile(event) {
        if (event.target.files.length > 0)
            if (this.state.fileStatus === 'keep')
                return this.setState({
                    fileStatus: 'new',
                    answerFile: event.target.files[0]
                })
            else
                return this.setState({
                    answerFile: event.target.files[0]
                })
        else
            return this.setState({
                fileStatus: 'keep',
                answerFile: null
            })
    }

    handleChange(key, value) {
        let objToChange = this.state.obj;
        objToChange[key] = value;
        this.setState({
            obj: objToChange
        })
    }

    handleSubmit(event) {
        this.setState({
            isLoading: true
        })
        let answerFile = this.state.answerFile;
        let fileStatus = this.state.fileStatus;
        let entities = this.state.obj.entities;
        if (!answerFile) {
            if (fileStatus === 'delete') fileStatus = 'delete';
            else fileStatus = 'keep';
        }
        const data = new FormData();
        data.append('_id', this.state.obj._id);
        data.append('_rev', this.state.obj._rev);
        data.append('intent', this.state.obj.intent);
        data.append('answer', document.getElementById("answer").value);
        data.append('file', this.state.obj.file);
        data.append('answerFile', answerFile);
        data.append('fileStatus', fileStatus);
        entities.map((obj) => {
            data.append('entity', obj.entity);
            data.append('value', obj.value);
        });
        AnswersService.update(this.state.obj._id, this.state.obj._rev, data)
            .then((data) => {
                alert('Resposta atualizada com sucesso');
                return document.location.reload(true);
            })
            .catch((err) => {
                if (err === 'Unauthorized') return window.location.href = '/#/login';
                alert(err)
            })
        event.preventDefault();
    }

    render() {
        let objs = this.state.obj;
        return (
            <div className="container">
                <span onClick={this.props.history.goBack}
                    alt="Back" title="Back"
                    className="glyphicon glyphicon-circle-arrow-left" />
                <h2>Resposta</h2>
                {this.state.isLoading ?
                    <img src={loading} id="loading"
                        alt="Carregando" title="Carregando" />
                    : this.state.gotError ?
                        <p id="error">{this.state.error}</p>
                        :
                        <form onSubmit={this.handleSubmit.bind(this)}>
                            <div className="form-group row">
                                <label htmlFor="inputIntent"
                                    className="col-sm-offset-3 col-sm-1 col-form-label">Intenção
                        </label>
                                <div className="col-sm-5">
                                    <input type="text" value={objs.intent}
                                        className="form-control" id="intent" disabled
                                        name="intent" placeholder="Intenção detectada" />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="inputEntities"
                                    className="col-sm-offset-3 col-sm-1 col-form-label">Entidades
                        </label>
                                <div className="col-sm-5">
                                    <textarea type="text" value={objs.entities.map((obj, index) => {
                                        if (index > 0) return ' ' + obj.entity + ': ' + obj.value;
                                        return obj.entity + ': ' + obj.value;
                                    })}
                                        className="form-control" id="entities" disabled
                                        name="entities" placeholder="Entidades detectadas" />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="inputAnswer"
                                    className="col-sm-offset-3 col-sm-1 col-form-label">Resposta
                        </label>
                                <div className="col-sm-5">
                                    <textarea rows="10" type="text"
                                        className="form-control" id="answer" value={objs.answer}
                                        onChange={() => {
                                            this.handleChange("answer", document.getElementById("answer").value)
                                        }} required
                                        name="answer" placeholder="Resposta do chatbot" />
                                </div>
                            </div>
                            {objs.file ?
                                <div className="form-group row">
                                    <label htmlFor="inputAnswer"
                                        className="col-sm-offset-3 col-sm-1 col-form-label">PDF
                        </label>
                                    <div className="col-sm-5">
                                        <select className="form-control"
                                            onChange={() => {
                                                this.updateFileStatus(document.getElementById("fileStatus").value);
                                            }}
                                            id="fileStatus" name="fileStatus">
                                            <option value="keep" selected>Manter PDF</option>
                                            <option value="update">Atualizar</option>
                                            <option value="delete">Deletar</option>
                                        </select>
                                    </div>
                                </div>
                                :
                                <div className="form-group row">
                                    <label htmlFor="inputAnswer"
                                        className="col-sm-offset-3 col-sm-1 col-form-label">PDF
                                </label>
                                    <div className="col-sm-5">
                                        <input type="file" accept="application/pdf"
                                            id="file" name="file"
                                            onChange={(e) => {
                                                this.handleFile(e);
                                            }} />
                                    </div>
                                </div>
                            }
                            {this.state.showPDF ?
                                <div className="form-group row">
                                    <div>
                                        <AnswersGetFile fileID={objs.file} />
                                    </div>
                                </div>
                                : null
                            }
                            {this.state.showNewUpload ?
                                <div className="form-group row">
                                    <div className="col-sm-offset-4 col-sm-5">
                                        <input type="file" accept="application/pdf"
                                            onChange={(e) => {
                                                this.handleFile(e);
                                            }}
                                            id="file" name="file" />
                                    </div>
                                </div>
                                : null
                            }
                            <div className="form-group row">
                                <div className="col-sm-offset-4">
                                    <button type="submit" id="submitAnswer"
                                        className="btn btn-success col-sm-7">
                                        Atualizar
                            </button>
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-sm-offset-4">
                                    <button type="button" id="cancelSubmitAnswer"
                                        className="btn btn-danger col-sm-7"
                                        onClick={this.props.history.goBack}>
                                        Cancelar
                            </button>
                                </div>
                            </div>
                        </form>
                }
            </div>
        )
    }
}

export default AnswersGetOne;
