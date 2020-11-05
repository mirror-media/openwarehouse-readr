import React from 'react'
import { RichUtils } from 'draft-js'
import Option from '../../components/Option'
import classNames from 'classnames'

function Quote({ onChange, editorState, selectionState }) {
    const prepareLayoutConfig = {
        style: {
            icon: undefined,
            className: 'fa fa-quote-left',
            title: 'Quote',
        },
        labels: {
            first: 'Quoted By',
            last: 'Quote',
        },
        isRequired: {
            first: true,
            last: true,
        },
    }
    const toggleBlockType = (blockType) => {
        onChange(RichUtils.toggleBlockType(editorState, blockType))
    }

    const addQuote = () => {
        toggleBlockType('blockquote')
    }

    return (
        <div>
            <Option
                value="unordered-list-item"
                onClick={() => addQuote()}
                className={classNames(prepareLayoutConfig.style.className)}
                aria-haspopup="true"
                title={prepareLayoutConfig.style.title}
            >
                <img src={prepareLayoutConfig.style.icon} alt="" />
            </Option>
        </div>
    )
}

export default Quote
