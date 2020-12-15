import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AudioSelector from '../components/AudioSelector'

export class AudioEditingBlock extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {
            apiPath,
            onToggle,
            toggleModal,
            selectionLimit,
            isModalOpen,
        } = this.props
        return (
            <AudioSelector
                apiPath={apiPath}
                isSelectionOpen={isModalOpen}
                onChange={onToggle}
                onFinish={toggleModal}
                selectionLimit={selectionLimit}
            />
        )
    }
}

AudioEditingBlock.propTypes = {
    apiPath: PropTypes.string,
    isModalOpen: PropTypes.bool,
    onToggle: PropTypes.func,
    selectedAudios: PropTypes.array,
    selectionLimit: PropTypes.number,
    toggleModal: PropTypes.func,
}

AudioEditingBlock.defaultProps = {
    apiPath: 'audios',
    isModalOpen: false,
    selectedAudios: [],
    selectionLimit: 1,
}

export default AudioEditingBlock
