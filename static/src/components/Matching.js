import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/auth';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

import CircularProgress  from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';
import { browserHistory } from 'react-router';

import { join_chatroom } from '../utils/http_functions'; 
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
    marginTop: 440,
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
            suggested_rooms: [{room_id:"24",name:"room 10"},
                            {room_id:"26",name:"study"},
                            {room_id:"27",name:"Poker"}],
        };
    }

    // progress(props) {
    //     return (
    //         <React.Fragment>
    //         <CircularProgress variant="determinate" value={props.value} />
    //         <LinearProgress variant="determinate" value={props.value} />
    //         </React.Fragment>
    //     )
    // }

    handleSubmit(tag){
        this.setState({query_tag: tag})
        console.log("query_tag:",this.query_tag)
        get_suggestions(tag).then(response =>{
            var rooms = response.data.results
            this.setState({ 
                query_tag: '' , 
                loading: false, 
                suggested_rooms: rooms, });
            console.log(rooms)
        })

        // else{
        //     alert('Input must not be empty');
        //     return 
        // }
      }

    dispatchNewRoute(route) {
        browserHistory.push(route);
        this.setState({
            open: false,
        });
    }

    go_chatroom(room_id, room_name){
        join_chatroom(room_id)

        console.log(this.state)
        var state_data = {room_id: room_id, name: room_name}
        var path = {
            pathname:'/chatroom',
            state: state_data,
        }
        this.dispatchNewRoute(path)
    }

    // for text box input only
    // actually not really need this. after text box input then submit button
    _handleKeyPress(e) {
        if (e.key == 'Enter') {
            this.handleSubmit();
        }
    }


    changeValue(e, type) {
        // if (e.target.value.length > 10){
        //     return 
        //     // long tags are not
        // }
        const next_state = {};
        next_state[type] = e.target.value;
        this.setState(next_state, () => {
            this.isDisabled();
        });
    }

    render() {
        return (
            <div style={{ fontFamily: "Avenir" }}>
                <div style={sideStyle}>
                    <div style={{ width:'100%' }}>
                        {this.state.suggested_rooms.map(room => (
                            <div 
                            key={room.room_id}
                            onClick={() => this.go_chatroom(room.room_id,room.name)}
                            style={groupStyle}>
                                <p className='text-center'>{room.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
         
            <div className="col-md-4  col-md-offset-5">
                    <Paper style={style}>
                        <div className="text-center">
                            <div className="col-md-12">
                                <RaisedButton
                                    style={{ marginTop: 50 }}
                                label="life"
                                onClick={() => this.handleSubmit("life")}
                                />
                                <RaisedButton
                                    style={{ marginTop: 50 }}
                                label="poker"
                                onClick={() => this.handleSubmit("Poker")}
                                />
                                <RaisedButton
                                    style={{ marginTop: 50 }}
                                label="study"
                                onClick={() => this.handleSubmit("study")}
                                />
                            </div>
                            <div>
                                <TextField
                                    floatingLabelText="Or type your tag here"
                                    type="text"
                                    errorText={null}
                                onChange={(e) => this.changeValue(e,"text")}
                                />
                                 <RaisedButton
                                    disabled={this.state.disabled}
                                    style={{ marginTop: 60 }}
                                    label="Submit"
                                    onClick={(e) => this.handleSubmit(this.query_tag)}
                                />  
                            </div>
                        </div>

                        <CircularProgress />
                           {"Loading..."}
                        <CircularProgress color="secondary" />
                        <div>
                    </div>
                    </Paper>
                </div>
            </div>
        );
    }
}
