import React from 'react';
import { browserHistory } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';

const dispatchNewRoute = (route) => {
    browserHistory.push(route);
    this.setState({
        open: false,
    });
}

const style = {
    color: "#91989F",
    paddingTop: 230,
    width: '100%',
    textAlign: 'center',
};

const titleStyle = {
    color: "#77428D",
    fontWeight: 550,
    fontSize: "88px",
    fontFamily: "Avenir",
}

const subTitleStyle = {
    color: "#77428D",
    fontWeight: 500,
    fontSize: "30px",
    fontFamily: "Avenir",
}

const pStyle = {
    fontFamily: "Avenir",
    fontSize: "25px",
    fontWeight: 400,
    paddingBottom: "30px",
}

const buttonStyle = {
    marginBottom: "15px",
}

export const Home = () =>
    <div style={style}>
        <div className="text-center">
            <h1 style={titleStyle}>Grickly</h1>
            <p style={pStyle}>A brand new way to enjoy life event</p>
            <div className="center container" style={{width: "250px"}}>
                <RaisedButton
                    fullWidth={true}
                    labelColor="#8B81C3"
                    label="Sign Up Now"
                    style={buttonStyle}
                    onClick={() => dispatchNewRoute('/register')}
                />
            </div>
            <p style={{color: "#91989F", marginBottom: "100px"}}>
                Already have an account? Log in <a onClick={() => dispatchNewRoute('/login')}>here</a>.
            </p>
            {/* <hr style={{width: "80%"}}/>
            <p style={subTitleStyle}> Meet the team </p>
            <p>
                We are students from New York University Tandon School of Engineering! <br/>
                <br/>
                <b>Ge Yang: </b> Junior at New York University<br/>
                <br/>
                <b>Hengning Zhang: </b> Junior at New York University<br/>
                <br/>
                <b>Kejian Shi: </b> Senior at New York University<br/>
                <br/>
                <b>Lujie Zhao: </b>Junior at New York University<br/>
                <br/>
                <b>Sicong Liu: </b>Junior at New York University<br/>
            </p> */}
        </div>
    </div>;
