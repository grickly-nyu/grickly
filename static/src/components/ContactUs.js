import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
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
    paddingTop: 40,
    paddingLeft: 50,
    paddingRight: 50,
    paddingBottom: 70,
    width: "100%",
    color: "black",
    backgroundColor: "white",
    fontFamily: "Avenir",
};
const titleStyle = {
    color: "#77428D",
    fontWeight: 900,
    fontSize: "40px",
    fontFamily: "Avenir",
};
const subTitleStyle = {
    color: "#77428D",
    fontWeight: 400,
    fontSize: "20px",
    fontFamily: "Avenir",
    paddingBottom: "30px",
};

@connect(mapStateToProps, mapDispatchToProps)
export default class ContactUs extends React.Component {
    render() {
        return (
        <div className="container">
            <div style={style}>
                <p style={titleStyle}>Meet the team</p>
                <p style={subTitleStyle}>We are students from New York University Tandon School of Engineering! <Emoji symbol="😎"/></p>
                <p style={{fontSize:"17px"}}>
                    <b style={{fontSize:"19.5px"}}>Ge Yang (Head of Development): </b><br/>
                    Junior CS student at New York University. Very happy recently with his 13 keyboards collection. <Emoji symbol="⌨"/>
                    <br/><br/>
                    <b style={{fontSize:"19.5px"}}>Hengning Zhang (Head of Database): </b><br/>
                    Junior CS student at New York University. Add him on WeChat! His Wechat ID is hengningbao. <Emoji symbol="😉"/>
                    <br/><br/>
                    <b style={{fontSize:"19.5px"}}>Kejian Shi (Head of Algorithm): </b><br/>
                    Junior CS student at New York University. (The only senior in the team who misses his junior life.) <Emoji symbol="😋"/>
                    <br/><br/>
                    <b style={{fontSize:"19.5px"}}>Lujie Zhao (Project Manager): </b><br/>
                    Junior CS student at New York University. Master at Boba Tea with a work experience of three years. <Emoji symbol="🥤"/>
                    <br/><br/>
                    <b style={{fontSize:"19.5px"}}>Sicong Liu (Team Leader): </b><br/>
                    Junior CS student at New York University. Nothing special about this nerd. <Emoji symbol="🧑‍💻"/>
                    <br/><br/>
                    Please contact us at <a style={{color:"black"}} href = "mailto: grickly.nyu@gmail.com">grickly.nyu@gmail.com</a> for any comments and suggestions.
                </p>
            </div>
        </div>
        )
    }
}
