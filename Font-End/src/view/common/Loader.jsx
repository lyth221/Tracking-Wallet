import T from '../common/js/common';
import React from 'react';
// import CircularLoader from './CircularLoader.jsx';

const loaderStyle = {
    opacity: '0',
    pointerEvents: 'none',
    zIndex: '99999',
    position: 'fixed',
    padding: '0',
    top: '0',
    left: '0',
    bottom: '0',
    right: '0',
    textAlign: 'center',
    lineHeight: '100vh',
    backgroundColor: 'rgba(255,255,255,0.5)',
};

export default class Loader extends React.Component {
    constructor(props) {
        super(props);

        this.loader = React.createRef();
        T.loader = {
            show: () => {
                this.loader.current.style.opacity = '1';
                this.loader.current.style.pointerEvents = 'auto';
                this.loader.current.classList.add('show');
            },
            hide: () => {
                this.loader.current.style.opacity = '0';
                this.loader.current.style.pointerEvents = 'none';
                this.loader.current.classList.remove('show');
            }
        };
    }

    render() {
        return (
            <div id="loader" style={loaderStyle} ref={this.loader} onClick={(e) => T.loader.hide()}>
                <img src="/themes/loader.gif" width="100" alt="loader"/>
            </div>
        );
    }
}