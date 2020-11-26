'use strict'

// import katex from 'katex';
import React, { useState } from 'react'

import Infobox from '../customBlock/Infobox'

export default class TeXBlock extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editMode: false,
            data: {},
        }

        // handle content block clicking
        this._onClick = () => {
            if (this.state.editMode) {
                return
            }
            console.log(this._getValue())
            this.setState(
                {
                    editMode: true,
                    // title: this._getValue().title, //if there's existing content, then fetch it.
                    // body: this._getValue().body, //if there's existing content, then fetch it.
                },
                () => {
                    this._startEdit() //after set state, start editting.
                }
            )
        }

        this._onValueChange = (e) => {
            this.setState({
                ...this.state,
                invalidTextFomat: false,
                [e.target.name]: e.target.value,
            })
        }

        this._save = (e) => {
            e.preventDefault()
            const { block, contentState } = this.props
            //   get entityKey and newContentState with new entity content
            var entityKey = block.getEntityAt(0)
            var newContentState = contentState.mergeEntityData(entityKey, {
                content: {
                    title: this.state.title,
                    body: this.state.body,
                },
            })

            //   clear edit state, and call finishEdit
            this.setState(
                {
                    invalidTextFomat: false,
                    editMode: false,
                    title: null,
                    body: null,
                },
                this._finishEdit.bind(this, newContentState)
            )
        }

        this._remove = () => {
            this.props.blockProps.onRemove(this.props.block.getKey())
        }
        this._startEdit = () => {
            const { blockProps, block } = this.props

            blockProps.onStartEdit(block.getKey())
        }
        this._finishEdit = (newContentState) => {
            const { blockProps, block } = this.props

            blockProps.onFinishEdit(block.getKey(), newContentState)
        }
    }

    _getValue() {
        const { contentState, block } = this.props
        const entity = contentState.getEntity(block.getEntityAt(0))
        const entityData = entity.getData()['content']

        return entityData
    }

    componentDidMount() {
        this.setState({ ...this.state, data: this._getValue() })
    }

    render() {
        // var texContent = null
        // let title = null
        // let body = null
        // if (this.state.editMode) {
        //     if (this.state.invalidTextFomat) {
        //         title = ''
        //         body = ''
        //     } else {
        //         title = this.state.title
        //         body = this.state.body
        //     }
        // } else {
        //     title = this._getValue().title
        //     body = this._getValue().body
        // }

        var className = 'textInput-tex'
        if (this.state.editMode) {
            className += ' textInput-activeTeX'
        }

        var editPanel = null
        if (editMode) {
            var buttonClass = 'textInput-saveButton'
            if (invalidTextFomat) {
                buttonClass += ' textInput-invalidButton'
            }

            editPanel = (
                <div className="textInput-panel">
                    <input
                        className="textInput-input"
                        onChange={this._onValueChange}
                        value={this.state.title}
                        name="title"
                    />
                    <textarea
                        className="textInput-textarea"
                        onChange={this._onValueChange}
                        value={this.state.body}
                        name="body"
                    />
                    <div className="textInput-buttons">
                        <button
                            className={buttonClass}
                            disabled={this.state.invalidTextFomat}
                            onClick={this._save}
                        >
                            {this.state.invalidTextFomat
                                ? 'Invalid TeX'
                                : 'Done'}
                        </button>
                        <button
                            className="textInput-removeButton"
                            onClick={this._remove}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            )
        }

        return (
            <div>
                <Infobox
                    data={this.state.data}
                    editMode={this.state.editMode}
                    invalidTextFomat={this.state.invalidTextFomat}
                />
            </div>
        )
    }
}
