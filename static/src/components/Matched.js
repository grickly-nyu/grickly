import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/auth';
import Paper from 'material-ui/Paper';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import CircularProgress  from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';
import { browserHistory } from 'react-router';

import { join_chatroom } from '../utils/http_functions'; 


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



const nameStyle = {
    fontFamily: "Avenir",
    paddingLeft: '5%',
    color: '#F5FFFA',
    fontWeight: 550,
};

const style = {
    marginTop: 400,
    paddingTop: 40,
    paddingBottom: 50,
    outerHeight:300,
    width: '70%',
    textAlign: 'center',
    display: 'inline-block',
    color: "white",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    fontFamily: "Avenir",
};

const style2 = {
    marginTop: 20,
    paddingTop: 15,
    paddingBottom: 20,
    innerHeight:20,
    width: '30%',
    textAlign: 'center',
    display: 'inline-block',
    color: "#ff2a6d",
    fontSize: "32px",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    fontFamily: "Avenir",
};

@connect(mapStateToProps, mapDispatchToProps)

export default class Matched extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        var suggested_rooms = null
        var query_tag = null
        var index = 0
        try {
            suggested_rooms = this.props.location.state.suggested_rooms;
            query_tag = this.props.location.state.query_tag;
        }
        catch(err){
            console.log();
        }
        this.state = {
            query_tag: query_tag,
            loading: false,
            cur_index: 0,
            suggested_rooms: suggested_rooms,
            // cur_members: suggested_rooms[cur_index].members,
        };

    }
    
    handleDecline(){
        var count = Object.keys(this.state.suggested_rooms).length
        console.log("declining!")
        console.log(count)
        console.log(this.state.cur_index)
        if (this.state.cur_index != (count - 1) ) {
            this.setState({
                cur_index: this.state.cur_index + 1,
            }) 
        }
        return 
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
        const value = e.target.value;
        if (e.target.value.length > 10){
            return 
            // long tags are not allowed 
        }
        console.log(value)
        const next_state = {};
        next_state[type] = value;
        this.setState(next_state)
    }

    render() {
        if (this.state.loading) {
            return (
                <div>
                <CircularProgress />
                   {"Loading..."}
                <CircularProgress color="secondary" />
                </div>
            );
        }
        // if (!this.state.suggested_rooms.length) {
        //     return <div>Didn't get a room</div>;
        // }
        return (
            <div style={{ fontFamily: "Avenir" }}>
                {/* <div style={sideStyle}>
                <div style={{ width:'100%' }}> */}
                    {/* {this.state.suggested_rooms.map(room => (
                        <div 
                        key={room.room_id}
                        onClick={() => this.go_chatroom(room.room_id,room.name)}
                        style={groupStyle}>
                            <p className='text-center'>{room.name}</p>
                        </div>
                    ))} */}
                {/* </div> */}
            {/* </div> */}
            <div className="col-md-9  col-md-offset-3">
                <Paper style={style}>
                <h2 style={{fontWeight: 500}}>{this.state.query_tag}</h2>

                <div className="col-md-12">
                <Card>
                        <CardHeader
                        title= {this.state.suggested_rooms[this.state.cur_index].name}
                        titleStyle= {style2}
                        subtitle = {()=> ",".join.get_room_members(this.state.suggested_rooms[this.state.cur_index].room_id)}
                        actAsExpander={true}
                        showExpandableButton={true}
                        />
                        <CardText expandable={true}>
                       More information to be added 
                        </CardText>
                
                    </Card>
                    </div>

                    <div className="text-center">
                        <div className="col-md-15">
                            <RaisedButton
                            style={{ marginTop: 250, 
                                margin: 50, marginRight: 520, }}
                            label="Accept"
                            onClick={() => this.go_chatroom(this.state.suggested_rooms[this.state.cur_index].room_id,
                                this.state.suggested_rooms[this.state.cur_index].name
                                                                            )}
                            />
                            <RaisedButton
                                style={{ marginTop: 250, 
                                    marginInline: 50, }}
                            label="Decline"
                            onClick={() => this.handleDecline()}
                            />
                        </div>
                    </div>
                </Paper>
            </div>
            </div>
        );
    }
}