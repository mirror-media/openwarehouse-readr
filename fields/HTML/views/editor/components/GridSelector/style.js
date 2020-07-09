export default {
    root: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: 6,
    },
    icon: {
        border: '1px solid #F1F1F1',
        borderRadius: 2,
        minWidth: 25,
        height: 32,
        margin: '0 4px',
        padding: 5,
        cursor: 'pointer',
        background: 'white',
        color: 'black',
    },
    popover: {
        '& .MuiPopover-paper': {
            width: '80%',
            minWidth: '400px',
            top: '50% !important',
            left: '50% !important',
            transform: 'translate(-50%, -50%) !important',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
        },
    },
    header: {
        display: 'flex',
        flexFlow: 'row wrap',
        width: '98%',
        minHeight: 'fit-content',
        overflow: 'hidden',
    },
    body: {
        height: ({ width, defaultColumns, currentRows, ratio }) => {
            const height = width / defaultColumns / ratio;
            return `${0.84 * width / ratio - height * (defaultColumns - currentRows)}px`
        },
        overflowY: 'scroll',
    },
    search: {
        width: props => `${Math.ceil(props.width / 1440 * 80)}ch`,
        margin: '18px 12px 12px',
    },
    save: {
        margin: '18px 12px 12px',
        marginLeft: 'auto',
    },
    gridList: {
        width: 'auto',
        margin: '8px 1px 8px !important',
    },
    pagination: {
        width: 'max-content',
        margin: '16px auto',
    },
    pagedTitleCheckIcon: {
        color: 'red',
    },
    editingTile: {
        border: '2px dotted #D84315',
        borderRadius: 2,
        margin: 2,
    },
    editingTopTitleBar: {
        /* background:
            'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
            'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)', */
        background: 'none',
    },
    editingBottomTitleBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, ' +
            'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    editingClearIcon: {
        color: 'white',
    },
    editingTextField: {
        width: '99%',
        '& div': {
            '& input': {
                color: 'white',
            },
            '& fieldset': {
                border: 'none',
            },
        }
    },
}