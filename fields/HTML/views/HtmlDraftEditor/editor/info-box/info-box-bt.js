// 'use strict'
import BtWrapper from '../base/bt-wrapper'
import InfoBoxEditingBlock from './info-box-editing-block'

import React from 'react'

function infoBoxButton(props) {
    return (
        <BtWrapper buttonData={props}>
            <InfoBoxEditingBlock />
        </BtWrapper>
    )
}

export default infoBoxButton
