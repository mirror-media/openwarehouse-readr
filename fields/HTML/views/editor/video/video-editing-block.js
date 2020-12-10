// 'use strict'
import VideoSelector from '../../../../../admin/client/components/VideoSelector'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class VideoEditingBlock extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {
            apiPath,
            onToggle,
            toggleModal,
            selectionLimit,
            isModalOpen,
        } = this.props
        return (
            <VideoSelector
                apiPath={apiPath}
                isSelectionOpen={isModalOpen}
                onChange={onToggle}
                onFinish={toggleModal}
                selectionLimit={selectionLimit}
            />
        )
    }
}

// VideoEditingBlock.propTypes = {
// 	apiPath: PropTypes.string,
// 	isModalOpen: PropTypes.bool,
// 	onToggle: PropTypes.func,
// 	selectedVideos: PropTypes.array,
// 	selectionLimit: PropTypes.number,
// 	toggleModal: PropTypes.func,
// };

VideoEditingBlock.defaultProps = {
    apiPath: 'Videos',
    isModalOpen: false,
    selectedVideos: [],
    selectionLimit: 1,
}

export default VideoEditingBlock
