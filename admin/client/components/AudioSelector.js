// 'use strict'
// import {
//     parseAudioAPIResponse,
//     parseImageAPIResponse,
// } from '../../../lib/parseAPIResponse'
// import { Button, Modal, Pagination } from 'elemental'
import { Button, Input, Dialog, Pagination } from 'element-react'

import qs from 'qs'
import xhr from 'xhr'
// import AudioSelection from './AudioSelection'
import SelectorMixin from './mixins/SelectorMixin'
import React from 'react'

// lodash
import forEach from 'lodash/forEach'
import get from 'lodash/get'
import merge from 'lodash/merge'
import set from 'lodash/set'

const _ = {
    forEach,
    get,
    merge,
    set,
}

const PAGINATION_LIMIT = 10

export class AudioSelector extends SelectorMixin {
    constructor(props) {
        super(props)
        this.state.selectedItems = props.selectedAudios
    }

    componentWillReceiveProps(nextProps) {
        let props = {}
        _.merge(props, nextProps, { selectedItems: nextProps.selectedAudios })
        super.componentWillReceiveProps(props)
    }

    _loadImage(imageId) {
        // return new Promise((resolve, reject) => {
        //     if (!imageId) {
        //         return reject(new Error('Should provide imageId'))
        //     }
        //     xhr(
        //         {
        //             url: Keystone.adminPath + this.API + 'images/' + imageId,
        //             responseType: 'json',
        //         },
        //         (err, resp, data) => {
        //             if (err) {
        //                 console.error('Error loading item:', err)
        //                 return reject(err)
        //             }
        //             resolve(parseImageAPIResponse(data))
        //         }
        //     )
        // })
    }

    _loadCoverPhotoForAudio(audio) {
        // return new Promise((resolve, reject) => {
        //     let imageId = _.get(audio, ['fields', 'coverPhoto'])
        //     this._loadImage(imageId).then(
        //         (image) => {
        //             _.set(audio, ['fields', 'coverPhoto'], image)
        //             resolve(parseAudioAPIResponse(audio))
        //         },
        //         (err) => {
        //             resolve(parseAudioAPIResponse(audio))
        //         }
        //     )
        // })
    }

    _loadCoverPhotoForAudios(audios) {
        // return new Promise((resolve, reject) => {
        //     let promises = []
        //     _.forEach(audios, (audio) => {
        //         promises.push(this._loadCoverPhotoForAudio(audio))
        //     })
        //     Promise.all(promises).then(
        //         (audios) => {
        //             resolve(audios)
        //         },
        //         (err) => {
        //             reject(err)
        //         }
        //     )
        // })
    }

    loadItems(querystring = '') {
        // return new Promise((resolve, reject) => {
        //     super
        //         .loadItems(querystring)
        //         .then((audios) => {
        //             this._loadCoverPhotoForAudios(audios).then((audios) => {
        //                 resolve(audios)
        //             })
        //         })
        //         .catch((err) => reject(err))
        // })
    }

    /** build query string filtered by title for keystone api
     * @override
     * @param {string[]} [filters=[]] - keywords for filtering
     * @param {number} [page=0] - Page we used to calculate how many items we want to skip
     * @param {limit} [limit=10] - The number of items we want to get
     * @return {string} a query string
     */
    _buildFilters(filters = [], page = 0, limit = 10) {
        // let filterQuery = {
        //     title: {
        //         value: filters,
        //     },
        // }
        // let queryString = {
        //     filters: JSON.stringify(filterQuery),
        //     select: 'audio,description,title,coverPhoto',
        //     limit: limit,
        //     skip: page === 0 ? 0 : (page - 1) * limit,
        // }
        // return qs.stringify(queryString)
    }

    render() {
        if (this.state.error) {
            return (
                <span>
                    There is an error, please reload the page.{this.state.error}
                </span>
            )
        }

        const { isSelectionOpen, items, selectedItems } = this.state
        return (
            <Dialog
                title="Select Audio"
                visible={isSelectionOpen}
                onCancel={this.handleCancel}
            >
                <Dialog.Body>
                    <div>
                        {this._renderSearchFilter()}
                        {/* <AudioSelection
                            audios={items}
                            selectedAudios={selectedItems}
                            selectionLimit={this.props.selectionLimit}
                            updateSelection={this.updateSelection}
                        /> */}
                        {/* <Pagination
                            currentPage={this.state.currentPage}
                            onPageSelect={this.handlePageSelect}
                            pageSize={this.PAGE_SIZE}
                            total={this.state.total}
                            limit={PAGINATION_LIMIT}
                        /> */}
                    </div>
                </Dialog.Body>
                <Dialog.Footer>
                    <Button type="primary" onClick={this.handleSave}>
                        Save
                    </Button>
                    <Button type="link-cancel" onClick={this.handleCancel}>
                        Cancel
                    </Button>
                </Dialog.Footer>
            </Dialog>
        )
    }
}

// AudioSelector.propTypes = {
//     apiPath: PropTypes.string,
//     isSelectionOpen: PropTypes.bool,
//     onChange: PropTypes.func.isRequired,
//     onFinish: PropTypes.func.isRequired,
//     selectedAudios: PropTypes.array,
//     selectionLimit: PropTypes.number,
// }

AudioSelector.defaultProps = {
    apiPath: '',
    isSelectionOpen: false,
    selectedAudios: [],
    selectionLimit: 1,
}

export default AudioSelector
