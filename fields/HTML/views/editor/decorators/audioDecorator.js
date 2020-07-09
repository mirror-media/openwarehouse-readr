/** @jsx jsx */
import { jsx } from '@emotion/core';
import { getUrlExtension } from '../utils/common';

function strategy(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(character => {
        const entityKey = character.getEntity();
        return (
            entityKey !== null &&
            contentState.getEntity(entityKey).getType() === 'AUDIO'
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
            display: 'flex',
            flexDirection: 'column',
        }}>
            <audio
                style={{
                    width: '60%',
                    margin: '8px 4px',
                }}
                controls>
                <source src={url} type={`audio/${ext}`} />
            </audio>
            <p style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'Noto Sans TC,sans-serif', marginLeft: '8px' }}>{title}</p>
        </div>
    );
}

export default { strategy: strategy, component: component };
