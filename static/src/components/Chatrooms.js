import React from 'react';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/auth';
import 'regenerator-runtime/runtime'
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';
import {get_chatrooms} from '../utils/http_functions';

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        userName: state.auth.userName,
        isAuthenticated: state.auth.isAuthenticated,
        isRegistering: state.auth.isRegistering,
        registerStatusText: state.auth.registerStatusText,

    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Chatrooms extends React.Component { // eslint-disable-line react/prefer-stateless-function
    state = {
        loading: true,
        rooms: []
      };
    
    async componentDidMount() {
        get_chatrooms().then(response =>{
            this.setState({ rooms: response.data.results , loading: false});
        })
    }

    dispatchNewRoute(route) {
        browserHistory.push(route);
        this.setState({
            open: false,
        });

    }

    chatroom(room_id, room_name){
        console.log(this.state)
        var data = {room_id: room_id, room_name: room_name}
        var path = {
            pathname:'/chatroom',
            state:data,
        }
        this.dispatchNewRoute(path)
    }
    
    render() {
        if (this.state.loading) {
            return <div>loading...</div>;
        }

        if (!this.state.rooms.length) {
            return <div>didn't get a room</div>;
        }


        return (
            <div>
            {this.state.rooms.map(room => (
                <div key={room.room_id}>
                    <RaisedButton
                          style={{ marginTop: 50 }}
                          label={room.name}
                          onClick={() => this.chatroom(room.room_id, room.name)}
                        />
                    <div style={{color: "white"}}>Room members: {room.members}</div>
   
                </div>
            ))}

            </div>
     
                
            
        );
    }
}

