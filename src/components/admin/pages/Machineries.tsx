import React from 'react';
import GenericResourcePage from '../GenericResourcePage';

const MachineriesPage = () => {
    return (
        <GenericResourcePage
            title="Machineries"
            tableName="machineries"
            columns={[
                { key: 'image_url', label: 'Image', type: 'image' },
                { key: 'name', label: 'Name', type: 'text' },
                { key: 'model', label: 'Model', type: 'text' },
            ]}
            fields={[
                { key: 'name', label: 'Name', type: 'text', required: true },
                { key: 'model', label: 'Model', type: 'text' },
                { key: 'description', label: 'Description', type: 'textarea' },
                { key: 'image_url', label: 'Image', type: 'image', bucketName: 'product-images' },
            ]}
        />
    );
};

export default MachineriesPage;
