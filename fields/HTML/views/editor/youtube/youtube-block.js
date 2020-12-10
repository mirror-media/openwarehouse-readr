// 'use strict'

import AtomicBlockRendererMixin from '../mixins/atomic-block-renderer-mixin'
import EditingBt from '../base/editing-bt'
import React from 'react'
import YoutubeEditingBlock from './youtube-editing-block'
import get from 'lodash/get'

const _ = {
    get,
}

export class YoutubeBlock extends AtomicBlockRendererMixin {
    constructor(props) {
        super(props)
    }

    render() {
        if (!this.state.data) {
            return null
        }

        let blockContent = _.get(this.state.data, ['content', 0], {})
        let youtubeId = blockContent.youtubeId
        let description = blockContent.description
        const EditBlock = (
            <YoutubeEditingBlock
                description={description}
                label="youtube"
                isModalOpen={this.state.editMode}
                onToggle={this.handleEditingBlockChange}
                toggleModal={this.toggleEditMode}
                youtubeId={youtubeId}
            />
        )

        return (
            <div
                contentEditable={false}
                className="youtube-container"
                style={{
                    position: 'relative',
                    width: '560px',
                }}
            >
                <figure
                    style={{
                        margin: 'auto',

                        // backgroundColor: 'GhostWhite'
                    }}
                >
                    <iframe
                        width="560"
                        alt={description}
                        height="315"
                        src={'https://www.youtube.com/embed/' + youtubeId}
                        frameBorder="0"
                        allowFullScreen
                    />
                    <figcaption>{description}</figcaption>
                </figure>
                {/* <h6>I am youtube</h6> */}
                {/* <Youtube {...this.state.data} /> */}
                <EditingBt onClick={this.toggleEditMode} />
                {EditBlock}
            </div>
        )
    }
}

export default YoutubeBlock
