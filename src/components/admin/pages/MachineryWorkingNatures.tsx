import React from 'react';
import GenericResourcePage from '../GenericResourcePage';

const MachineryWorkingNaturesPage = () => {
    return (
        <GenericResourcePage
            title="Machinery Working Natures"
            tableName="machinery_working_natures"
            columns={[
                { key: 'name', label: 'Name', type: 'text' },
            ]}
            fields={[
                { key: 'name', label: 'Name', type: 'text', required: true },
                { key: 'description', label: 'Description', type: 'textarea' },
            ]}
        />
    );
};

export default MachineryWorkingNaturesPage;
