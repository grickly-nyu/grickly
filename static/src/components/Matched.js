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


const groupStyle = {
    color: '#ff577d',
    borderStyle: 'none none solid none',
    borderWidth: '1px',
    borderColor: '#01012b',
    paddingTop: 50,
    paddingBottom: 35,
    backgroundColor: "rgba(255, 255, 255, 0.10)",
};

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
    marginTop: 300,
    paddingTop: 25,
    paddingBottom: 50,
    innerHeight:100,
    width: '80%',
    textAlign: 'center',
    display: 'inline-block',
    color: "white",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    fontFamily: "Avenir",
};


@connect(mapStateToProps, mapDispatchToProps)

export default class Matched extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.state = {
            query_tag: 'Poker',
            loading: false,
            cur_index: 0,
            suggested_rooms: [],
            cur_room_name: "room1",
            cur_members: null,
        };
    }

    handleSubmit(){
        if (tag == ''){
            alert('Input must not be empty');
            return 
        }
        console.log('hello')
      
        get_suggestions(this.query_tag).then(response =>{
            var rooms = response.data.results
            console.log(rooms)
            this.setState({ 
                query_tag: '' , 
                loading: false, 
                suggested_rooms: rooms, });
        })
        // if (len(this.suggested_rooms) == 0) {
        //     alert (" ")
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

        //     <div className="col-md-12">
        //     <h2 style={nameStyle}>{this.state.query_tag} </h2>
        //    </div>

            <div className="col-md-9  col-md-offset-3">
                <Paper style={style}>
                <h2 style={{fontWeight: 500}}>{this.state.query_tag}</h2>

                <div className="col-md-12">
                <Card>
                       
                        <CardHeader
                        title= {this.state.cur_room_name}
                        actAsExpander={true}
                        showExpandableButton={true}
                        />

                        <CardText expandable={true}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                        Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                        Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                        </CardText>
                    

                    </Card>
                    </div>

                    <div className="text-center">

                        <div className="col-md-15">
                            <RaisedButton
                            style={{ marginTop: 250, 
                                margin: 50, marginRight: 520, }}
                            label="Accept"
                            onClick={() => this.handleSubmit("Life")}
                            />
                    
                            <RaisedButton
                                style={{ marginTop: 250, 
                                    marginInline: 50, }}
                            label="Decline"
                            onClick={() => this.handleSubmit("Study")}
                            />
                        </div>
                    </div>
                </Paper>
            </div>
        );
    }
}


//        <div style={style}>
//        {!this.props.loaded
//            ? <h1>Loading data...</h1>
//            :
//            <div className="container">
//                <p style={titleStyle}>Welcome back to Grickly,
//                    {this.props.userName}!</p>
//                <p style={pStyle}>Are you ready to find your buddies?</p>
//                <FlatButton style={buttonStyle} label="Yes! Start matching now!" 
//                    onClick={(e) => this.dispatchNewRoute("/matching")}/>
//                <FlatButton style={buttonStyle2}
//                    label="Nah, let me create a group!"
//                    onClick={(e) => this.dispatchNewRoute("/creategroup")}/>
//            </div>
//        }
//    </div>
// );


