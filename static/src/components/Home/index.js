import React from 'react';
import { browserHistory } from 'react-router';
import FlatButton from 'material-ui/FlatButton';

const dispatchNewRoute = (route) => {
    browserHistory.push(route);
    this.setState({
        open: false,
    });
}

const style = {
    color: "#ff2a6d",
    paddingTop: 300,
    width: '100%',
    textAlign: 'center',
};

const titleStyle = {
    fontWeight: 550,
    fontSize: "88px",
    fontFamily: "Avenir",
}

const pStyle = {
    color: "#ff577d",
    fontFamily: "Avenir",
    fontSize: "20px",
    paddingBottom: "50px",
}

const buttonStyle = {
    color: "#05d9e8", 
    marginRight: "40px"
}

const buttonStyle2 = {
    color: "#05d9e8", 
}

export const Home = () =>
    <div style={style}>
        <div className="text-center">
            <h1 style={titleStyle}>Grickly!</h1>
            <p style={pStyle}>A brand new way to enjoy life event
            </p>

            <FlatButton label="Log In" style={buttonStyle} onClick={() => dispatchNewRoute('/login')} />
            <FlatButton label="Register" style={buttonStyle2} onClick={() => dispatchNewRoute('/register')} />
        </div>
    </div>;
