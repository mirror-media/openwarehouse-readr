/** @jsx jsx */
import { jsx } from '@emotion/core';

function strategy(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(character => {
        const entityKey = character.getEntity();
        return (
            entityKey !== null &&
            contentState.getEntity(entityKey).getType() === 'YOUTUBE'
        );
    }, callback);
}

const component = (props) => {
    const { id, description } = props.contentState.getEntity(props.entityKey).getData();
    return (
        <figure style={{ backgroundColor: "GhostWhite" }}>
            <iframe
                width="560"
                alt={description}
                height="315"
                src={"https://www.youtube.com/embed/" + id}
                frameBorder="0"
                allowFullScreen
            />
            <figcaption>{description}</figcaption>
        </figure>
    );
}

export default { strategy: strategy, component: component };
