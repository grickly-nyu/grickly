import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import * as actionCreators from '../actions/auth';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import { get_event, get_messages, get_chatrooms, get_room_members, leave_group, delete_messages, delete_group, delete_event } from '../utils/http_functions';
import io from 'socket.io-client';

function mapStateToProps(state) {
    return {
        isRegistering: state.auth.isRegistering,
        registerStatusText: state.auth.registerStatusText,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

const socket = io(`http://${window.location.hostname}:5000`);
const sideStyle = {
    fontFamily: "Avenir",
    marginTop: 55,
    width: "20%",
    height: "100vh",
    position: "fixed",
    display: "flex",
    justifyContent: "center",
};

const roomStyle = {
    fontFamily: "Avenir",
    marginTop: 64,
    marginLeft: "20%",
    paddingLeft: "5%",
    paddingTop: 20,
    width: "65%",
    height: "100vh",
    position: "fixed",
    display: "flex",
    overflow: "auto",
    color: "black",
};

const nameStyle = {
    fontFamily: "Avenir",
    color: "#77428D",
    fontWeight: 900,
    marginBottom: 20,
};

const textStyle = {
    fontFamily: "Avenir",
    position: "fixed",
    width: "50%",
    bottom: 20,
    backgroundColor: "#FFFFFB"
};

const listStyle = {
    marginTop: 64,
    marginLeft: '85%',
    width: '15%',
    height: '100vh',
    position: 'fixed',
    justifyContent: 'center',
    display: 'flex',
    color: "white",
};

@connect(mapStateToProps, mapDispatchToProps)

export default class Chatroom extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props)
        var room_id = null
        var room_name = null
        try {
            room_id = this.props.location.state.room_id;
            room_name = this.props.location.state.name;
        }
        catch(err){
            console.log();
        }
        this.state = {
            room_id: room_id,
            room_name: room_name,
            content: "",
            messages: [],
            rooms: [],
            loading: true,
            users: [],
            event: "",
        };
        socket.on('server message', (msg) => {
            this.updateMessages(msg);
        });
    }
    
    async componentDidMount() {
        get_chatrooms().then(response =>{
            this.setState({
                rooms: response.data.results,
                loading: false,
            })
            if (response.data.results.length > 0){
                if (!this.state.room_id){
                    this.setState({
                        room_id: response.data.results[0].room_id,
                        room_name: response.data.results[0].name,
                    }, this.loadInformation);
                }
                else{
                    this.setState({},this.loadInformation)
                }
            }
            
        })
    }

    loadInformation(){
        get_messages(this.state.room_id).then(response =>{
            this.setState({
                messages: response.data.results,
                loading: false
            });
        });
        get_room_members(this.state.room_id).then(response =>{
            this.setState({
                users: response.data.results,
            });
        });
        get_event(this.state.room_id).then(response =>{
            this.setState({
                event: response.data.results
            })
        });
    }

    dispatchNewRoute(route) {
        browserHistory.push(route);
        this.setState({
            open: false,
        });
    }

    
    updateMessages(message){
        let currentMessages = this.state.messages;
        if (message.room_id == this.state.room_id){
            currentMessages.push({content: message.content, username: message.username});
            this.setState({
                messages: currentMessages,
            });
        }
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
        this.setState({
            room_id: room.room_id,
            room_name: room.name,
        });
        get_messages(room.room_id).then(response =>{
            this.setState({
                messages: response.data.results,
                loading: false,
            });
        });
        get_room_members(room.room_id).then(response =>{
            this.setState({
                users: response.data.results,
            });
        });
        get_event(room.room_id).then(response =>{
            this.setState({
                event: response.data.results
            })
        });
    }

    leaveRoom(room_id){
        leave_group(room_id);
        get_room_members(room_id).then(response =>{
            if(response.data.results.length == 0){
                delete_event(room_id).then(response =>{
                    delete_messages(response.data.results).then(response =>{
                        delete_group(response.data.results);
                    });
                })
                
            }
        });
        get_chatrooms().then(response =>{
            if(response.data.results.length == 0){
                this.setState({
                    room_id: "",
                    room_name: "",
                    content: "",
                    messages: [],
                    rooms: [],
                    users: [],
                    event: "",
                })
                return
            } 
            this.setState({
                rooms: response.data.results,
                room_id: response.data.results[0].room_id,
                room_name: response.data.results[0].name,
                loading: false,
            });
            get_messages(response.data.results[0].room_id).then(response =>{
                this.setState({
                    messages: response.data.results,
                    loading: false,
                });
            });
            get_room_members(response.data.results[0].room_id).then(response =>{
                this.setState({
                    users: response.data.results,
                });
            });
        });
        if (this.state.rooms.length>0){
            this.switchRoom(this.state.rooms[0])
            this.dispatchNewRoute('/chatroom')
        }
        else{
            this.dispatchNewRoute('/chatroom')
        }
            
    }

    render() {
        return (
            <div style={{ fontFamily: "Avenir" }}>
                <Paper style={sideStyle}>
                    <List style={{ width:'100%' }}>
                        {this.state.rooms.map(room => (
                            <ListItem 
                            key={room.room_id}
                            onClick={() => this.switchRoom(room)}
                            primaryText={room.name}
                            secondaryText={
                                <p>
                                    <span style={{color: darkBlack}}>{room.name}</span> <br />
                                    {this.state.messages.content}
                                </p>
                            }
                            />
                        ))}
                    </List>
                </Paper>
                <Paper style={roomStyle}>
                    <div onKeyPress={(e) => this._handleKeyPress(e)}>
                        <div style={{width: "100%", addingBottom: '130px'}}>
                            <h2 style={nameStyle}>Chatroom {this.state.room_name}</h2>   
                            <div>{this.state.event.event_name} {this.state.event.location}</div> 
                            <div>From {this.state.event.start_time}</div>
                            <div>To {this.state.event.end_time}</div>
                            <div>{this.state.event.description}</div>
                            <RaisedButton
                                style={{ marginTop: 30 }}
                                label={"leave"}
                                onClick={() => this.leaveRoom(this.state.room_id)}
                            />
                            {this.state.messages.map(message => (
                                <div
                                key={message.sendTime+'-'+message.content}
                                >
                                    <p style={{ width: '300px' }}>
                                        <b style={{ color: "#FFB11B" }}>{message.username}: </b>
                                        {message.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <TextField
                            underlineFocusStyle={{borderColor: "#FFB11B"}}
                            floatingLabelFocusStyle={{color: "#FFB11B"}}
                            hintText="Start chating!"
                            floatingLabelText="text"
                            type="content"
                            errorText={null}
                            style={textStyle}
                            onChange={(e) => this.setState({content: e.target.value})}
                            />
                    </div>
                </Paper>
                <div style={listStyle} className='text-center'>
                    <div>
                        {this.state.users.map(user => (
                            <div key={user.user_id}>
                                <RaisedButton
                                style={{ marginTop: 30 }}
                                label={user.username}
                                // onClick={() => this.switchRoom(room)}
                                />
                            </div>
                        ))}
                    </div>
                </div>              
            </div>
        );
    }
}


