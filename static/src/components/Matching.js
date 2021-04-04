import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import * as actionCreators from '../actions/auth';
import { get_suggestions } from '../utils/http_functions'; 

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        userName: state.auth.userName,
        isAuthenticated: state.auth.isAuthenticated,
        isRegistering: state.auth.isRegistering,
        registerStatusText: state.auth.registerStatusText
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

const style = {
    marginTop: 150,
    paddingTop: 50,
    paddingBottom: 40,
    width: "100%",
    color: "black",
    backgroundColor: "white",
    fontFamily: "Avenir",
};

@connect(mapStateToProps, mapDispatchToProps)

export default class Matching extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.state = {
            query_tag: '',
            loading: true,
            suggested_rooms: [],
        };
    }

    dispatchNewRoute(route) {
        browserHistory.push(route);
        this.setState({
            open: false,
        });
    }

    handleSubmit(tag) {
        if (tag == '') {
            alert('Input must not be empty, please re-enter');
            return;
        }
        get_suggestions(tag).then(response => {
            var rooms = response.data.results;
            this.setState({ 
                loading: false,
                suggested_rooms: rooms,
            });
            if( rooms.length == 0){
                alert('No matching found');
                return;
            }
            var state_data = {            
                query_tag: tag,
                loading: false,
                cur_index: 0,
                suggested_rooms: rooms,
            }
            var path = {
                pathname:'/matched',
                state: state_data,
            }
            this.dispatchNewRoute(path);
        })
    }

    _handleKeyPress(e) {
        if (e.key == 'Enter') {
            this.handleSubmit();
        }
    }

    changeValue(e, type) {
        const value = e.target.value;
        // long tags are not allowed 
        if (e.target.value.length > 10){
            return;
        }
        const next_state = {};
        next_state[type] = value;
        this.setState(next_state);
    }

    render() {
        return (
            <div className="container" style={{ fontFamily: "Avenir" }}>
                <Paper style={style}>
                    <div className="text-center">
                        <h2 style={{marginBottom: 25, fontWeight: 900, color: "#77428D"}}>
                            Match me to a group!
                        </h2>
                        <p style={{color: "#91989F", fontWeight: 700, fontSize: "22px"}}>
                            Popular Tags
                        </p>
                        <RaisedButton
                            style={{marginTop: 10, marginRight: 25}}
                            label="poker"
                            labelColor="#8B81C3"
                            onClick={() => this.handleSubmit("Poker")}
                        />
                        <RaisedButton
                            style={{marginTop: 10, marginRight: 25}}
                            label="outdoor"
                            labelColor="#8B81C3"
                            onClick={() => this.handleSubmit("Outdoor")}
                        />
                        <RaisedButton
                            style={{marginTop: 10, marginRight: 25}}
                            label="study"
                            labelColor="#8B81C3"
                            onClick={() => this.handleSubmit("Study")}
                        />
                        <RaisedButton
                            style={{marginTop: 10}}
                            label="party"
                            labelColor="#8B81C3"
                            onClick={() => this.handleSubmit("Party")}
                        />
                        <br />
                        <TextField
                            floatingLabelText="Or type your tag here"
                            type= 'query_tag'
                            errorText={null}
                            onChange={(e) => this.changeValue(e,'query_tag')}
                        />
                        <br />
                        <RaisedButton
                            style={{ marginTop: 50 }}
                            label="Submit"
                            onClick={(e) => this.handleSubmit(this.state.query_tag)}
                        />  
                    </div>
                </Paper>
            </div>
        );
    }
}
