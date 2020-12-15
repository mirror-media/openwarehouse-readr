// 'use strict';

// import { Slideshow } from '@twreporter/react-article-components/dist/components/article/index'
import { Slide } from 'react-slideshow-image'
import 'react-slideshow-image/dist/styles.css'

import ENTITY from '../entities'
import AtomicBlockRendererMixin from '../mixins/atomic-block-renderer-mixin'
import EditingBt from '../base/editing-bt'
import ImageSelector from '../components/ImageSelector'
import React from 'react'
import get from 'lodash/get'

const _ = {
    get,
}

export default class SlideshowBlock extends AtomicBlockRendererMixin {
    constructor(props) {
        super(props)
    }

    _renderImageSelector(props) {
        return <ImageSelector {...props} />
    }

    render() {
        if (!this.state.data) {
            return null
        }

        let images = _.get(this.state.data, 'content', [])

        const EditBlock = this.state.editMode
            ? this._renderImageSelector({
                  apiPath: 'images',
                  isSelectionOpen: true,
                  onChange: this.onValueChange,
                  onFinish: this.toggleEditMode,
                  selectedImages: images,
                  selectionLimit: ENTITY.SLIDESHOW.slideshowSelectionLimit,
              })
            : null

        // return (
        //     <div
        //         contentEditable={false}
        //         className="slideshow-container"
        //         style={{
        //             position: 'relative',
        //         }}
        //     >
        //         <Slideshow {...this.state.data} device={this.props.device} />
        //         <EditingBt onClick={this.toggleEditMode} />
        //         {EditBlock}
        //     </div>
        // )

        const properties = {
            duration: 5000,
            transitionDuration: 500,
            infinite: true,
            indicators: true,
            arrows: true,
            pauseOnHover: true,
            onChange: (oldIndex, newIndex) => {},
        }

        return (
            <div
                className="slide-container"
                style={{
                    width: '500px',
                    position: 'relative',
                    userSelect: 'none',
                }}
                contentEditable={false}
            >
                <Slide {...properties}>
                    {images.map((image, index) => (
                        <div key={`slideshow-${index}`} className="each-slide">
                            <div
                                className="image-wrapper"
                                style={{
                                    // backgroundColor: 'GhostWhite',
                                    width: '100%',
                                    height: 'auto',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <img
                                    src={image.url}
                                    alt={image.title}
                                    style={{
                                        width: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </div>
                            <h6>{image.title}</h6>
                        </div>
                    ))}
                </Slide>
                <EditingBt onClick={this.toggleEditMode} />
                {EditBlock}
            </div>
        )
    }
}
