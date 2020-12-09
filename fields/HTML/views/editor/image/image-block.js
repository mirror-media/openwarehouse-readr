// 'use strict'

// import { AlignedImage } from '@twreporter/react-article-components/dist/components/article/index';
import AtomicBlockRendererMixin from '../mixins/atomic-block-renderer-mixin'
// import ImageSelector from '../../../../../admin/client/components/ImageSelector'
import React from 'react'
import get from 'lodash/get'

const _ = {
    get,
}

export default class ImageBlock extends AtomicBlockRendererMixin {
    constructor(props) {
        super(props)
    }

    _renderImageSelector(props) {
        // return <ImageSelector {...props} />
        return null
    }

    // override AtomicBlockRendererMixin._onValueChange
    _onValueChange(value) {
        this.value = _.get(value, 0)
        this.props.blockProps.onFinishEdit(
            this.props.block.getKey(),
            this.value
        )
    }

    render() {
        if (!this.state.data) {
            return null
        }

        let image = _.get(this.state.data, ['content', 0], {})

        const EditBlock = this.state.editMode
            ? this._renderImageSelector({
                  apiPath: 'images',
                  isSelectionOpen: true,
                  onChange: this.onValueChange,
                  onFinish: this.toggleEditMode,
                  selectedImages: [image],
                  selectionLimit: 1,
              })
            : null

        const { id, title, url } = image
        // return (
        //     <div
        //         contentEditable={false}
        //         onClick={this.toggleEditMode}
        //         style={{ cursor: 'pointer' }}
        //     >
        //         {/* <AlignedImage
        // 			{...this.state.data}
        // 			device={this.props.device}
        // 		>
        // 			{this.props.children}
        // 		</AlignedImage>
        // 		{EditBlock} */}
        //     </div>
        // )

        return (
            <div
                style={{
                    // backgroundColor: 'GhostWhite',
                    width: '100%',
                    height: 'auto',
                }}
            >
                <img
                    src={url}
                    alt={title}
                    style={{
                        width: '60%',
                        height: '60%',
                        objectFit: 'cover',
                    }}
                />
                <h6>{title}</h6>
            </div>
        )
    }
}
