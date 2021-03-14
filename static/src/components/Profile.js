import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/auth';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {get_profile, modify_profile} from '../utils/http_functions';
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
    fontFamily: "Avenir"
};

@connect(mapStateToProps, mapDispatchToProps)

export default class Profile extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.state = {
            id:null,
            username:null,
            email:null,
            created_at:null,
            new_username:null,
        };
        this.display_profile()
    }
    
    
    handleMessageSubmit(){
        if (this.state.new_username) {
            if(this.state.new_username==this.state.username){
                alert("Why you changing to the original ones? Input something new!")
            }
            else{
                this.change_profile()
                console.log(this.state.username) 
                // console.log(this.state.username)
            }
        }
        else{
            alert('Input must not be empty');
        }

        
      }
    
    async change_profile(){
        modify_profile(this.state.new_username);
        get_profile().then(response =>{
            this.setState({id:response.data.results["user_id"],username: response.data.results["username"],email:response.data.results["email"],created_at:response.data.results["created_at"]});
        })
           
    }
    
    display_profile(){
        get_profile().then(response =>{
            this.setState({id:response.data.results["user_id"],username: response.data.results["username"],email:response.data.results["email"],created_at:response.data.results["created_at"]});
        })
    }
    // _handleKeyPress(e) {
    //     if (e.key == 'Enter') {
    //         this.handleMessageSubmit();
    //     }
    // }
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
                        <h2>  ID: {this.state.id}</h2>
                        <h2>  Username: {this.state.username}</h2>
                        <h2>  Email address: {this.state.email}</h2>
                        <h2>  Account created at: {this.state.created_at}</h2>
                        <div className="text-center">
                            <div className="col-md-12">
                                <TextField
                                hintText="Enter new user name"
                                floatingLabelText="New user name"
                                type="content"
                                errorText={null}
                                onChange={(e) => this.setState({new_username: e.target.value})}
                                />
                            </div>
                            <div>
                                <RaisedButton
                                    style={{ marginTop: 50 }}
                                    label="submit change of profile"
                                    onClick={() => this.handleMessageSubmit()}
                                />
                            </div>
                        </div>
                        </div>
                    </Paper>
                </div>
                <div className="col-md-3  col-md-offset-1">
                    <Paper style={style}>
                        <div className="text-center">
                            <div>
                                <RaisedButton
                                    style={{ marginTop: 50 }}
                                    label="Change Password"
                                    onClick={() => browserHistory.push("/change_password")}
                                />
                            </div>
                        </div>
                    </Paper>
                </div>
                
            </div>
        );
    }
}

