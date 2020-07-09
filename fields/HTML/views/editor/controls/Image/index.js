import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { EditorState, Modifier } from 'draft-js';
import { getEntityRange, getSelectionEntity } from 'draftjs-utils';
import { PanoramaOutlined } from '@material-ui/icons'

import GridSelector from '../../components/GridSelector'
import { setPages, setData } from '../../utils/fetchData';

const dataConfig = {
    list: 'Image',
    columns: ['title', 'urlDesktopSized'],
    maxItemsPerPage: 12,
}

const Image = (props) => {
    const { onChange, editorState } = props;
    const [pageNumbers, setPageNumbers] = useState(0);
    const [page, setPage] = useState(1);
    const [pagedData, setPagedData] = useState([]);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        setPages(dataConfig, searchText, setPageNumbers);
    }, [searchText])

    useEffect(() => {
        setData(dataConfig, searchText, page, setPagedData);
    }, [searchText, pageNumbers, page])

    const saveData = selectedData => {
        const currentEntity = getSelectionEntity(editorState);
        let selection = editorState.getSelection();

        if (currentEntity) {
            const entityRange = getEntityRange(editorState, currentEntity);
            const isBackward = selection.getIsBackward();
            if (isBackward) {
                selection = selection.merge({
                    anchorOffset: entityRange.end,
                    focusOffset: entityRange.start,
                });
            } else {
                selection = selection.merge({
                    anchorOffset: entityRange.start,
                    focusOffset: entityRange.end,
                });
            }
        }

        let contentState = editorState.getCurrentContent();
        contentState = Modifier.splitBlock(contentState, selection);
        contentState = contentState.createEntity('IMAGE', 'IMMUTABLE', selectedData);
        const entityKey = contentState.getLastCreatedEntityKey();

        contentState = Modifier.replaceText(
            contentState,
            selection,
            ' ',
            undefined,
            entityKey
        );

        const newEditorState = EditorState.push(
            editorState,
            contentState,
            'insert-characters'
        );

        onChange(newEditorState);
    }

    const ImageTile = props => {
        const { id, data, eventHandler } = props;
        const onClick = event => eventHandler(id);

        return (
            <img
                id={id}
                src={data.urlDesktopSized}
                alt={data.title}
                style={{
                    objectFit: 'cover',
                    height: '100%',
                    width: '100%',
                }}
                onClick={onClick}
            />
        );
    };

    const ImageEditingTile = props => {
        const { data } = props;
        return (
            <img
                src={data.urlDesktopSized}
                alt={data.title}
                style={{
                    objectFit: 'cover',
                    height: '100%',
                    width: '100%',
                }}
            />
        );
    };

    return (
        <GridSelector
            pageNumbers={pageNumbers}
            page={page}
            pagedData={pagedData}
            searchText={searchText}
            onPageChange={setPage}
            onSearchTextChange={setSearchText}
            onChange={saveData}
            ButtonIconComponent={PanoramaOutlined}
            TileComponent={ImageTile}
            EditingTileComponent={ImageEditingTile}
        />
    );
}

Image.propTypes = {
    onChange: PropTypes.func,
    editorState: PropTypes.object,
}

export default Image;
