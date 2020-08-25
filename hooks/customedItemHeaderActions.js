import React from 'react';
import { ItemId, AddNewItem } from '@keystonejs/app-admin-ui/components';
import Preview from './components/Preview';

export default () => (
    <div>
        <ItemId />
        <AddNewItem />
        <Preview />
    </div>
)