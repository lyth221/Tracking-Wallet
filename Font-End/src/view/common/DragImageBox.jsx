import React from 'react'
import { DropTargetMonitor } from 'react-dnd'
import HTML5Backend, { NativeTypes } from 'react-dnd-html5-backend'
import TargetBox from './TargetBox.jsx'
import { DragDropContext } from 'react-dnd'
// import update from 'immutability-helper';

import './scss/components/DragImageBox.scss';

class DragImageBox extends React.Component {
	constructor(props) {
        super(props)
        
        this.handleFileDrop = this.handleFileDrop.bind(this);
        this.handleImageUpload = this.handleImageUpload.bind(this);
    }
    handleFileDrop(item, monitor) {
		if (monitor) {
            
            const droppedFiles = monitor.getItem().files;
            this.props.onChangeFile(droppedFiles);
		}
    }
    handleImageUpload(e) {
        const files = e.target.files;
        this.props.onChangeFile(files);
        
    }
	render() {
		const { FILE } = NativeTypes;
        let { customClass, message, previewSingleImage } = this.props;
        customClass = customClass ? ' ' + customClass: '';
		return (
            <div className={"drag-file-box" + customClass}>
                <TargetBox 
                    accepts={[FILE]}
                    message={message}
                    onDrop={this.handleFileDrop}
                    onChangeFile={this.handleImageUpload}
                    previewSingleImage={previewSingleImage}
                />
            </div>
		)
	}
}
export default DragDropContext(HTML5Backend)(DragImageBox)