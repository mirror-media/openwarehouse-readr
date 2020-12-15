import React, { Component } from 'react'
import PropTypes from 'prop-types'

import raf from 'raf' // requestAnimationFrame polyfill
import get from 'lodash/get'
import ReactPlayer from 'react-player'

const _ = {
    get,
}

class VideoItem extends Component {
    constructor(props) {
        super(props)

        this.state = {
            playing: false,
            loaded: false,
        }
        this.handleToggle = this._handleToggle.bind(this)
        this.handleOnLoad = this._handleOnLoad.bind(this)
        this.handleOnEnd = this._handleOnEnd.bind(this)
        this.handleOnPlay = this._handleOnPlay.bind(this)
        this.renderSeekPos = this._renderSeekPos.bind(this)
    }

    componentWillUnmount() {
        this.clearRAF()
    }

    _handleToggle(e) {
        e.stopPropagation()
        this.setState({
            playing: !this.state.playing,
        })
    }

    _handleOnLoad() {
        this.setState({
            loaded: true,
            duration: this.player.duration(),
        })
    }

    _handleOnPlay() {
        this.setState({
            playing: true,
        })
        this.renderSeekPos()
    }

    _handleOnEnd() {
        this.setState({
            playing: false,
        })
        this.clearRAF()
    }

    _handleSelect(e) {
        e.stopPropagation()
        this.props.onSelect(e)
    }

    _renderSeekPos() {
        this.setState({
            seek: this.player.seek(),
        })
        if (this.state.playing) {
            this._raf = raf(this.renderSeekPos)
        }
    }

    clearRAF() {
        raf.cancel(this._raf)
    }

    render() {
        const {
            Video,
            coverPhoto,
            isSelected,
            title,
            description,
            width,
        } = this.props

        let style = {
            VideoItem: {
                border: isSelected ? '1px solid rgb(44,162,252)' : '',
                borderRadius: '10px',
                margin: '5px 0',
                boxSizing: 'border-box',
                display: 'inline-block',
                padding: '10px',
                width: `${width}%`,
            },
            infoTopic: {
                display: 'flex',
                flexDirection: 'row',
            },
        }
        return (
            <div
                onClick={this._handleSelect.bind(this)}
                style={style.VideoItem}
            >
                {/* <Video
                    content={[
                        {
                            url: Video,
                            coverPhoto,
                            title,
                            description,
                        },
                    ]}
                /> */}
                <ReactPlayer
                    url={Video}
                    controls={true}
                    width="100%"
                    height="20px"
                    style={{ margin: '5px 0' }}
                />
                <div className="info_container">
                    <div className="info_topic" style={style.infoTopic}>
                        <img src={coverPhoto} alt={title} />
                        <h5>{title}</h5>
                    </div>
                    <div className="info_detail">
                        <p>{description}</p>
                    </div>
                </div>
            </div>
        )
    }
}

VideoItem.propTypes = {
    Video: PropTypes.string,
    coverPhoto: PropTypes.object,
    description: PropTypes.string,
    doShowRemove: PropTypes.bool,
    isSelected: PropTypes.bool,
    onRemove: PropTypes.func,
    onSelect: PropTypes.func,
    title: PropTypes.string,
    width: PropTypes.number.isRequired,
}

VideoItem.defaultProps = {
    Video: '',
    coverPhoto: null,
    description: '',
    doShowRemove: false,
    isSelected: false,
    title: '',
    width: 100,
}

class VideoGrid extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Videos: props.Videos,
            selectedVideos: props.selectedVideos,
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            Videos: nextProps.Videos,
            selectedVideos: nextProps.selectedVideos,
        })
    }
    _handleSelect(Video) {
        this.props.onSelect(Video)
    }

    render() {
        const { Videos, selectedVideos } = this.state
        const { columns } = this.props
        const width = Math.floor(100 / columns)
        const VideoItems = Videos.map((Video, index) => {
            const isSelected = selectedVideos.find((element) => {
                return element.id === Video.id
            })
                ? true
                : false
            return (
                <VideoItem
                    Video={_.get(Video, 'url')}
                    coverPhoto={_.get(Video, 'coverPhoto')}
                    description={_.get(Video, 'description')}
                    isSelected={isSelected}
                    key={Video.id}
                    onSelect={this._handleSelect.bind(this, Video)}
                    title={_.get(Video, 'title')}
                    width={width}
                />
            )
        })

        return <div className="VideoGrid">{VideoItems}</div>
    }
}

VideoGrid.propTypes = {
    Videos: PropTypes.array.isRequired,
    columns: PropTypes.number,
    onSelect: PropTypes.func,
    padding: PropTypes.number,
    selectedVideos: PropTypes.array,
}

VideoGrid.defaultProps = {
    Videos: [],
    columns: 3,
    padding: 10,
    selectedVideos: [],
}

export { VideoGrid, VideoItem }
