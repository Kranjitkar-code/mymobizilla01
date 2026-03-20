import React from 'react';
import GenericResourcePage from '../GenericResourcePage';

const RepairPage = () => {
    return (
        <GenericResourcePage
            title="Repair Services"
            tableName="repair_services"
            columns={[
                { key: 'image_url', label: 'Image', type: 'image' },
                { key: 'name', label: 'Service Name', type: 'text' },
                { key: 'price', label: 'Starting Price', type: 'text' },
            ]}
            fields={[
                { key: 'name', label: 'Service Name', type: 'text', required: true },
                { key: 'description', label: 'Description', type: 'textarea' },
                { key: 'price', label: 'Starting Price', type: 'number' },
                { key: 'image_url', label: 'Image', type: 'image', bucketName: 'service-images' },
            ]}
        />
    );
};

export default RepairPage;
