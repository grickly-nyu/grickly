import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import * as actionCreators from '../actions/auth';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { get_messages, get_chatrooms, get_room_members, leave_group, delete_messages, delete_group } from '../utils/http_functions';
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
    paddingTop: 30,
    paddingBottom: 35,
    backgroundColor: "rgba(255, 255, 255, 0.10)",
};
const roomStyle = {
    fontFamily: "Avenir",
    marginTop: 64,
    marginLeft: '20%',
    paddingLeft: '5%',
    paddingTop: 20,
    width: '65%',
    height: '100vh',
    position: 'fixed',
    display: 'flex',
    overflow: 'auto',
    color: 'white',
    backgroundColor: "rgba(255, 255, 255, 0.25)",
};
const nameStyle = {
    fontFamily: "Avenir",
    paddingLeft: '5%',
    color: '#ff2a6d',
    fontWeight: 550,
};
const textStyle = {
    fontFamily: "Avenir",
    position: 'fixed',
    width: '50%',
    bottom: 0,
    backgroundColor: "#414260"
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
        };
        socket.on('server message', (msg) => {
            this.updateMessages(msg);
        });
    }
    
    async componentDidMount() {
        get_chatrooms().then(response =>{
            if (this.state.room_id){
                this.setState({
                    rooms: response.data.results,
                    loading: false,
                });
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
            }
            else{
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
            }
        })
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
    }

    leaveRoom(room_id){
        leave_group(room_id);
        get_room_members(room_id).then(response =>{
            console.log(response.data.results.length)
            if(response.data.results.length == 0){
                delete_messages(room_id).then(response =>{delete_group(response.data.results);});
            }
        });
        get_chatrooms().then(response =>{
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
        this.dispatchNewRoute('/chatroom')
    }

    render() {
        return (
            <div style={{ fontFamily: "Avenir" }}>
                <div style={sideStyle}>
                    <div style={{ width:'100%' }}>
                        {this.state.rooms.map(room => (
                            <div 
                            key={room.room_id}
                            onClick={() => this.switchRoom(room)}
                            style={groupStyle}>
                                <p className='text-center'>{room.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={roomStyle}>
                    <div onKeyPress={(e) => this._handleKeyPress(e)}>
                        <div style={{paddingBottom: '130px'}}>
                            <h2 style={nameStyle}>{this.state.room_name}
                            <RaisedButton
                                style={{ marginTop: 30 }}
                                label={"leave"}
                                onClick={() => this.leaveRoom(this.state.room_id)}
                            />
                            </h2>
                            {this.state.messages.map(message => (
                                <div
                                key={message.sendTime+'-'+message.content}
                                >
                                    <p>
                                        <b style={{ width: '300px', color: "#05d9e8"}}>{message.username}: </b>
                                        {message.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <TextField
                        hintText="text"
                        value={this.state.content}
                        floatingLabelText="text"
                        type="content"
                        errorText={null}
                        style={textStyle}
                        onChange={(e) => this.setState({content: e.target.value})}
                        />
                    </div>
                </div>
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


