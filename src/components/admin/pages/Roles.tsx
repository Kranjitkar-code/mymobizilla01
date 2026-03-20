import React from 'react';
import GenericResourcePage from '../GenericResourcePage';

const RolesPage = () => {
    return (
        <GenericResourcePage
            title="Roles"
            tableName="roles"
            columns={[
                { key: 'name', label: 'Role', type: 'text' },
                { key: 'description', label: 'Description', type: 'text' },
            ]}
            fields={[
                { key: 'name', label: 'Role Name', type: 'text', required: true },
                { key: 'slug', label: 'Slug', type: 'text', required: true },
                { key: 'description', label: 'Description', type: 'textarea' },
            ]}
        />
    );
};

export default RolesPage;
