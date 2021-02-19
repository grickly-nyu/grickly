import React from 'react';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/auth';
import 'regenerator-runtime/runtime'
import RaisedButton from 'material-ui/RaisedButton';

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
        people: []
      };
    
    async componentDidMount() {
        const url = "api/get_chatrooms";
        const response = await fetch(url);
        const data = await response.json();
        console.log(data)
        this.setState({ people: data.results , loading: false});
    }

    dispatchNewRoute(route) {
        browserHistory.push(route);
        this.setState({
            open: false,
        });

    }

    chatroom(room_id){
        console.log(this.props)
        this.dispatchNewRoute('/chatroom/room_id')
        //this.props.room_id = room_id
    }
    
    render() {
        if (this.state.loading) {
            return <div>loading...</div>;
        }

        if (!this.state.people.length) {
            return <div>didn't get a room</div>;
        }


        return (
            <div>
            {this.state.people.map(room => (
                <div key={room.room_id}>
                    <RaisedButton
                          style={{ marginTop: 50 }}
                          label={room.name}
                          onClick={() => this.chatroom(room.room_id)}
                        />
                    <div>Room members: {room.members}</div>
   
                </div>
            ))}
            </div>
        );
    }
}

