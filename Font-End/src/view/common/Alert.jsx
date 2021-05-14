import React from 'react';
import T from '../common/js/common';

export default class Alert extends React.Component {
    constructor(props) {
        super(props);
        this.modal = React.createRef();
    }

    componentDidMount() {
        T.alert = (title, message) => {
            const titleElement = this.modal.current.querySelector('h5.modal-title');
            const messageElement = this.modal.current.querySelector('.modal-body p');
            if (titleElement) titleElement.innerHTML = title;
            if (messageElement) messageElement.innerHTML = message;

            $(this.modal.current).modal('show');
        };
    }

    render() {
        return (
            <div className='modal' tabIndex='-1' role='dialog' ref={this.modal}>
                <div className='modal-dialog' role='document'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title' />
                            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                                <span aria-hidden='true'>&times;</span>
                            </button>
                        </div>
                        <div className='modal-body'>
                            <p />
                        </div>
                        <div className='modal-footer'>
                            <button type='button' className='btn btn-secondary' data-dismiss='modal'>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}