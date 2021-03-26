import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RaisedButton from 'material-ui/RaisedButton';
import * as actionCreators from '../actions/data';
import { browserHistory } from 'react-router';

const style = {
    paddingTop: 200,
    color: "#77428D",
    fontFamily: "Avenir",
}

const titleStyle = {
    fontWeight: 900,
    fontSize: "50px",
    fontFamily: "Avenir",
}

const pStyle = {
    fontFamily: "Avenir",
    color: "#91989F",
    fontSize: "25px",
    fontWeight: 400,
    paddingBottom: "40px",
}

const buttonStyle = {
    color: "#FFB11B",
    marginRight: "40px"
}

const buttonStyle2 = {
    color: "#91989F",
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

    dispatchNewRoute(route) {
        browserHistory.push(route);
        this.setState({
            open: false,
        });
    }


    fetchData() {
        const token = this.props.token;
        this.props.fetchProtectedData(token);
    }

    render() {
        return (
            <div style={style} className="text-center">
                {!this.props.loaded
                    ? <h1>Loading data...</h1>
                    :
                    <div className="center container">
                        <p style={titleStyle}>Welcome back to Grickly, {this.props.userName}!</p>
                        <p style={pStyle}>Are you ready to find your buddies?</p>
                        <RaisedButton
                            style={buttonStyle}
                            labelColor="#FFB11B"
                            label="Yes! Start matching now!"
                            onClick={(e) => this.dispatchNewRoute("/matching")} />
                        <RaisedButton
                            style={buttonStyle2}
                            labelColor="#8B81C3"
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
