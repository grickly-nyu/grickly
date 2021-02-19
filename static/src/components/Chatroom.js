import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/auth';

function mapStateToProps(state) {
    return {
        isRegistering: state.auth.isRegistering,
        registerStatusText: state.auth.registerStatusText,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)

export default class Chatroom extends React.Component { // eslint-disable-line react/prefer-stateless-function
    render() {
        console.log(this.props)
        return (
            <div className="col-md-8">
                <h1>Chatroom {this.props.room_id}</h1>
                <hr />
            </div>
        );
    }
}


