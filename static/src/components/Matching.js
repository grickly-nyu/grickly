import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/auth';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';
import { browserHistory } from 'react-router';

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
    marginTop: 50,
    paddingBottom: 40,
    paddingTop: 25,
    width: '100%',
    textAlign: 'center',
    display: 'inline-block',
    color: "white",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    fontFamily: "AvenirNext-Medium"
};

//  block 1

@connect(mapStateToProps, mapDispatchToProps)

export default class Matching extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.state = {
            query_tag: null,
            loading: true,
            suggested_rooms: [],
            bool_tags: {"tag1":false,"tag2":false,"tag3":false},
        };
    }

    handleSubmit(){
        if (this.query_tag) {

        }
           
        else{
            alert('Input must not be empty');
        }
      }


    dispatchNewRoute(route) {
        browserHistory.push(route);
        this.setState({
            open: false,
        });
    }

    chatroom(room_id, room_name){
        console.log(this.state)
        var data = {room_id: room_id, room_name: room_name}
        var path = {
            pathname:'/chatroom',
            state:data,
        }
        this.dispatchNewRoute(path)
    }

    // for text box input only
    // actually not really need this. after text box input then submit button
    _handleKeyPress(e) {
        if (e.key == 'Enter') {
            this.handleMessageSubmit();
        }
    }
    // 

    changeValue(e, type) {
        const value = e.target.value;
        const next_state = {};
        next_state[type] = value;
        this.setState(next_state, () => {
            this.isDisabled();
        });
    }

    
    render() {
        return (
            <div className = "row">
                <div className="col-md-3  col-md-offset-1">
                    <Paper style={style}>
                        <div className="text-center">
                            <div className="col-md-12">
                                <RaisedButton
                                    style={{ marginTop: 50 }}
                                    label="tag1"
                                    onClick={() => this.setState({query_tag: "tag1"}) }
                                />
                                <RaisedButton
                                    style={{ marginTop: 50 }}
                                    label="tag2"
                                    onClick={() => this.setState({query_tag: "tag2"}) }
                                />
                                <RaisedButton
                                    style={{ marginTop: 50 }}
                                    label="tag3"
                                    onClick={() => this.setState({query_tag: "tag3"}) }
                                />
                            </div>
                            <div>
                                <TextField
                                    floatingLabelText="Or type your tag here"
                                    type="content"
                                    errorText={null}
                                    onChange={(e) => this.changeValue(e,"content")}
                                />  
                            </div>
                        </div>
                    </Paper>
                </div>
            </div>
        );
    }
}
