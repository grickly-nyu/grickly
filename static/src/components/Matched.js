import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import Paper from 'material-ui/Paper';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import CircularProgress  from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';

import * as actionCreators from '../actions/auth';
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

const style = {
    marginTop: 150,
    paddingTop: 40,
    paddingBottom: 50,
    outerHeight:300,
    width: "100%",
    color: "black",
    backgroundColor: "white",
};
const titleStyle = {
    padding: "30px",
    fontWeight: 900,
    color: "#77428D",
    fontSize: "32px",
};
const subStyle = {
    color: "#91989F",
    fontSize: "17px",
};

@connect(mapStateToProps, mapDispatchToProps)

export default class Matched extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        var suggested_rooms = null;
        var query_tag = null;
        try {
            suggested_rooms = this.props.location.state.suggested_rooms;
            padded_suggest_rooms = suggested_rooms.push({
                'room_id': null,
                'name' : '',
                'members': [],
            })
            query_tag = this.props.location.state.query_tag;
        }
        catch(err){
            console.log(err);
        }
        this.state = {
            query_tag: query_tag,
            loading: false,
            cur_index: 0,
            total_count: Object.keys(suggested_rooms).length,
            suggested_rooms: suggested_rooms,
        };
    }
   
    handleAccept() {
        this.go_chatroom(this.state.suggested_rooms[this.state.cur_index].room_id,
            this.state.suggested_rooms[this.state.cur_index].name);
    }
    
    handleDecline() {
        if (this.state.cur_index < (this.state.total_count - 2)) {
            this.setState({
                cur_index: this.state.cur_index + 1,
            }) 
        } else {
            alert("Suggestions end, you are going back to the first one!");
            this.setState({
                cur_index: 0,
            }) 
        }
    }

    dispatchNewRoute(route) {
        browserHistory.push(route);
        this.setState({
            open: false,
        });
    }

    go_chatroom(room_id, room_name) {
        join_chatroom(room_id);
        var state_data = {
            room_id: room_id,
            name: room_name
        };
        var path = {
            pathname:'/chatroom',
            state: state_data,
        };
        this.dispatchNewRoute(path);
    }
  
    _handleKeyPress(e) {
        if (e.key == 'Enter') {
            this.handleSubmit();
        }
    }

    render() {
        const loading = this.state.loading;
        if (loading) {
            return (
                <div>
                    <CircularProgress />
                    {"Loading..."}
                    <CircularProgress color="secondary" />
                </div>
            );
        }
        return (
            <div className="container" style={{ fontFamily: "Avenir" }}>
                <Paper style={style}>
                    <div className="text-center">
                        <h2 style={{fontWeight: 500}}>{this.state.query_tag}</h2>
                        <Card style={{width: "80%", marginLeft: "10%"}}>
                            <CardHeader
                                title= {this.state.suggested_rooms[this.state.cur_index].name}
                                titleStyle= {titleStyle}
                                subtitle = {
                                    "Members: " + this.state.suggested_rooms[this.state.cur_index].members.slice(0,10).map(name => `${name}`).join(', ') 
                                }
                                subtitleStyle={subStyle}
                                actAsExpander={false}
                                showExpandableButton={false}
                            />
                            {/* <CardText expandable={true}>
                                More information to be added. 
                            </CardText> */}
                        </Card>
                        <RaisedButton
                            style={{marginTop: 250, marginRight: 200}}
                            label="Join this group!"
                            labelColor="#FFB11B"
                            onClick={() => this.handleAccept()}
                        />
                        <RaisedButton
                            style={{marginTop: 250}}
                            labelColor="#8B81C3"
                            label="Show me another one!"
                            onClick={() => this.handleDecline()}
                        />
                    </div>
                </Paper>
                <div className="container text-center">
                    <RaisedButton
                        style={{marginTop: 35}}
                        labelColor="#91989F"
                        label="Return to matching"
                        onClick={() => this.dispatchNewRoute("/matching")}
                    />
                </div>
            </div>
        );
    }
}
