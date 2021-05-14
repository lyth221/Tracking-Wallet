import React, { Component } from 'react';
import CKEditor from "react-ckeditor-component";

export default class CompCKEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // content: 'content',
            config: {
                extraPlugins: 'image2,uploadimage',
                uploadUrl: 'http://localhost:4000/api/v1/connector/ckeditor',
                height: this.props.height || 450,
                image2_prefillDimensions: true,
            }
        }
        this.onChange = this.onChange.bind(this);
        this.onEditorAfterPaste = this.onEditorAfterPaste.bind(this);
    }
    onChange(event) {
        // var newContent = evt.editor.getData();
        // this.setState({
        //     content: newContent
        // })
        this.props.onChange(event);
    }
    onEditorAfterPaste(event) {
        event.editor.on( 'fileUploadRequest', function( evt ) {
            var fileLoader = evt.data.fileLoader,
                formData = new FormData(),
                xhr = fileLoader.xhr;
            console.log(evt);
            // xhr.open( 'PUT', fileLoader.uploadUrl, true );
            // formData.append( 'upload', fileLoader.file, fileLoader.fileName );
            // fileLoader.xhr.send( formData );
        
            // // Prevented the default behavior.
            // evt.stop();
        }, null, null, 4 )
    }
    render() {
        return (
            <CKEditor
                activeClass="wrapper-ckeditor"
                content={this.props.content}
                events={{
                    "change": this.onChange,
                    "afterPaste": this.onEditorAfterPaste
                }}
                config={this.state.config}
                scriptUrl={`${location.origin}/js/plugins/ckeditor/ckeditor.js`}
            />
        )
    }
}