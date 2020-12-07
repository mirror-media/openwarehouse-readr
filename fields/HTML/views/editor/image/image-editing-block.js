'use strict'
import ImageSelector from '../../../../../admin/client/components/ImageSelector'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

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
            // <h6>I am image</h6>
        )
    }
}

// ImageEditingBlock.propTypes = {
// 	apiPath: PropTypes.string,
// 	isModalOpen: PropTypes.bool,
// 	onToggle: PropTypes.func,
// 	selectedImages: PropTypes.array,
// 	selectionLimit: PropTypes.number,
// 	toggleModal: PropTypes.func,
// };

// ImageEditingBlock.defaultProps = {
//     apiPath: 'images',
//     isModalOpen: false,
//     selectedImages: [],
//     selectionLimit: 1,
// }

export default ImageEditingBlock
