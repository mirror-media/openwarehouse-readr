// 'use strict';
// import { Video } from '@twreporter/react-article-components/dist/components/article/index'
import AtomicBlockRendererMixin from '../mixins/atomic-block-renderer-mixin'
import React from 'react'
import ReactPlayer from 'react-player'

export default class VideoBlock extends AtomicBlockRendererMixin {
    constructor(props) {
        super(props)
    }

    render() {
        if (!this.state.data) {
            return null
        }

        const { title, url, id } = this.state.data.content[0]
        return (
            <div contentEditable={false}>
                <h6>I am Video</h6>
                {/* <ReactPlayer
                    url="https://storage.googleapis.com/mirrormedia-files/assets/Videos/20180126180505-ae7de3a909dbcc72a6706b35209f302c.mp3"
                    controls={true}
                    width="100%"
                    height="55px"
                    style={{ margin: '5px 0' }}
                />
                <h6>{title}</h6> */}
            </div>
        )
    }
}
