import React from 'react';
import GenericResourcePage from '../GenericResourcePage';

const UsersPage = () => {
    return (
        <GenericResourcePage
            title="Users"
            entityLabel="User"
            entityLabelPlural="Users"
            tableName="users"
            searchKeys={['name', 'email', 'role']}
            columns={[
                { key: 'name', label: 'Name', type: 'text' },
                { key: 'email', label: 'Email', type: 'text' },
                { key: 'role', label: 'Role', type: 'text' },
            ]}
            fields={[
                { key: 'name', label: 'Full Name', type: 'text', required: true },
                { key: 'email', label: 'Email', type: 'text', required: true },
                { key: 'role', label: 'Role', type: 'text', required: true },
                { key: 'phone', label: 'Phone', type: 'text' },
            ]}
        />
    );
};

export default UsersPage;
