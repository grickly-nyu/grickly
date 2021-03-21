import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/auth';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {send_verification_email} from '../utils/http_functions';
import { browserHistory } from 'react-router';

function mapStateToProps(state) {
    return {
        isRegistering: state.auth.isRegistering,
        registerStatusText: state.auth.registerStatusText,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

const style = {
    marginTop: 150,
    paddingTop: 40,
    paddingLeft: 50,
    paddingRight: 50,
    paddingBottom: 70,
    width: "100%",
    color: "black",
    backgroundColor: "white",
    fontFamily: "Avenir",
};

const titleStyle = {
    color: "#77428D",
    fontWeight: 900,
    fontSize: "45px",
    fontFamily: "Avenir",
}

@connect(mapStateToProps, mapDispatchToProps)

export default class ForgotPassword extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.state = {
            email:null,
        };
    }
    
    
    handleMessageSubmit(){
        if (this.state.email) {
            send_verification_email(this.state.email).then(response=>{
                if (response.data.result){
                    alert("Check your email for the link to reset password.");
                }
                else{
                    alert("The email you entered is not linked to an account, you can register now!");
                }
                browserHistory.push('/main');
            }

            )
        }
        else{
            alert('Input must not be empty');
        }

        
      }
    
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
            <div className="container">
                <Paper style={style}>
                    <h2 style={titleStyle}>Reset my password</h2>
                    <div>
                        <TextField
                            underlineFocusStyle={{borderColor: "#FFB11B"}}
                            floatingLabelFocusStyle={{color: "#FFB11B"}}
                            floatingLabelText="Please enter your email"
                            type="content"
                            errorText={null}
                            onChange={(e) => this.setState({email: e.target.value})}
                        />
                        <br />
                        <RaisedButton
                            style={{ marginTop: 30 }}
                            label="Send password reset link"
                            labelColor="#FFB11B"
                            labelStyle={{
                                fontWeight: "550",
                            }}
                            onClick={() => this.handleMessageSubmit()}
                        />
                    </div>
                </Paper>
            </div>
        );
        
        
        

    }
}
