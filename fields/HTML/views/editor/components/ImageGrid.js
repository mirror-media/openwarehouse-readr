import React, { Component } from 'react'
import PropTypes from 'prop-types'

import objectAssign from 'object-assign'

class ImageItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            image: props.image,
            isSelected: props.isSelected,
        }
    }

    // replacement of componentWillReceiveProps
    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            isSelected: nextProps.isSelected,
            image: nextProps.image,
        }
    }

    _handleSelect(e) {
        if (typeof this.props.onSelect === 'function') {
            this.props.onSelect(e)
        }
    }

    _handleRemove(e) {
        this.props.onRemove(e)
    }

    render() {
        const { width, padding, doShowRemove, style } = this.props
        const { isSelected } = this.state
        const { url, id } = this.state.image
        const styles = {
            imageGridItem: objectAssign(
                {
                    boxSizing: 'border-box',
                    display: 'inline-block',
                    padding,
                    width: `${width}%`,
                },
                style
            ),
            imageWrapper: {
                backgroundImage: `url(${url})`,
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                cursor: 'pointer',
                paddingBottom: '100%',
                position: 'relative',
                textAlign: 'right',
                width: '100%',
            },
            iconWrapper: {
                height: '2rem',
                position: 'relative',
            },
        }

        let btStyle = {
            fontSize: '2em',
            color: 'rgb(44,162,252)',
            backgroundColor: 'white',
            borderRadius: '1rem',
            // position: 'absolute',
            // top: '0',
            // right: '0',
        }

        const bt = doShowRemove ? (
            <i
                className="fas fa-times-circle"
                onClick={this._handleRemove.bind(this)}
                style={btStyle}
            />
        ) : isSelected ? (
            <i className="fas fa-check-circle" style={btStyle} />
        ) : (
            <i className="fa" />
        )
        return (
            <div
                onClick={this._handleSelect.bind(this)}
                className="imageGridItem"
                style={styles.imageGridItem}
            >
                <div className="imageWrapper" style={styles.imageWrapper}>
                    <div className="iconWrapper" style={styles.iconWrapper}>
                        {bt}
                    </div>
                </div>
                {this.props.children}
            </div>
        )
    }
}
ImageItem.propTypes = {
    doShowRemove: PropTypes.bool,
    isSelected: PropTypes.bool,
    onRemove: PropTypes.func,
    onSelect: PropTypes.func,
    padding: PropTypes.number,
    style: PropTypes.object,
    url: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
}

ImageItem.defaultProps = {
    doShowRemove: false,
    isSelected: false,
    padding: 0,
    style: {},
    url: '',
    width: 100,
}

class ImageGrid extends Component {
    constructor(props) {
        super(props)
        this.state = {
            images: props.images,
            selectedImages: props.selectedImages,
        }
    }

    // replacement of componentWillReceiveProps
    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            images: nextProps.images,
            selectedImages: nextProps.selectedImages,
        }
    }

    _handleSelect(image) {
        this.props.onSelect(image)
    }

    render() {
        const { images, selectedImages } = this.state
        const { columns, padding } = this.props
        const width = Math.floor(100 / columns)
        const imageNodes = images.map((image, index) => {
            const isSelected = selectedImages.find((element) => {
                return element.id === image.id
            })
                ? true
                : false

            return (
                <ImageItem
                    key={image.id}
                    image={image}
                    isSelected={isSelected}
                    onSelect={this._handleSelect.bind(this, image)}
                    padding={padding}
                    width={width}
                />
            )
        })

        return <div className="imageGrid">{imageNodes}</div>
    }
}

ImageGrid.propTypes = {
    columns: PropTypes.number,
    images: PropTypes.array.isRequired,
    onSelect: PropTypes.func,
    padding: PropTypes.number,
    selectedImages: PropTypes.array,
}

ImageGrid.defaultProps = {
    columns: 4,
    images: [],
    padding: 10,
    selectedImages: [],
}

export { ImageGrid, ImageItem }
