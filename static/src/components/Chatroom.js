import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/auth';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {send_message, get_messages} from '../utils/http_functions';
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
        var {room_id, room_name} = this.props.location.state
        this.state = {
            room_id: room_id,
            room_name: room_name,
            content: null,
            messages: []
        };
        socket.on('server message', (msg) => {
            this.updateMessages(msg);
        });
    }
    
    async componentDidMount() {
        get_messages(this.state.room_id).then(response =>{
            this.setState({ messages: response.data.results , loading: false});
        })
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
        console.log(message)
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
    // sendMessage() {
    //     //axios.post('api/send_message', {room_id: this.state.room_id, content: this.state.content}).then(res =>{})
    //     send_message(this.state.room_id, this.state.content)
    //     this.componentDidMount()
    // }
    render() {

        //var {room_id, room_name} = this.props.location.state
        return (
            <div className="col-md-6 col-md-offset-3" onKeyPress={(e) => this._handleKeyPress(e)}>
                
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
        );
    }
}


