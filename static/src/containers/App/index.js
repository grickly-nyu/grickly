import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import io from 'socket.io-client'
/* application components */
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

/* global styles for app */
import './styles/app.scss';


const style = {
    backgroundColor: "#01012b",
    height: "100%",
    width: '100%',
};

class App extends React.Component { // eslint-disable-line react/prefer-stateless-function
    static propTypes = {
        children: React.PropTypes.node,
    };
    

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme()}>
                <section>
                    <Header />
                    <div
                      className="container"
                      style={style}
                    >
                        {this.props.children}
                    </div>
                    {/* <div>
                        <Footer />
                    </div> */}
                </section>
            </MuiThemeProvider>
        );
    }
}

export { App };
