/* eslint camelcase: 0, no-underscore-dangle: 0 */

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import { create_event, create_group} from '../utils/http_functions';
import { browserHistory } from 'react-router';
import * as actionCreators from '../actions/auth';

function mapStateToProps(state) {
    return {
        isRegistering: state.auth.isRegistering,
        registerStatusText: state.auth.registerStatusText,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

const style = {
    marginTop: 230,
    paddingTop: 25,
    paddingBottom: 40,
    width: '100%',
    textAlign: 'center',
    display: 'inline-block',
    color: "#77428D",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    fontFamily: "Avenir",
};

const moment = require('moment');

const styles = {
    errorStyle: {
      color: "#77428D",
    },
    underlineStyle: {
      borderColor: "#77428D",
    },
    floatingLabelStyle: {
      color: "#77428D",
    },
    floatingLabelFocusStyle: {
      color: "#77428D",
    },
  };

@connect(mapStateToProps, mapDispatchToProps)
export default class CreateGroup extends React.Component {

    constructor(props) {
        super(props);
        const redirectRoute = '/chatroom';
        this.state = {
            name: '',
            tag: '',
            redirectTo: redirectRoute,
            disabled: true,
            event_name: '',
            location: '',
            start_date: null,
            start_time: null,
            end_date: null,
            end_time: null,
            description: '',
        };
    }

    isDisabled() {
        if (this.state.name && this.state.tag) {
            this.setState({
                disabled: false,
            });
        }
        else{
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

    handleTagChange = (event, index, value) =>{
        this.setState({tag:value}, ()=>{
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
            if (!this.state.disabled) {
                this.createGroup(e);
            }
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
        }, ()=>{console.log(this.state.start_time, this.state.end_time)})
    }
    
    createGroup(e) {
        e.preventDefault();
        this.mergeDatetime();
        create_group(this.state.name, this.state.tag).then(response =>{
            var path = {
                pathname: this.state.redirectTo,
                state: {
                    room_id: response.data.results,
                    name: this.state.name,
                },
            }
            create_event(
                response.data.results, 
                this.state.event_name, 
                this.state.location, 
                this.state.start_time, 
                this.state.end_time, 
                this.state.description)
            this.dispatchNewRoute(path)
        });
        
 
    }

    render() {
        return (
            <div className="col-md-6 col-md-offset-3" onKeyPress={(e) => this._handleKeyPress(e)}>
                <Paper style={style}>
                    <div className="text-center">
                        <h2 style={{fontWeight: 500}}>Create a new group!</h2>
                        <div className="col-md-12">
                            <TextField
                              inputStyle = {styles.errorStyle}
                              hintText="Group name"
                              hintStyle={styles.errorStyle}
                              floatingLabelText="Group name"
                              floatingLabelStyle={styles.floatingLabelStyle}
                              type="name"
                              errorText={null}
                              onChange={(e) => this.changeValue(e, 'name')}
                            />
                        </div>
                        <div className="col-md-12">
                            <DropDownMenu 
                                value={this.state.tag}
                                onChange={this.handleTagChange}
                                autoWidth={false}
                                >
                                <MenuItem value={""} primaryText="Group tag"  />
                                <MenuItem value={"Poker"} primaryText="Poker" />
                                <MenuItem value={"Outdoor"} primaryText="Outdoor" />
                                <MenuItem value={"Study"} primaryText="Study" />
                                <MenuItem value={"Party"} primaryText="Party" />
                            </DropDownMenu>
                        </div>
                        <div className="col-md-12">
                            <TextField
                              inputStyle = {styles.errorStyle}
                              hintText="Event title"
                              hintStyle={styles.errorStyle}
                              floatingLabelText="Event title"
                              floatingLabelStyle={styles.floatingLabelStyle}
                              type="event_name"
                              errorText={null}
                              onChange={(e) => this.changeValue(e, 'event_name')}
                            />
                        </div>
                        <div className="col-md-12">
                            <TextField
                              inputStyle = {styles.errorStyle}
                              hintText="Event Location"
                              hintStyle={styles.errorStyle}
                              floatingLabelText="Event Location"
                              floatingLabelStyle={styles.floatingLabelStyle}
                              type="location"
                              errorText={null}
                              onChange={(e) => this.changeValue(e, 'location')}
                            />
                        </div>
                        <div className="col-md-12">
                            <DatePicker 
                                hintText="Event Start Date" 
                                hintStyle={styles.errorStyle}
                                inputStyle = {styles.errorStyle}
                                onChange={(event, value) => this.handleDatetimeChange(event, value, 'start_date')}
                            />
                            <TimePicker hintText="Event Start Time" 
                                hintStyle={styles.errorStyle}
                                inputStyle = {styles.errorStyle}
                                onChange={(event, value) => this.handleDatetimeChange(event, value, 'start_time')}
                            />
                        </div>
                        <div className="col-md-12">
                            <DatePicker 
                                hintStyle={styles.errorStyle}
                                inputStyle = {styles.errorStyle}
                                hintText="Event End Date" 
                                onChange={(event, value) => this.handleDatetimeChange(event, value, 'end_date')}
                            />
                            <TimePicker hintText="Event End Time" 
                                hintStyle={styles.errorStyle}
                                inputStyle = {styles.errorStyle}
                                onChange={(event, value) => this.handleDatetimeChange(event, value, 'end_time')}
                            />
                        </div>
                        <div className="col-md-12">
                            <TextField
                              inputStyle = {styles.errorStyle}
                              hintText="Event Description"
                              hintStyle={styles.errorStyle}
                              floatingLabelText="Event Description"
                              floatingLabelStyle={styles.floatingLabelStyle}
                              type="description"
                              errorText={null}
                              onChange={(e) => this.changeValue(e, 'description')}
                            />
                        </div>

                        <RaisedButton
                          disabled={this.state.disabled}
                          style={{ marginTop: 50 }}
                          label="Submit"
                          onClick={(e) => this.createGroup(e)}
                        />

                    </div>
                </Paper>

            </div>
        );

    }
}
