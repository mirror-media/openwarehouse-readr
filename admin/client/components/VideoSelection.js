// 'use strict'
import { VideoGrid } from './VideoGrid'
import SelectionMixin from './mixins/SelectionMixin'
import React, { Component } from 'react'
import merge from 'lodash/merge'

const _ = {
    merge,
}

class VideoSelection extends SelectionMixin {
    constructor(props) {
        super(props)

        this.state = {
            items: props.Videos,
            selectedItems: props.selectedVideos,
        }
    }

    // replacement of componentWillReceiveProps
    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            items: nextProps.Videos,
            selectedItems: nextProps.selectedVideos,
        }
    }

    render() {
        return (
            <VideoGrid
                Videos={this.state.items}
                onSelect={this.handleSelect}
                selectedVideos={this.state.selectedItems}
            />
        )
    }
}

// VideoSelection.propTypes = {
//     Videos: PropTypes.array,
//     selectedVideos: PropTypes.array,
//     selectionLimit: PropTypes.number,
//     updateSelection: PropTypes.func.isRequired,
// }

VideoSelection.defaultProps = {
    Videos: [],
    selectedVideos: [],
    selectionLimit: 1,
}

// module.exports = VideoSelection;
export default VideoSelection
