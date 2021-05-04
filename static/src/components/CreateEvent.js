import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

import * as actionCreators from '../actions/auth';
import { create_event} from '../utils/http_functions';

function mapStateToProps(state) {
    return {
        isRegistering: state.auth.isRegistering,
        registerStatusText: state.auth.registerStatusText,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

const moment = require('moment');
const style = {
    marginTop: 150,
    paddingTop: 25,
    paddingBottom: 40,
    width: "100%",
    color: "#77428D",
    backgroundColor: "white",
    fontFamily: "Avenir",
};
const styles = {
    pStyle: {
        color: "#91989F",
    },
    vStyle: {
        color: "black",
    },
    underlineStyle: {
        borderColor: "#77428D",
    },
    underlineFocusStyle: {
        borderColor: "#FFB11B", 
    },
    floatingLabelFocusStyle: {
        color: "#FFB11B",
    },
  };

@connect(mapStateToProps, mapDispatchToProps)
export default class CreateGroup extends React.Component {
    constructor(props) {
        super(props);
        var room_id = null
        var room_name = null
        try {
            room_id = this.props.location.state.room_id;
            room_name = this.props.location.state.name;
        }
        catch(err){
            console.log(err);
        }
        const redirectRoute = '/chatroom';
        this.state = {
            room_id: room_id,
            room_name: room_name,
            redirectTo: redirectRoute,
            event_name: '',
            location: '',
            start_date: null,
            start_time: null,
            end_date: null,
            end_time: null,
            description: '',
            disabled: true,
        };
    }

    isDisabled() {
        if (this.state.event_name) {
            this.setState({
                disabled: false,
            });
        }
        else {
            this.setState({
                disabled: true,
            });
        }
    }

    dispatchNewRoute(route) {
        browserHistory.push(route);
        this.setState({
            open: false,
        });
    }

    changeValue(e, type) {
        const value = e.target.value;
        const next_state = {};
        next_state[type] = value;
        this.setState(next_state, () => {
            this.isDisabled();
        });
    }
    
    handleDatetimeChange(event, value, type){
        const next_state = {};
        next_state[type] = value;
        this.setState(next_state)
    }

    _handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.createEvent(e);
        }
    }

    mergeDatetime(){
        let momentTime = moment(this.state.start_time);
        let momentDate = moment(this.state.start_date);
        let start_time = moment({
            year: momentDate.year(),
            month: momentDate.month(),
            day: momentDate.date(),
            hour: momentTime.hours(),
            minute: momentTime.minutes()
        });
        momentTime = moment(this.state.end_time);
        momentDate = moment(this.state.end_date);
        let end_time = moment({
            year: momentDate.year(),
            month: momentDate.month(),
            day: momentDate.date(),
            hour: momentTime.hours(),
            minute: momentTime.minutes()
        });
        this.setState({
            start_time: start_time,
            end_time: end_time
        })
    }
    
    createEvent(e, empty = false) {
        e.preventDefault();
        this.mergeDatetime();
        var path = {
            pathname: this.state.redirectTo,
            state: {
                room_id: this.state.room_id,
                name: this.state.room_name,
            },
        }
        if (empty) {
            create_event(
                null,
                null,
                null,
                null,
                null,
                null
            )
        }
        else {
            create_event(
                this.state.room_id, 
                this.state.event_name, 
                this.state.location, 
                this.state.start_time, 
                this.state.end_time, 
                this.state.description
            )
        }
        this.dispatchNewRoute(path);
    }

    render() {
        return (
            <div className="container" onKeyPress={(e) => this._handleKeyPress(e)}>
                <Paper style={style}>
                    <div className="text-center">
                        <h2 style={{ fontWeight: 900 }}>Create an event for your group!</h2>
                        <TextField
                            inputStyle = {styles.vStyle}
                            hintText="Event title"
                            hintStyle={styles.pStyle}
                            floatingLabelText="Event title"
                            floatingLabelStyle={styles.floatingLabelStyle}
                            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                            underlineFocusStyle={styles.underlineFocusStyle}
                            type="event_name"
                            errorText={null}
                            onChange={(e) => this.changeValue(e, 'event_name')}
                        />
                        <br />
                        <TextField
                            inputStyle = {styles.vStyle}
                            hintText="Event Description"
                            hintStyle={styles.pStyle}
                            floatingLabelText="Event Description"
                            floatingLabelStyle={styles.floatingLabelStyle}
                            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                            underlineFocusStyle={styles.underlineFocusStyle}
                            type="description"
                            errorText={null}
                            onChange={(e) => this.changeValue(e, 'description')}
                        />
                        <br />
                        <TextField
                            inputStyle = {styles.vStyle}
                            hintText="Event Location"
                            hintStyle={styles.pStyle}
                            floatingLabelText="Event Location"
                            floatingLabelStyle={styles.floatingLabelStyle}
                            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                            underlineFocusStyle={styles.underlineFocusStyle}
                            type="location"
                            errorText={null}
                            onChange={(e) => this.changeValue(e, 'location')}
                        />
                        <br />
                        <DatePicker 
                            hintText="Event Start Date" 
                            hintStyle={styles.pStyle}
                            inputStyle = {styles.vStyle}
                            onChange={(event, value) => this.handleDatetimeChange(event, value, 'start_date')}
                        />
                        <TimePicker
                            hintText="Event Start Time" 
                            hintStyle={styles.pStyle}
                            inputStyle = {styles.vStyle}
                            onChange={(event, value) => this.handleDatetimeChange(event, value, 'start_time')}
                        />
                        <DatePicker
                            hintText="Event End Date" 
                            hintStyle={styles.pStyle}
                            inputStyle = {styles.vStyle}
                            onChange={(event, value) => this.handleDatetimeChange(event, value, 'end_date')}
                        />
                        <TimePicker
                            hintText="Event End Time" 
                            hintStyle={styles.pStyle}
                            inputStyle = {styles.vStyle}
                            onChange={(event, value) => this.handleDatetimeChange(event, value, 'end_time')}
                        />
                        <br />
                        <RaisedButton
                            style={{ marginTop: 50 }}
                            disabled={this.state.disabled}
                            label="Submit"
                            onClick={(e) => this.createEvent(e)}
                        />
                        <RaisedButton
                            style={{ marginLeft: 50, marginTop: 50 }}
                            label="Skip"
                            onClick={(e) => this.createEvent(e, true)}
                        />
                    </div>
                </Paper>
            </div>
        );
    }
}
