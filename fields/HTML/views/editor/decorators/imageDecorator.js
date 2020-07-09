/** @jsx jsx */
import { jsx } from '@emotion/core';

function strategy(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(character => {
        const entityKey = character.getEntity();
        return (
            entityKey !== null &&
            contentState.getEntity(entityKey).getType() === 'IMAGE'
        );
    }, callback);
}

const component = (props) => {
    const { id, title, urlDesktopSized } = props.contentState.getEntity(props.entityKey).getData()[0];
    return (
        <div style={{
            backgroundColor: "GhostWhite",
            width: '100%',
            height: 'auto',
        }}>
            <img
                src={urlDesktopSized}
                alt={title}
                style={{
                    width: '60%',
                    height: '60%',
                    objectFit: 'cover',
                }}
            />
            <h6>{title}</h6>
        </div>
    );
}

export default { strategy: strategy, component: component };
