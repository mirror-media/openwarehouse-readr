'use strict'
import BtWrapper from '../base/bt-wrapper'
import ImageEditingBlock from './image-editing-block'

import React from 'react'

function imageButton(props) {
    return (
        <BtWrapper buttonData={props}>
            <ImageEditingBlock />
        </BtWrapper>
    )
}

export default imageButton
