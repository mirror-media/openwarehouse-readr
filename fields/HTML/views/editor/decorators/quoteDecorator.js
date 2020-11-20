import React from 'react'

function strategy(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity()
        return (
            entityKey !== null &&
            contentState.getEntity(entityKey).getType() === 'QUOTE'
        )
    }, callback)
}

const component = (props) => {
    const { quote, alignment } = props.contentState
        .getEntity(props.entityKey)
        .getData()

    const quoteStyle = {
        backgroundColor: 'GhostWhite',
        fontStyle: 'italic',
        boxSizing: 'border-box',
    }

    return (
        // <div style={quoteStyle}>
        // </div>
        <blockquote className={`${alignment} `}>
            <div style={{ padding: '1rem', height: '1rem' }}>{quote}</div>
        </blockquote>
    )
}

export default { strategy: strategy, component: component }
