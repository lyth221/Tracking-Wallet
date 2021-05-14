import T from '../common/js/common';
import React from 'react';

export default class Confirm extends React.Component {
    constructor(props) {
        super(props);

        this.modal = React.createRef();
        this.yesButton = React.createRef();
    }

    componentDidMount() {
        T.confirm = (title, message, yesAction) => {
            const titleElement = this.modal.current.querySelector('h5.modal-title');
            const messageElement = this.modal.current.querySelector('.modal-body p');
            if (titleElement) titleElement.innerHTML = title;
            if (messageElement) messageElement.innerHTML = message;

            this.yesButton.current.onclick = yesAction;

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
                            <button type='button' className='btn btn-secondary' data-dismiss='modal'>No</button>
                            <button type='button' className='btn btn-danger' data-dismiss='modal' ref={this.yesButton}>Yes</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}