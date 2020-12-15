// 'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import ImageSelector from '../components/ImageSelector'

export class ImageEditingBlock extends Component {
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
            <ImageSelector
                apiPath={apiPath}
                isSelectionOpen={isModalOpen}
                onChange={onToggle}
                onFinish={toggleModal}
                selectionLimit={selectionLimit}
            />
        )
    }
}

ImageEditingBlock.propTypes = {
    apiPath: PropTypes.string,
    isModalOpen: PropTypes.bool,
    onToggle: PropTypes.func,
    selectedImages: PropTypes.array,
    selectionLimit: PropTypes.number,
    toggleModal: PropTypes.func,
}

ImageEditingBlock.defaultProps = {
    apiPath: 'images',
    isModalOpen: false,
    selectedImages: [],
    selectionLimit: 1,
}

export default ImageEditingBlock
