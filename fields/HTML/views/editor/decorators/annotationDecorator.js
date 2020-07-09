import React, { useState } from 'react';
import { AnnotationType } from '../controls/Annotation';
import classNames from 'classnames';

function strategy(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(character => {
        const entityKey = character.getEntity();
        return (
            entityKey !== null &&
            contentState.getEntity(entityKey).getType() === AnnotationType
        );
    }, callback);
}

const component = (props) => {
    const { text, body } = props.contentState.getEntity(props.entityKey).getData();
    const [expanded, setExpanded] = useState(false);
    return (
        <abbr
            className="annotation"
            title={text}
            style={{ cursor: 'pointer', borderBottom: 0 }}
        >
            <span
                onClick={() => setExpanded(!expanded)}
                style={{ color: 'red' }}
            >
                {text}
                <span className={classNames(expanded ? 'up' : '', 'indicator')} />
            </span>
            <span
                className="annotation-html"
                dangerouslySetInnerHTML={{ __html: body }}
                style={{
                    display: expanded ? 'block' : 'none',
                    backgroundColor: '#F7F7FF',
                    padding: '16px',
                    fontSize: '15px',
                    lineHeight: 1.5,
                }}
            />
        </abbr>
    );
}

export default { strategy: strategy, component: component };
