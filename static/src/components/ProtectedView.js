import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FlatButton from 'material-ui/FlatButton';
import * as actionCreators from '../actions/data';
import { browserHistory } from 'react-router';

const style = {
    paddingTop: 200,
    color: "#ff2a6d",
    fontFamily: "Avenir",
}

const titleStyle = {
    fontWeight: 550,
    fontSize: "50px",
    fontFamily: "Avenir",
}

const pStyle = {
    color: "white",
    fontSize: "20px",
    fontFamily: "Avenir",
    marginBottom: "40px"
}

const buttonStyle = {
    color: "#05d9e8",
    marginRight: "40px"
}

const buttonStyle2 = {
    color: "red",
}

function mapStateToProps(state) {
    return {
        data: state.data,
        token: state.auth.token,
        loaded: state.data.loaded,
        isFetching: state.data.isFetching,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ProtectedView extends React.Component {
    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        const token = this.props.token;
        this.props.fetchProtectedData(token);
    }

    dispatchNewRoute(route) {
        browserHistory.push(route);
        this.setState({
            open: false,
        });
    }

    render() {
        return (
            <div style={style}>
                {!this.props.loaded
                    ? <h1>Loading data...</h1>
                    :
                    <div className="container">
                        <p style={titleStyle}>Welcome back to Grickly,
                            {this.props.userName}!</p>
                        <p style={pStyle}>Are you ready to find your buddies?</p>
                        <FlatButton style={buttonStyle} label="Yes! Start matching now!" 
                            onClick={(e) => this.dispatchNewRoute("/matching")}/>
                        <FlatButton style={buttonStyle2}
                            label="Nah, let me create a group!"
                            onClick={(e) => this.dispatchNewRoute("/creategroup")}/>
                    </div>
                }
            </div>
        );
    }
}

ProtectedView.propTypes = {
    fetchProtectedData: React.PropTypes.func,
    loaded: React.PropTypes.bool,
    userName: React.PropTypes.string,
    data: React.PropTypes.any,
    token: React.PropTypes.string,
};
