import React from 'react';
import GenericResourcePage from '../GenericResourcePage';

const PermissionsPage = () => {
    return (
        <GenericResourcePage
            title="Permissions"
            tableName="permissions"
            columns={[
                { key: 'name', label: 'Permission', type: 'text' },
                { key: 'description', label: 'Description', type: 'text' },
            ]}
            fields={[
                { key: 'name', label: 'Permission Name', type: 'text', required: true },
                { key: 'slug', label: 'Slug', type: 'text', required: true },
                { key: 'description', label: 'Description', type: 'textarea' },
            ]}
        />
    );
};

export default PermissionsPage;
