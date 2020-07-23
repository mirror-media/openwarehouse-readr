import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AtomicBlockUtils, EditorState, Modifier } from 'draft-js';
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
        const contentState = editorState.getCurrentContent();
        const entityKey = editorState
            .getCurrentContent()
            .createEntity('AUDIO', 'IMMUTABLE', selectedData)
            .getLastCreatedEntityKey();
        const newEditorState = AtomicBlockUtils.insertAtomicBlock(
            editorState,
            entityKey,
            ' ',
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
