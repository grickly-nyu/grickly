import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/auth';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
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

const sideStyle = {
    fontFamily: "Avenir",
    marginTop: 64,
    width: '20%',
    height: '100vh',
    position: 'fixed',
    justifyContent: 'center',
    display: 'flex',
    borderStyle: 'none solid none none',
    borderWidth: '1px',
    borderColor: '#01012b',
    fontSize: '20px',
    fontWeight: 500,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
};

const groupStyle = {
    color: '#ff577d',
    borderStyle: 'none none solid none',
    borderWidth: '1px',
    borderColor: '#01012b',
    paddingTop: 50,
    paddingBottom: 35,
    backgroundColor: "rgba(255, 255, 255, 0.10)",
};

const style = {
    marginTop: 500,
    paddingTop: 50,
    paddingBottom: 40,
    width: '100%',
    textAlign: 'center',
    display: 'inline-block',
    color: "white",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    fontFamily: "Avenir",
};

const other_styles = {
    errorStyle: {
      color: "white",
    },
    underlineStyle: {
      borderColor: "white",
    },
    floatingLabelStyle: {
      color: "white",
    },
    floatingLabelFocusStyle: {
      color: "white",
    },
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

    handleSubmit(tag){
        if (tag == ''){
            alert('Input must not be empty, please re-enter');
            return 
        }
        get_suggestions(tag).then(response =>{
            var rooms = response.data.results
            for(var i = 0; i < response.data.results.length; i++) {
                var obj =response.data.results[i];
            }
            this.setState({ 
                loading: false, 
                suggested_rooms: rooms, });

            if( rooms.length == 0){
                alert('No matching found');
                return 
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
            this.dispatchNewRoute(path)
        })
        
      }
    _handleKeyPress(e) {
        if (e.key == 'Enter') {
            this.handleSubmit();
        }
    }

    changeValue(e, type) {
        const value = e.target.value;
        if (e.target.value.length > 10){
            return 
            // long tags are not allowed 
        }
        const next_state = {};
        next_state[type] = value;
        this.setState(next_state);
    }

    render() {
        return (
            <div style={{ fontFamily: "Avenir" }}>
            <div className="col-md-5  col-md-offset-5">
                    <Paper style={style}>
                        <div className="text-center">
                            <div className="col-md-15">
                                <RaisedButton
                                    style={{ marginTop: 50 }}
                                label="life"
                                onClick={() => this.handleSubmit("Life")}
                                />
                                <RaisedButton
                                    style={{ marginTop: 50 }}
                                label="poker"
                                onClick={() => this.handleSubmit("Poker")}
                                />
                                <RaisedButton
                                    style={{ marginTop: 50 }}
                                label="study"
                                onClick={() => this.handleSubmit("Study")}
                                />
                            </div>
                            <div>
                                <TextField
                                    floatingLabelText="Or type your tag here"
                                    type= 'query_tag'
                                    errorText={null}
                                onChange={(e) => this.changeValue(e,'query_tag')}
                                />
                                 <RaisedButton
                                    disabled={this.state.disabled}
                                    style={{ marginTop: 60 }}
                                    label="Submit"
                                    onClick={(e) => this.handleSubmit(this.state.query_tag)}
                                />  
                            </div>
                        </div>
                        <div>
                    </div>
                    </Paper>
                </div>
            </div>
        );
    }
}
