import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { EditorState, Modifier } from 'draft-js';
import { getEntityRange, getSelectionEntity } from 'draftjs-utils';
import { Videocam } from '@material-ui/icons';

import GridSelector from '../../components/GridSelector'
import { setPages, setData } from '../../utils/fetchData';
import { getUrlExtension } from '../../utils/common';

const dataConfig = {
    list: 'Video',
    columns: ['title', 'description', 'url'],
    maxItemsPerPage: 8,
}

const Video = (props) => {
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
        contentState = contentState.createEntity('VIDEO', 'IMMUTABLE', selectedData);
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

    const VideoTile = props => {
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
                        position: 'relative',
                        paddingTop: '56%',
                        overflow: 'hidden',
                        margin: '1px',
                    }}
                >
                    <video
                        style={{
                            top: 0,
                            left: 0,
                            height: '100%',
                            width: '100%',
                            position: 'absolute',
                            objectFit: 'cover',
                            objectPosition: 'center',
                        }}
                        controls>
                        <source src={data.url} type={`video/${getUrlExtension(data.url)}`} />
                    </video>
                </div>
                <div
                    style={{
                        width: '100%',
                        minHeight: '44%',
                        maxHeight: '44%',
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
                            margin: '8px 8px'
                        }}
                    >
                        {data.title}
                    </p>
                    <p
                        style={{
                            fontSize: '10px',
                            fontFamily: 'Noto Sans TC,sans-serif',
                            margin: '0px 8px',
                            overflow: 'hidden',
                            flex: 1
                        }}
                    >
                        {data.description}
                    </p>
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
            ButtonIconComponent={Videocam}
            TileComponent={VideoTile}
            ratio={1.6}
            spacing={4}
        />
    );
}

Image.propTypes = {
    onChange: PropTypes.func,
    editorState: PropTypes.object,
}

export default Video;
