'use strict'
// import { Button, Modal, Pagination } from 'elemental';
import { Button, Dialog, Pagination } from 'element-react'

import { parseImageAPIResponse } from '../../../lib/parseAPIResponse'
// import ImagesEditor from './ImagesEditor'
// import ImageSelection from './ImageSelection'
import SelectorMixin from './mixins/SelectorMixin'
import React, { Component } from 'react'
import merge from 'lodash/merge'

const _ = {
    merge,
}

const PAGINATION_LIMIT = 10

export class ImageSelector extends SelectorMixin {
    constructor(props) {
        super(props)
        this.state = {
            selectedItems: props.selectedImages,
            isSelectionOpen: props.isSelectionOpen,
        }
    }

    componentWillReceiveProps(nextProps) {
        let props = {}
        this.setState({
            ...this.state,
            isSelectionOpen: nextProps.isSelectionOpen,
        })
    }

    loadItems(querstring = '') {
        // return new Promise((resolve, reject) => {
        //     super
        //         .loadItems(querstring)
        //         .then((images) => {
        //             resolve(
        //                 images.map((image) => {
        //                     // return parseImageAPIResponse(image)
        //                     return parseImageAPIResponse(image)
        //                 })
        //             )
        //         })
        //         .catch((err) => reject(err))
        // })
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
                title="Select image"
                visible={isSelectionOpen}
                onCancel={this.handleCancel}
                // width="large"
                // backdropClosesModal
            >
                <Dialog.Body>
                    <div
                        style={{
                            marginBottom: '30px',
                            borderBottom: '3px solid',
                        }}
                    >
                        {/* {this._renderSearchFilter()} */}
                        {/* <ImageSelection
                            images={items}
                            selectedImages={selectedItems}
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
                    <div>
                        {/* <ImagesEditor
                            images={selectedItems}
                            onChange={this.updateSelection}
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

// ImageSelector.propTypes = {
//     apiPath: PropTypes.string,
//     isSelectionOpen: PropTypes.bool,
//     onChange: PropTypes.func.isRequired,
//     onFinish: PropTypes.func.isRequired,
//     selectedImages: PropTypes.array,
//     selectionLimit: PropTypes.number,
// }

ImageSelector.defaultProps = {
    apiPath: '',
    isSelectionOpen: false,
    selectedImages: [],
    selectionLimit: 1,
}

export default ImageSelector
