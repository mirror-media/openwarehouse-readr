// 'use strict'
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import htmlParser from 'html-react-parser'

// import { AlignedEmbedded } from '@twreporter/react-article-components'
import AtomicBlockRendererMixin from '../mixins/atomic-block-renderer-mixin'
import EditingBt from '../base/editing-bt'
import EmbeddedEditingBlock from './embedded-code-editing-block'
import get from 'lodash/get'
import merge from 'lodash/merge'

const _ = {
    get,
    merge,
}

export class EmbeddedCodeBlock extends AtomicBlockRendererMixin {
    constructor(props) {
        super(props)
    }

    render() {
        if (!this.state.data) {
            return null
        }

        let blockContent = _.get(this.state.data, ['content', 0], {})
        let embeddedCode = blockContent.embeddedCode
        let description = blockContent.caption
        let style = {}
        if (blockContent.height) {
            style.minHeight = blockContent.height
        }
        if (blockContent.width) {
            style.width = blockContent.width
        }

        // this.props.blockProps.setReadOnly(this.state.editMode)

        const EditBlock = (
            <EmbeddedEditingBlock
                caption={description}
                code={embeddedCode}
                label="embedded"
                isModalOpen={this.state.editMode}
                onToggle={this.handleEditingBlockChange}
                toggleModal={this.toggleEditMode}
            />
        )

        const contentState = this.props.contentState
        const blockWithLinkAtBeginning = contentState.getBlockForKey(
            this.props.entityKey
        )
        // const linkKey = blockWithLinkAtBeginning.getEntityAt(0)
        const data = contentState.getEntity(this.props.entityKey).getData()
        // const { url } = linkInstance.getData()
        const { code, caption, alignment } = data

        const convertHtmlStringToReactComponent = htmlParser(code)
        return (
            <div
                contentEditable={false}
                className="embedded-container center-block"
                style={_.merge(style, {
                    alignItem: 'center',
                    position: 'relative',
                })}
            >
                {/* <AlignedEmbedded
                    {...this.state.data}
                    device={this.props.device}
                >
                    {this.props.children}
                </AlignedEmbedded> */}
                {convertHtmlStringToReactComponent}
                <EditingBt onClick={this.toggleEditMode} />
                {EditBlock}
            </div>
        )
    }
}

export default EmbeddedCodeBlock
