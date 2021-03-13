import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/auth';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {validate_email, reset_password} from '../utils/http_functions';
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

export default class ResetForgotPassword extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        this.state = {
            new_password:null,
            re_enter:null,
            verified:false,
            hash:urlParams.get('hash'),
        };
        // const queryString = window.location.search;
        // const urlParams = new URLSearchParams(queryString);
        // const hash = urlParams.get('hash')
        validate_email(this.state.hash).then(response=>{
            if(response.data.result){
                this.setState({verified:true});
            }
        })
    }
    
    
    handleMessageSubmit(){
        if (this.state.new_password && this.state.re_enter) {
            if(this.state.new_password!=this.state.re_enter){
                alert("Conflicts between new password and re_enter, please enter the same password.");
            }
            else{
                // change_password(this.state.old_password,this.state.new_password);
                console.log(this.state.hash,this.state.new_password)
                reset_password(this.state.hash,this.state.new_password).then(response =>{
                    console.log("ran reset")
                    if (!response.data.result){
                        alert(response.data.message);
                    }
                    else{
                        alert("Password reset successful.");
                    }
                    browserHistory.push('/profile');
                })
                
            }
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
            <div className = "row">
                <div className="col-md-3  col-md-offset-1">
                    <Paper style={style}>
                        <div className="text-center">
                        {this.state.verified?
                        <div>
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
                            <RaisedButton
                                style={{ marginTop: 50 }}
                                label="Confirm change of password"
                                onClick={() => this.handleMessageSubmit()}
                            />
                        </div>
                        :
                        <div>
                            就这？就这就这就这就这就这？
                        </div>
                    }
                        </div>
                    </Paper>
                </div>
            </div>
        );
        
        
        

    }
}



