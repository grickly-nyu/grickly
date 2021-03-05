import React from 'react';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/auth';
import 'regenerator-runtime/runtime'
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';


import {get_suggestions} from '../utils/http_functions'; 




function mapStateToProps(state) {
    return {
        token: state.auth.token,
        userName: state.auth.userName,
        isAuthenticated: state.auth.isAuthenticated,
        isRegistering: state.auth.isRegistering,
        registerStatusText: state.auth.registerStatusText,

    };
}

//  block 1. do we need this?


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

@connect(mapStateToProps, mapDispatchToProps)

export default class Suggestion extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.state = {
           

        };
    }

// 如果有符合的room, 就推给他. 把room 几个text 和 button 给到,  (最好加上,)
// 没有的话, 给个button, redirect 到 create a group
_handleKeyPress(e) {
    if (e.key == 'Enter') {
        this.handleMessageSubmit();
    }
}
changeValue(e, type) {
    const value = e.target.value;
    const next_state = {};
    next_state[type] = value;

}

render() {
    return (
        <div className = "row">
            <div className="col-md-3  col-md-offset-1">
                <Paper style={style}>
                    <div className="text-center">

                        <div className="col-md-12">
                            <TextField
                            floatingLabelText="old password"
                            type="content"
                            errorText={null}
                            onChange={(e) => this.setState({old_password: e.target.value})}
                            />
                            <TextField
                            floatingLabelText="New password"
                            type="content"
                            errorText={null}
                            onChange={(e) => this.setState({new_password: e.target.value})}
                            />
                            <TextField
                            floatingLabelText="Re-enter your new password"
                            type="content"
                            errorText={null}
                            onChange={(e) => this.setState({re_enter: e.target.value})}
                            />
                        </div>
                        <div>
                            <RaisedButton
                                style={{ marginTop: 50 }}
                                label="Confirm change of password"
                                onClick={() => this.handleMessageSubmit()}
                            />
                        </div>
                    </div>
                </Paper>
            </div>
        </div>
    );
}
}
