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
    fontWeight: 550,
    fontSize: "45px",
    fontFamily: "Avenir",
}

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
            if (this.state.new_username == this.state.username) {
                alert("Why you changing to the original user name? Input something new!")
            }
            else{
                this.change_profile()
                console.log(this.state.username) 
            }
        }
        else{
            alert('Input must not be empty');
        }
      }

    handleChangeUsername = (e) => {
        const value = e.target.value;
        this.setState({
            new_username: value,
        }); 
    }

    async change_profile(){
        modify_profile(this.state.new_username);
        get_profile().then(response =>{
            this.setState({
                id:response.data.results["user_id"],
                username: response.data.results["username"],
                email: response.data.results["email"],
                created_at: response.data.results["created_at"],
            });
        })
           
    }
    
    display_profile(){
        get_profile().then(response =>{
            this.setState({
                id:response.data.results["user_id"],
                username: response.data.results["username"],
                email:response.data.results["email"],
                created_at:response.data.results["created_at"],
                new_username: response.data.results["username"],
            });
        })
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
                    <h2 style={titleStyle}>Profile</h2>
                    <p style={{color: "#91989F"}}>
                        You can change your user name here.
                    </p>
                    <br />
                    <p style={{fontSize: "20px", fontWeight: 450}}>
                        <b style={{color: "#77428D"}}>ID: </b> {this.state.id}
                        <br />
                        <b style={{color: "#77428D"}}>User name: </b>
                        <TextField
                            id="text-field-controlled"
                            underlineFocusStyle={{ borderColor: "#FFB11B" }}
                            floatingLabelFocusStyle={{ color: "#FFB11B" }}
                            hintText="Enter new user name"
                            value={this.state.new_username}
                            onChange={this.handleChangeUsername}
                            style={{fontSize: "18px", fontWeight: 450}}
                        />
                        <br />
                        <b style={{color: "#77428D"}}>Email address: </b>{this.state.email}
                        <br />
                        <b style={{color: "#77428D"}}>Account created at: </b>{this.state.created_at} <br />
                    </p>
                    <div className="text-center">
                        <RaisedButton
                            style={{ marginTop: 50, marginRight: 50 }}
                            labelColor="#FFB11B"
                            label="submit change of profile"
                            onClick={() => this.handleMessageSubmit()}
                        />
                        <RaisedButton
                            style={{ marginTop: 35 }}
                            label="Change Password"
                            labelColor="#8B81C3"
                            onClick={() => browserHistory.push("/change-password")}
                        />
                    </div>
                </Paper>           
            </div>
        );
    }
}

