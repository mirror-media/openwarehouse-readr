// 'use strict'
// import { AudioGrid } from './AudioGrid'
import SelectionMixin from './mixins/SelectionMixin'
import React, { Component } from 'react'
import merge from 'lodash/merge'

const _ = {
    merge,
}

class AudioSelection extends SelectionMixin {
    constructor(props) {
        super(props)

        this.state = {
            items: props.audios,
            selectedItems: props.selectedAudios,
        }
    }

    // replacement of componentWillReceiveProps
    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            items: nextProps.audios,
            selectedItems: nextProps.selectedAudios,
        }
    }

    render() {
        return (
            // <AudioGrid
            //     audios={this.state.items}
            //     onSelect={this.handleSelect}
            //     selectedAudios={this.state.selectedItems}
            // />
            <h6>AudioGrid</h6>
        )
    }
}

// AudioSelection.propTypes = {
//     audios: PropTypes.array,
//     selectedAudios: PropTypes.array,
//     selectionLimit: PropTypes.number,
//     updateSelection: PropTypes.func.isRequired,
// }

AudioSelection.defaultProps = {
    audios: [],
    selectedAudios: [],
    selectionLimit: 1,
}

// module.exports = AudioSelection;
export default AudioSelection
