import React from 'react';
import { browserHistory } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import './index.scss';

const dispatchNewRoute = (route) => {
    browserHistory.push(route);
    this.setState({
        open: false,
    });
};
const style = {
    color: "#91989F",
    paddingTop: 230,
    width: '100%',
    textAlign: 'center',
};
const pStyle = {
    fontFamily: "Avenir",
    fontSize: "23px",
    fontWeight: 400,
    paddingBottom: "30px",
};
const buttonStyle = {
    marginBottom: "15px",
};

export const Home = () =>
    <div style={style}>
        <div className="text-center">
            <h1 className="line-text">Grickly</h1>
            <p style={pStyle}>A brand new way to enjoy life events</p>
            <div className="center container" style={{width: "250px"}}>
                <RaisedButton
                    fullWidth={true}
                    labelColor="#8B81C3"
                    labelStyle={{
                        fontSize: "23px",
                        fontWeight: "550",
                    }}
                    label="Sign Up Now"
                    style={buttonStyle}
                    onClick={() => dispatchNewRoute('/register')}
                />
            </div>
            <p style={{color: "#91989F", marginBottom: "100px"}}>
                Already have an account? Log in <a onClick={() => dispatchNewRoute('/login')}>here</a>.
            </p>
        </div>
    </div>;
