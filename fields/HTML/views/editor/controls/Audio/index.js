import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { EditorState, Modifier } from 'draft-js';
import { getEntityRange, getSelectionEntity } from 'draftjs-utils';
import { GraphicEq } from '@material-ui/icons';

import GridSelector from '../../components/GridSelector'
import { setPages, setData } from '../../utils/fetchData';
import { getUrlExtension } from '../../utils/common';

const dataConfig = {
    list: 'Audio',
    columns: ['title', 'url'],
    maxItemsPerPage: 12,
}

const Audio = (props) => {
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
        contentState = contentState.createEntity('AUDIO', 'IMMUTABLE', selectedData);
        const entityKey = contentState.getLastCreatedEntityKey();

        contentState = Modifier.replaceText(
            contentState,
            selection,
            ' ',
            undefined,
            entityKey
        );

        let newEditorState = EditorState.push(
            editorState,
            contentState,
            'insert-characters'
        );

        // add an whitespacce block after content
        contentState = newEditorState.getCurrentContent();
        contentState = Modifier.splitBlock(contentState, selection);
        contentState = Modifier.replaceText(
            contentState,
            selection,
            ' ',
            undefined,
            undefined
        );

        newEditorState = EditorState.push(
            newEditorState,
            contentState,
            'insert-characters'
        );

        onChange(newEditorState);
    }

    const AudioTile = props => {
        const { id, data, eventHandler } = props;
        const onClick = event => eventHandler(id);

        return (
            <div
                id={id}
                onClick={onClick}
                style={{
                    border: '2px dotted #D84315',
                    borderRadius: 2,
                    height: 'calc(100% - 4px)',
                }}
            >
                <div
                    style={{
                        width: '100%',
                        minHeight: '50%',
                        maxHeight: '50%',
                        paddingTop: '4px',
                        paddingBottom: '4px',
                        wordWrap: 'break-word',
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <p
                        style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            fontFamily: 'Noto Sans TC,sans-serif',
                            margin: '8px 10px 4px',
                            overflow: 'hidden',
                            flex: 1
                        }}
                    >
                        {data.title}
                    </p>
                </div>
                <div
                    style={{
                        height: '50%',
                        position: 'relative',
                        overflow: 'hidden',
                        margin: '1px',
                    }}
                >
                    <audio
                        style={{
                            marginBottom: '6px',
                            marginLeft: '6px',
                            height: '90%',
                            width: '90%',
                        }}
                        controls>
                        <source src={data.url} type={`audio/${getUrlExtension(data.url)}`} />
                    </audio>
                </div>
            </div >
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
            ButtonIconComponent={GraphicEq}
            TileComponent={AudioTile}
            ratio={4}
            spacing={4}
        />
    );
}

Image.propTypes = {
    onChange: PropTypes.func,
    editorState: PropTypes.object,
}

export default Audio;
