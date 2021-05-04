import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';

import * as actionCreators from '../actions/auth';
import {create_group} from '../utils/http_functions';

function mapStateToProps(state) {
    return {
        isRegistering: state.auth.isRegistering,
        registerStatusText: state.auth.registerStatusText,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

const Emoji = props => (
    <span
        className="emoji"
        role="img"
        aria-label={props.label ? props.label : ""}
        aria-hidden={props.label ? "false" : "true"}
    >
        {props.symbol}
    </span>
);

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
        const redirectRoute = '/createevent';
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

    handleTagChange = (event, index, value) =>{
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
            <div className="container" onKeyPress={(e) => this._handleKeyPress(e)}>
                <Paper style={style}>
                    <div className="text-center">
                        <h2 style={{ fontWeight: 900 }}>Create a new group! <Emoji symbol="💓"/></h2>
                        <TextField
                            inputStyle = {styles.vStyle}
                            hintText="Group name"
                            hintStyle={styles.pStyle}
                            floatingLabelText="Group name"
                            floatingLabelStyle={styles.floatingLabelStyle}
                            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                            underlineFocusStyle={styles.underlineFocusStyle}
                            type="name"
                            errorText={null}
                            onChange={(e) => this.changeValue(e, 'name')}
                        />
                        <br />
                        <DropDownMenu
                            selectedMenuItemStyle={{color: "#FFB11B"}}
                            labelStyle={{color: "#FFB11B"}}
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
                        <br />
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
