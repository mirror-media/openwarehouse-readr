// 'use strict'

// import { AlignedImage } from '@twreporter/react-article-components/dist/components/article/index';
import AtomicBlockRendererMixin from '../mixins/atomic-block-renderer-mixin'
import ImageSelector from '../../../../../admin/client/components/ImageSelector'
import React from 'react'
import get from 'lodash/get'
import AlignedWrapper from '../components/AlignedWrapper/AlignedWrapper'

const _ = {
    get,
}

export default class ImageBlock extends AtomicBlockRendererMixin {
    constructor(props) {
        super(props)
    }

    _renderImageSelector(props) {
        return <ImageSelector {...props} />
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

        return (
            <AlignedWrapper>
                <div
                    style={{
                        // backgroundColor: 'GhostWhite',
                        width: '100%',
                        height: 'auto',
                        cursor: 'pointer',
                        userSelect: 'none',
                    }}
                    contentEditable={false}
                >
                    <img
                        src={url}
                        alt={title}
                        style={{
                            width: '100%',
                            objectFit: 'cover',
                            cursor: 'pointer',
                        }}
                        onClick={this.toggleEditMode}
                    />

                    <h6 style={{ margin: '0.944rem auto 0 auto' }}>{title}</h6>
                    {EditBlock}
                </div>
            </AlignedWrapper>
        )
    }
}
