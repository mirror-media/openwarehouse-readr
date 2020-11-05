import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { EditorState, Modifier, RichUtils, convertToRaw } from 'draft-js'
import { getEntityRange, getSelectionEntity } from 'draftjs-utils'

import TwoInputs from '../../components/TwoInputs'
import '../../css/main.css'

class BlockQuote extends Component {
    static propTypes = {
        editorState: PropTypes.object,
        onChange: PropTypes.func,
        modalHandler: PropTypes.object,
        translations: PropTypes.object,
    }

    constructor(props) {
        super(props)
        const { editorState, modalHandler } = this.props
        this.state = {
            expanded: false,
            blockQuote: undefined,
            currentEntity: editorState
                ? getSelectionEntity(editorState)
                : undefined,
        }
        modalHandler.registerCallBack(this.expandCollapse)
    }

    componentDidUpdate(prevProps) {
        const { editorState } = this.props
        if (editorState && editorState !== prevProps.editorState) {
            this.setState({ currentEntity: getSelectionEntity(editorState) })
        }
    }

    componentWillUnmount() {
        const { modalHandler } = this.props
        modalHandler.deregisterCallBack(this.expandCollapse)
    }

    onExpandEvent = () => {
        this.signalExpanded = !this.state.expanded
    }

    onChange = (quotedBy, quote) => {
        const { editorState, onChange } = this.props

        const contentState = editorState.getCurrentContent()
        const currentSelection = editorState.getSelection()
        const newContentState = Modifier.replaceText(
            contentState,
            currentSelection,
            `${quote}\n\n-${quotedBy}`,
            editorState.getCurrentInlineStyle()
        )

        const newEditorState = EditorState.push(
            editorState,
            newContentState,
            'insert-characters'
        )

        onChange(RichUtils.toggleBlockType(newEditorState, 'blockquote'))
        this.doCollapse()
    }

    getCurrentValues = () => {
        const { editorState } = this.props
        const { currentEntity } = this.state
        const contentState = editorState.getCurrentContent()
        const currentValues = {}
        if (
            currentEntity &&
            contentState.getEntity(currentEntity).get('type') === 'BLOCKQUOTE'
        ) {
            currentValues.blockQuote = {}
            const entityRange =
                currentEntity && getEntityRange(editorState, currentEntity)
            currentValues.blockQuote.quotedBy =
                currentEntity &&
                contentState.getEntity(currentEntity).get('data').quotedBy
            currentValues.blockQuote.quote =
                currentEntity &&
                contentState.getEntity(currentEntity).get('data').quote
        }
        return currentValues
    }

    doExpand = () => {
        this.setState({
            expanded: true,
        })
    }

    expandCollapse = () => {
        this.setState({
            expanded: this.signalExpanded,
        })
        this.signalExpanded = false
    }

    doCollapse = () => {
        this.setState({
            expanded: false,
        })
    }

    prepareLayoutConfig = () => ({
        style: {
            icon: undefined,
            className: 'fa fa-quote-right',
            title: 'Block Quote',
        },
        labels: {
            first: 'Quoted By',
            last: 'Quote',
        },
        isRequired: {
            first: true,
            last: true,
        },
    })

    prepareLayoutCurrentState = (blockQuote) => ({
        twoInputs: {
            first: (blockQuote && blockQuote.quotedBy) || '',
            last: (blockQuote && blockQuote.quote) || '',
        },
    })

    render() {
        const { translations } = this.props
        const { expanded } = this.state
        const { blockQuote } = this.getCurrentValues()
        return (
            <TwoInputs
                translations={translations}
                expanded={expanded}
                onExpandEvent={this.onExpandEvent}
                doExpand={this.doExpand}
                doCollapse={this.doCollapse}
                config={this.prepareLayoutConfig()}
                currentState={this.prepareLayoutCurrentState(blockQuote)}
                onChange={this.onChange}
            />
        )
    }
}

export default BlockQuote
