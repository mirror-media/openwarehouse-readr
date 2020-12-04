'use strict'
import BtWrapper from '../base/bt-wrapper'
import LinkEditingBlock from './link-editing-block'

import React from 'react'

function linkButton(props) {
    return (
        <BtWrapper buttonData={props}>
            <LinkEditingBlock />
        </BtWrapper>
    )
}

export default linkButton
