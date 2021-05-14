import T from '../common/js/common';
import React from 'react';
import {Editor} from 'react-draft-wysiwyg';
import {EditorState, convertToRaw, ContentState} from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'

export default class ContentDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            jobHub: null,
            editorState: EditorState.createEmpty()
        };

        this.modal = React.createRef();
        this.saveButton = React.createRef();
        this.editor = React.createRef();

        this.onSave = this.onSave.bind(this);
        this.onEditorChange = this.onEditorChange.bind(this);
        this.uploadImageCallBack = this.uploadImageCallBack.bind(this);

        T.showContentDialog = (content, onUploadImageAction, onSaveAction) => {
            const blocksFromHtml = htmlToDraft(content ? content : '');
            const {contentBlocks, entityMap} = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            const editorState = EditorState.createWithContent(contentState);
            this.onUploadImageAction = onUploadImageAction;
            this.onSaveAction = onSaveAction;
            this.setState({editorState});
            T.m.Modal.getInstance(this.modal.current).open();
        };
    }

    componentDidMount() {
        T.m.Modal.init(document.querySelectorAll('.modal'), {});
    }

    uploadImageCallBack(file) {
        return new Promise((resolve, reject) => {
            const data = new FormData();
            data.append('image', file);
            this.onUploadImageAction(data,(image) => {
                resolve({data: {link: image}});
            });
        });
    }

    onEditorChange(editorState) {
        this.setState({editorState});
    }

    onSave() {
        const data = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
        this.onSaveAction(data, () => {
            T.m.Modal.getInstance(this.modal.current).close();
        });
    }

    render() {
        return (
            <div className='modal modal-fixed-footer' ref={this.modal}>
                <form className='modal-content row' style={{margin: 0, pading: '0 24px'}}>
                    <h4>Content</h4>
                    <Editor ref={this.editor} editorState={this.state.editorState}
                            toolbar={{
                                inline: {inDropdown: true},
                                list: {inDropdown: true},
                                textAlign: {inDropdown: true},
                                link: {inDropdown: true},
                                colorPicker: {inDropdown: true},
                                history: {inDropdown: true},
                                image: {
                                    uploadCallback: this.uploadImageCallBack,
                                    alt: {present: true, mandatory: true}
                                },
                            }}
                            onEditorStateChange={this.onEditorChange}
                    />
                </form>
                <div className='modal-footer'>
                    <a href='#' className='modal-close waves-effect btn white black-text' style={{marginRight: '6px'}}>
                        Close</a>
                    <a href='#' className='waves-effect btn green' ref={this.saveButton} onClick={this.onSave}>
                        Save</a>
                </div>
            </div>
        );
    }
}

ContentDialog.propTypes = {
    onSaveJobHub: T.PropTypes.func,
    getJobHub: T.PropTypes.func,
};