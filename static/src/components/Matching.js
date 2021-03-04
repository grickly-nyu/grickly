import React from 'react';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/auth';
import 'regenerator-runtime/runtime'
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';


import {get_suggestions} from '../utils/http_functions'; 
// !! 



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



