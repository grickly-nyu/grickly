import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/auth';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {send_message, get_messages, get_chatrooms, get_room_members} from '../utils/http_functions';
import axios from 'axios';
import io from 'socket.io-client'



function mapStateToProps(state) {
    return {
        isRegistering: state.auth.isRegistering,
        registerStatusText: state.auth.registerStatusText,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}
const socket = io("http://localhost:5000");
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

export default class Chatroom extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.state = {
            room_id: null,
            room_name: null,
            content: null,
            messages: [],
            rooms: [],
            loading: true,
            users: [],
        };
        socket.on('server message', (msg) => {
            this.updateMessages(msg);
        });
    }
    
    async componentDidMount() {
        get_messages(this.state.room_id).then(response =>{
            this.setState({ messages: response.data.results , loading: false});
        });
        get_chatrooms().then(response =>{
            this.setState({ rooms: response.data.results , loading: false});
        })
        // this.setState({room_id: rooms[0].room_id, room_name: rooms[0].name});

    }
    
    updateMessages(message){
    
        let currentMessages = this.state.messages;
    
        currentMessages.push({content: message.content, username: message.username});
        this.setState({messages:currentMessages});
    }

    handleMessageSubmit(e){
        e.preventDefault()
        let message = this.state.content;
        if (!message){
          alert('Message must not be empty');
          return;
        }
        socket.emit('send message', {
            content: message,
            room_id: this.state.room_id
        });
        this.setState({ content: "" }); //clear message for user after sending
      }
    
    _handleKeyPress(e) {
        if (e.key == 'Enter') {
            if (this.state.content) {
                this.handleMessageSubmit(e);
            }
            else{
                alert('Message must not be empty');
            }
        }
    }
    changeValue(e, type) {
        const value = e.target.value;
        const next_state = {};
        next_state[type] = value;
        
    }

    switchRoom(room){
        this.setState({room_id: room.room_id, room_name: room.name, users: {username: room.members}})
        get_messages(room.room_id).then(response =>{
            this.setState({ messages: response.data.results , loading: false});
        });
        get_room_members(room.room_id).then(response =>{
            this.setState({ users: response.data.results});
        })
    }
    // sendMessage() {
    //     //axios.post('api/send_message', {room_id: this.state.room_id, content: this.state.content}).then(res =>{})
    //     send_message(this.state.room_id, this.state.content)
    //     this.componentDidMount()
    // }
    render() {
        console.log(this.state.users)
        return (
            <div className = "row">
                <div className="col-md-3  col-md-offset-1">
                    <Paper style={style}>
                        <div className="text-center">
                        <h2>{this.state.room_name} Chatrooms </h2>
                        {this.state.rooms.map(room => (
                            <div key={room.room_id}>
                                <RaisedButton
                                    style={{ marginTop: 50 }}
                                    label={room.name}
                                    onClick={() => this.switchRoom(room)}
                                    />

                            </div>
                        ))}
                        </div>

                    </Paper>
                </div>
                <div className="col-md-3" onKeyPress={(e) => this._handleKeyPress(e)}>
                    
                    <Paper style={style}>
                        <div>
                        <h2>Chatroom {this.state.room_name}</h2>
                        {this.state.messages.map(message => (
                            <div key={message.sendTime}>
                                <div style={{color: "white"}}>{message.username} : {message.content}</div>
            
                            </div>
                        ))}
                        </div>

                        <div className="text-center">
                            <div className="col-md-12">
                                <TextField
                                hintText="text"
                                floatingLabelText="text"
                                type="content"
                                errorText={null}
                                onChange={(e) => this.setState({content: e.target.value})}
                                />
                            </div>

                        </div>

                    </Paper>

                </div>
                <div className="col-md-3">
                    <Paper style={style}>
                        <div className="text-center">
                        <h2>{this.state.room_name} Group members </h2>
                        {this.state.users.map(user => (
                            <div key={user.user_id}>
                                <RaisedButton
                                    style={{ marginTop: 50 }}
                                    label={user.username}
                                    onClick={() => this.switchRoom(room)}
                                />

                            </div>
                        ))}
                        </div>

                    </Paper>
                </div>
                
            </div>
        );
    }
}


