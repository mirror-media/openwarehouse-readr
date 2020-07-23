export default {
    pages: () => [
        {
            label: 'Content',
            children: ['Post', 'EditorChoice', 'Collaboration', 'Project', 'Quote', 'Data', 'Gallery', 'Image', 'Video', 'Audio'],
        },
        {
            label: 'Class',
            children: ['Category', 'Tag'],
        },
        {
            label: 'People',
            children: ['User', 'Author'],
        },
    ]
};