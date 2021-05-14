import  React from 'react'
import {
	DropTarget,
	DropTargetConnector,
	ConnectDropTarget,
	DropTargetMonitor,
} from 'react-dnd'

// const style = {
// 	border: '1px solid gray',
// 	height: '15rem',
// 	width: '15rem',
// 	padding: '2rem',
// 	textAlign: 'center',
// }

const boxTarget = {
	drop(props, monitor) {
		if (props.onDrop) {
			props.onDrop(props, monitor)
		}
	},
}

class TargetBox extends React.Component {
    constructor(props) {
        super(props)
    }
	render() {
        const { canDrop, isOver, connectDropTarget, 
            message, onChangeFile, previewSingleImage } = this.props
		const isActive = canDrop && isOver

		return connectDropTarget(
			<div className={ isActive ? 'target-box active' : 'target-box' }>
                {/* <span>{ message }</span> */}
                {
                    message && <span dangerouslySetInnerHTML={ {__html: message} }></span>
                }
                {
                    previewSingleImage && !isActive && <img src={previewSingleImage} alt="Preview Image"/>
                }
                <input onChange={(e) => onChangeFile(e)} type="file" />
			</div>,
		)
	}
}

export default DropTarget (
	(props) => props.accepts,
	boxTarget,
	(connect, monitor) => ({
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
		canDrop: monitor.canDrop(),
	}),
)(TargetBox)