/* eslint camelcase: 0, no-underscore-dangle: 0 */

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import { create_group} from '../utils/http_functions';
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
    color: "white",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    fontFamily: "Avenir",
};

const styles = {
    errorStyle: {
      color: "white",
    },
    underlineStyle: {
      borderColor: "white",
    },
    floatingLabelStyle: {
      color: "white",
    },
    floatingLabelFocusStyle: {
      color: "white",
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
    handleChange = (event, index, value) => {
        this.setState({tag:value}, ()=>{
            this.isDisabled();
        });
    }
    _handleKeyPress(e) {
        if (e.key === 'Enter') {
            if (!this.state.disabled) {
                this.createGroup(e);
            }
        }
    }

    createGroup(e) {
        e.preventDefault();
        create_group(this.state.name, this.state.tag).then(response =>{
            var path = {
                pathname: this.state.redirectTo,
                state: {
                    room_id: response.data.results,
                    name: this.state.name,
                },
            }
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
                                
                                onChange={this.handleChange}
                                autoWidth={false}
                                >
                                <MenuItem value={""} primaryText="Group tag" />
                                <MenuItem value={"Poker"} primaryText="Poker" />
                                <MenuItem value={"Outdoor"} primaryText="Outdoor" />
                                <MenuItem value={"Study"} primaryText="Study" />
                                <MenuItem value={"Party"} primaryText="Party" />
                            </DropDownMenu>
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
