import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/auth';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { change_password } from '../utils/http_functions';
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
    paddingBottom: 70,
    width: "100%",
    color: "#91989F",
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

export default class ChangePassword extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.state = {
            old_password:null,
            new_password:null,
            re_enter:null,
        };
    }
    
    handleMessageSubmit(){
        if (this.state.new_password && this.state.old_password && this.state.re_enter) {
            if(this.state.new_password!=this.state.re_enter){
                alert("Conflicts between new password and re_enter, please enter the same password.");
            }
            else{
                // change_password(this.state.old_password,this.state.new_password);

                change_password(this.state.old_password,this.state.new_password).then(response =>{
                    if (!response.data.result){
                        alert(response.data.message);
                    }
                    else{
                        browserHistory.push('/profile');
                    }
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
            <div className="container">
                <Paper style={style}>
                    <h2 style={titleStyle}>Change Password</h2>
                    <p>
                        Please provide a valid new password. It shouldn't be empty nor the same with the previous password.
                    </p>
                    <div className="text-center">
                        <TextField
                            underlineFocusStyle={{borderColor: "#FFB11B"}}
                            floatingLabelFocusStyle={{color: "#FFB11B"}}
                            floatingLabelText="Old password"
                            type="content"
                            errorText={null}
                            onChange={(e) => this.setState({old_password: e.target.value})}
                        />
                        <br />
                        <TextField
                            underlineFocusStyle={{borderColor: "#FFB11B"}}
                            floatingLabelFocusStyle={{color: "#FFB11B"}}
                            floatingLabelText="New password"
                            type="content"
                            errorText={null}
                            onChange={(e) => this.setState({new_password: e.target.value})}
                        />
                        <br />
                        <TextField
                            underlineFocusStyle={{borderColor: "#FFB11B"}}
                            floatingLabelFocusStyle={{color: "#FFB11B"}}
                            floatingLabelText="Re-enter your new password"
                            type="content"
                            errorText={null}
                            onChange={(e) => this.setState({re_enter: e.target.value})}
                        />
                        <br />
                        <RaisedButton
                            style={{ marginTop: 50 }}
                            label="Change my password"
                            labelColor="#FFB11B"
                            onClick={() => this.handleMessageSubmit()}
                        />
                    </div>
                </Paper>
            </div>
        );
    }
}
