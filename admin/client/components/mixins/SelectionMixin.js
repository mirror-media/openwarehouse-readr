// 'use strict'

import React, { Component } from 'react'

export class SelectionMixin extends Component {
    constructor(props) {
        super(props)

        this.state = {
            items: props.items,
            selectedItems: props.selectedItems,
        }
        this.handleSelect = this._handleSelect.bind(this)
    }

    _handleSelect(item) {
        let _selectItems = this.state.selectedItems
        let filtered = _selectItems.filter((selectedItem) => {
            return selectedItem.id !== item.id
        })

        // select the item
        if (filtered.length === _selectItems.length) {
            // select many
            if (this.props.selectionLimit > 1) {
                const len = filtered.length
                if (len >= this.props.selectionLimit) {
                    filtered.shift()
                }
                // create a new array for pure render
                filtered = len === 0 ? [item] : filtered.concat(item)
            } else {
                filtered = [item]
            }
        }
        this.setState(
            {
                selectedItems: filtered,
            },
            () => {
                this.props.updateSelection(filtered)
            }
        )
    }
}

export default SelectionMixin
