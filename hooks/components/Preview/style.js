export default {
    root: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: 6,
    },
    popover: {
        '& .MuiPopover-paper': {
            width: '86%',
            height: '86%',
            minWidth: '400px',
            top: '50% !important',
            left: '50% !important',
            transform: 'translate(-50%, -50%) !important',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
        },
    },
}