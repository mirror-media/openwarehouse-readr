// 'use strict'
// import {
//     parseAudioAPIResponse,
//     parseImageAPIResponse,
// } from '../../../lib/parseAPIResponse'
import { Button, Input, Dialog, Pagination } from 'element-react'

import AudioSelection from './AudioSelection'
import SelectorMixin from './mixins/SelectorMixin'
import React from 'react'

// // lodash
// import forEach from 'lodash/forEach'
// import get from 'lodash/get'
// import merge from 'lodash/merge'
// import set from 'lodash/set'

// const _ = {
//     forEach,
//     get,
//     merge,
//     set,
// }

const PAGINATION_LIMIT = 10

export class AudioSelector extends SelectorMixin {
    constructor(props) {
        super(props)
        this.state = {
            ...this.state,
            selectedItems: props.selectedAudios,
            isSelectionOpen: props.isSelectionOpen,
        }
    }

    // replacement of componentWillReceiveProps
    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            // selectedItems: nextProps.selectedAudios,
            isSelectionOpen: nextProps.isSelectionOpen,
        }
    }

    loadItems(querystring = '') {
        return new Promise((resolve, reject) => {
            const dataConfig = {
                list: 'Audio',
                columns: ['title', 'url'],
                maxItemsPerPage: 12,
            }

            // call loadItemsFromGql in SelectorMixin
            this.loadItemsFromCMS(querystring, dataConfig)
                .then((items) => {
                    // const reFormatData = items.map((image) => {
                    //     // format fetched data's format
                    //     return parseImageAPIResponse(image)
                    // })

                    resolve(items)
                })
                .catch((err) => reject(err))
        })
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

    render() {
        if (this.state.error) {
            return <span>There is an error, please reload the page.</span>
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
                        <AudioSelection
                            audios={items}
                            selectedAudios={selectedItems}
                            selectionLimit={this.props.selectionLimit}
                            updateSelection={this.updateSelection}
                        />
                        <Pagination
                            pageSize={this.PAGE_SIZE}
                            total={this.state.total}
                            currentPage={this.state.currentPage}
                            onCurrentChange={this.handlePageSelect}
                            // limit={PAGINATION_LIMIT}
                        />
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
