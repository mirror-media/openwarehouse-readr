import AtomicBlockRendererMixin from '../mixins/atomic-block-renderer-mixin'
import React from 'react'
import ReactPlayer from 'react-player'

export default class AudioBlock extends AtomicBlockRendererMixin {
    constructor(props) {
        super(props)
    }

    render() {
        if (!this.state.data) {
            return null
        }

        const { title, url, id } = this.state.data.content[0]
        return (
            <div contentEditable={false} style={{ userSelect: 'none' }}>
                <ReactPlayer
                    url="url"
                    controls={true}
                    width="100%"
                    height="55px"
                    style={{ margin: '5px 0' }}
                />
                <h6>{title}</h6>
            </div>
        )
    }
}
