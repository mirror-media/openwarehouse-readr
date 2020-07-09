/** @jsx jsx */
import { jsx } from '@emotion/core';
import { getUrlExtension } from '../utils/common';

function strategy(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(character => {
        const entityKey = character.getEntity();
        return (
            entityKey !== null &&
            contentState.getEntity(entityKey).getType() === 'VIDEO'
        );
    }, callback);
}

const component = (props) => {
    const { title, description, url } = props.contentState.getEntity(props.entityKey).getData()[0];
    const ext = getUrlExtension(url);
    return (
        <div style={{
            backgroundColor: "GhostWhite",
            width: '100%',
            height: 'auto',
        }}>
            <video
                style={{
                    height: '60%',
                    width: '60%',
                }}
                controls>
                <source src={url} type={`video/${ext}`} />
            </video>
            <p style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'Noto Sans TC,sans-serif' }}>{title}</p>
            <p style={{ fontSize: '10px', fontFamily: 'Noto Sans TC,sans-serif' }}>{description}</p>
        </div>
    );
}

export default { strategy: strategy, component: component };
