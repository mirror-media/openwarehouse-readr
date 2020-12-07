'use strict'
import BtWrapper from '../base/bt-wrapper'
import ImageLinkEditingBlock from './image-link-editing-block'

import React from 'react'

function imageLinkButton(props) {
    return (
        <BtWrapper buttonData={props}>
            <ImageLinkEditingBlock />
        </BtWrapper>
    )
}

export default imageLinkButton
