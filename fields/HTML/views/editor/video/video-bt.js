// 'use strict'
import BtWrapper from '../base/bt-wrapper'
import VideoEditingBlock from './video-editing-block'

import React from 'react'

function videoButton(props) {
    return (
        <BtWrapper buttonData={props}>
            <VideoEditingBlock />
        </BtWrapper>
    )
}

export default videoButton
