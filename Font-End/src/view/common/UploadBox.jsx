import T from './js/common';
import './js/mfupload';
import React from 'react';

const UploadBoxStyle = {
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    width: 'auto',
    height: '124px',
    color: 'black',
    border: '1px dashed #333',
};

export default class UploadBox extends React.Component {
    constructor(props) {
        super(props);

        this.setImage = this.setImage.bind(this);

        this.box = React.createRef();
        this.progress = React.createRef();
    }

    componentDidMount() {
        setTimeout(() => {
            const uploadBox = $(this.box.current),
                uploadProgress = $(this.progress.current);

            uploadBox.mfupload({
                type: this.props.fileType ? this.props.fileType : 'png, jpg, jpeg, bmp',
                maxsize: this.props.maxSize ? this.props.maxSize : 5,
                post_upload: this.props.postUrl,
                folder: './',
                ini_text: this.props.innerText ? this.props.innerText : '',
                over_text: this.props.overText ? this.props.overText : 'Thả hình ảnh xuống ô này!',
                over_col: this.props.overColor ? this.props.overColor : '#fff',
                over_bkcol: this.props.overBackColor ? this.props.overBackColor : '#0e7dc2',

                init: () => { },

                loaded: result => {
                    uploadBox.css('display', 'none');
                    if (result.error) {

                    } else if (result.image) {
                        uploadBox.css('background-image', 'url(' + T.url(result.image) + ')');
                    }
                },

                progress: result => uploadProgress.text('Upload ' + result.perc + '%'),

                error: error => {
                    uploadBox.css('display', 'block');
                    T.notify('Tải hình bị lỗi: ' + error, 'danger')
                    console.log('UploadBox', error);
                },
                completed: () => {
                    uploadBox.css('display', 'block');
                    uploadProgress.text('');
                }
            });
        }, 500);
    }

    setImage(image) {
        $(this.box.current).css('background-image', 'url(' + T.url(image) + ')');
    }

    render() {
        return [
            <div ref={this.box} id={this.props.uploadType} style={UploadBoxStyle} key={0} />,
            <small className='form-text text-primary' style={{ textAlign: 'center' }} key={1}>
                {this.props.description ? this.props.description : 'Nhấp hoặc kéo hình ảnh thả vào ô phía trên!'}
            </small >,
            <small ref={this.progress} className='form-text text-muted' style={{ textAlign: 'center' }} key={2} />
        ];
    }
}

UploadBox.propTypes = {
    fileType: T.PropTypes.string,
    maxSize: T.PropTypes.number,
    uploadType: T.PropTypes.string.isRequired,
    innerText: T.PropTypes.string,
    overText: T.PropTypes.string,
    overColor: T.PropTypes.string,
    overBackColor: T.PropTypes.string,
    description: T.PropTypes.string,
    postUrl: T.PropTypes.string.isRequired,
};