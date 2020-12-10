// 'use strict'
// import { Button, FormInput, InputGroup } from 'elemental';
import React, { Component } from 'react'
import { Button, Input, Dialog, Pagination } from 'element-react'

import qs from 'qs'
import xhr from 'xhr'

import {
    fetchDataCountWithGql,
    fetchDataWithGql,
} from '../../../../fields/HTML/views/editor/utils/fetchData'

export class SelectorMixin extends Component {
    constructor(props) {
        super(props)

        // input in the search field
        this._searchInput = ''
        this.PAGE_SIZE = 12
        this.API = '/api/'

        this.state = {
            currentPage: 1,
            totalPage: 6,
            error: null,
            isSelectionOpen: props.isSelectionOpen,
            items: [],
            selectedItems: [],
            total: 0,
        }

        // method binding
        this.searchFilterChange = this._searchFilterChange.bind(this)
        this.updateSelection = this._updateSelection.bind(this)
        this.handlePageSelect = this._handlePageSelect.bind(this)
        this.searchByInput = this._searchByInput.bind(this)
        this.handleCancel = this._handleCancel.bind(this)
        this.handleSave = this._handleSave.bind(this)
    }

    componentDidMount() {
        this._getItems()
    }

    componentWillUnmount() {
        this._searchInput = ''
    }

    // replacement of componentWillReceiveProps
    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            isSelectionOpen: nextProps.isSelectionOpen,
            selectedItems: nextProps.selectedItems,
        }
    }

    _handleCancel() {
        this.toggleSelect(false)
        this.props.onFinish()
    }
    _handleSave() {
        this.toggleSelect(false)
        this.props.onChange(this.state.selectedItems)
        this.props.onFinish()
    }

    /** build query string for keystone api
     * @param {number} [page=0] - Page we used to calculate how many items we want to skip
     * @param {limit} [limit=6] - The number of items we want to get
     * @param {string} [input=''] - keyword for filtering
     * @return {Promise}
     */
    _buildQueryString(page = 0, limit = 6, input = '') {
        let queryString = {
            search: input,
            limit: limit,
            skip: page === 0 ? 0 : (page - 1) * limit,
            page: page,
        }
        return Promise.resolve(qs.stringify(queryString))
    }

    /** build query string for keystone api
     * @param {string[]} [filters=[]] - keywords for filtering
     * @param {number} [page=0] - Page we used to calculate how many items we want to skip
     * @param {limit} [limit=6] - The number of items we want to get
     * @return {string} a query string
     */
    _buildFilters(filters = [], page = 0, limit = 6) {
        // let queryString = {
        //     limit: limit,
        //     skip: page === 0 ? 0 : (page - 1) * limit,
        // }
        // return qs.stringify(queryString)
    }

    /** load items from keystone api
     * @param {string} [queryString=] - Query string for keystone api
     * @return {Promise}
     */
    async loadItemsFromCMS(queryString = '', dataConfig) {
        console.log('loadItems in SelectorMixin')
        const searchText = this._searchInput

        const pageInQueryString = parseInt(qs.parse(queryString).page)
        const currentPage = pageInQueryString
            ? pageInQueryString
            : this.state.currentPage

        const data = await fetchDataWithGql(dataConfig, searchText, currentPage)
        const totalData = await fetchDataCountWithGql(dataConfig, searchText)

        console.log(totalData)

        this.setState({ ...this.state, total: totalData })
        return data
    }

    _handlePageSelect(selectedPage) {
        this._buildQueryString(selectedPage, this.PAGE_SIZE, this._searchInput)
            .then((queryString) => {
                return this.loadItems(queryString)
            })
            .then(
                (items) => {
                    this.setState({
                        ...this.state,
                        items: items,
                        currentPage: selectedPage,
                    })
                },
                (reason) => {
                    this.setState({ ...this.state, error: reason })
                }
            )
    }

    _updateSelection(selectedItems) {
        this.setState({
            ...this.state,
            selectedItems: selectedItems,
        })
    }

    toggleSelect(visible) {
        this.setState({
            ...this.state,
            isSelectionOpen: visible,
        })
    }

    _getItems() {
        console.log('getItems')
        this._buildQueryString(this.state.currentPage, this.PAGE_SIZE)
            .then((queryString) => {
                // call loadItems in each selector's own loadItems
                return this.loadItems(queryString)
            })
            .then(
                async (items) => {
                    // await fetchAllDataCount()
                    this.setState({
                        ...this.state,
                        items: items,
                        total: 556,
                    })
                },
                (reason) => {
                    console.warn(reason)
                    this.setState({ ...this.state, error: reason })
                }
            )
    }

    _searchFilterChange(value) {
        this._searchInput = value
    }

    _searchByInput() {
        this.state.currentPage = 1
        this._buildQueryString(
            this.state.currentPage,
            this.PAGE_SIZE,
            this._searchInput
        )
            .then((queryString) => {
                return this.loadItems(queryString)
            })
            .then(
                (items) => {
                    this.setState({
                        items: items,
                        currentPage: 1,
                    })
                },
                (reason) => {
                    this.setState({
                        error: reason,
                    })
                }
            )
    }

    _renderSearchFilter() {
        // return (
        //     <InputGroup contiguous>
        //         <InputGroup.Section grow>
        //             <Input
        //                 type="text"
        //                 placeholder="請輸入關鍵字搜尋"
        //                 defaultValue={this._searchInput}
        //                 onChange={this.searchFilterChange}
        //             />
        //         </InputGroup.Section>
        //         <InputGroup.Section>
        //             <Button onClick={this.searchByInput}>Search</Button>
        //         </InputGroup.Section>
        //     </InputGroup>
        // )

        return (
            <div>
                <Input
                    type="text"
                    placeholder="請輸入關鍵字搜尋"
                    defaultValue={this._searchInput}
                    onChange={this.searchFilterChange}
                    append={
                        <Button onClick={this.searchByInput}>Search</Button>
                    }
                />
            </div>
        )
    }
}

export default SelectorMixin
