/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

function strategy(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(character => {
        const entityKey = character.getEntity();
        return (
            entityKey !== null &&
            contentState.getEntity(entityKey).getType() === 'SLIDESHOW'
        );
    }, callback);
}

const properties = {
    duration: 5000,
    transitionDuration: 500,
    infinite: true,
    indicators: true,
    arrows: true,
    pauseOnHover: true,
    onChange: (oldIndex, newIndex) => { }
}

const component = (props) => {
    const images = props.contentState.getEntity(props.entityKey).getData();
    return (
        <div className="slide-container">
            <Slide {...properties}>
                {
                    images.map((image, index) => (
                        <div
                            key={`slideshow-${index}`}
                            className="each-slide"
                            style={{
                                backgroundColor: "GhostWhite",
                                width: '100%',
                                height: 'auto',
                            }}
                        >
                            <img
                                src={image.urlDesktopSized}
                                alt={image.title}
                                style={{
                                    width: '60%',
                                    height: '60%',
                                    objectFit: 'cover',
                                }}
                            />
                            <h6>{image.title}</h6>
                        </div>
                    ))
                }
            </Slide>
        </div>
    )
}

export default { strategy: strategy, component: component };
