'use strict'
import BtWrapper from '../base/bt-wrapper'
import YoutubeEditingBlock from './youtube-editing-block'

import React from 'react'

function youtubeButton(props) {
    return (
        <BtWrapper buttonData={props}>
            <YoutubeEditingBlock />
        </BtWrapper>
    )
}

export default youtubeButton
