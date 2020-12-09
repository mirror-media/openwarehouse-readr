// 'use strict'
import { ImageGrid } from './ImageGrid'
import SelectionMixin from './mixins/SelectionMixin'
import React from 'react'
// import merge from 'lodash/merge'

// const _ = {
//     merge,
// }

export class ImageSelection extends SelectionMixin {
    constructor(props) {
        super(props)

        this.state = {
            ...this.state,
            items: props.images,
            selectedItems: props.selectedImages,
        }
    }

    // replacement of componentWillReceiveProps
    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            items: nextProps.images,
            selectedItems: nextProps.selectedImages,
        }
    }

    render() {
        return (
            <ImageGrid
                images={this.state.items}
                onSelect={this.handleSelect}
                selectedImages={this.state.selectedItems}
            />
        )
    }
}

// ImageSelection.propTypes = {
//     images: PropTypes.array,
//     selectedImages: PropTypes.array,
//     selectionLimit: PropTypes.number,
//     updateSelection: PropTypes.func.isRequired,
// }

ImageSelection.defaultProps = {
    images: [],
    selectedImages: [],
    selectionLimit: 1,
}

export default ImageSelection
