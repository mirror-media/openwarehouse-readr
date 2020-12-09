// 'use strict'
import BtWrapper from '../base/bt-wrapper'
import AudioEditingBlock from './audio-editing-block'

import React from 'react'

function audioButton(props) {
    return (
        <BtWrapper buttonData={props}>
            <AudioEditingBlock />
        </BtWrapper>
    )
}

export default audioButton
