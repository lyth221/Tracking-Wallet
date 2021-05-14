import T from '../common/js/common';
import Dropzone from 'react-dropzone';
import React from 'react';
import {DropzoneStype} from '../common/Variables.jsx';

export default class UploadImage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {imageSrc: ''};

        this.modal = React.createRef();

    }

    componentDidMount() {
        T.m.Modal.init(document.querySelectorAll('.modal'), {});
        T.showUploadImageDialog = (imageSrc, onDropAction) => {
            this.setState({imageSrc});
            this.onDropAction = onDropAction;
            T.m.Modal.getInstance(this.modal.current).open();
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const avatars = document.getElementsByClassName('avatar');
        for (let i = 0, n = avatars.length; i < n; i++) {
            avatars[i].addEventListener('error', function () {
                this.src = '/img/avatar.jpg';
            });
        }
    }

    onDrop(files) {
        const data = new FormData();
        data.append('image', files[0]);
        T.loader.show(this.modal.current);
        this.onDropAction(data, (image) =>{
            this.setState({imageSrc: image});
            T.m.toast({html: 'Post image successfully!'});
            T.loader.hide(this.modal.current);
        });
    }

    render() {
        const image = this.state.imageSrc;
        return (
            <div style={this.props.style} className='modal modal-fixed-footer' ref={this.modal}>
                <form className='modal-content row' style={{margin: 0, pading: '0 24px'}}>
                    <h4>Upload image</h4>
                    <Dropzone multiple={false} accept='.png,.jpg,.gif' style={DropzoneStype}
                              onDrop={this.onDrop.bind(this)}>
                        <i style={{fontSize: '50px'}} className='material-icons'>cloud_upload</i>
                        <p>Try dropping files image here, or click to select files image to upload.</p>
                    </Dropzone>
                    <div style={{width: '100%', textAlign: 'center'}}>
                        <img alt='Image' style={{width: 'auto', height: '120px'}} className='avatar'
                             src={image + '?t=' + (new Date()).getTime()}/>
                    </div>
                </form>
                <div className='modal-footer'>
                    <a href='#' className='modal-close waves-effect btn white black-text' style={{marginRight: '6px'}}>
                        Close
                    </a>
                </div>
            </div>
        );
    }
}

UploadImage.propTypes = {
    updateImage: T.PropTypes.func
};