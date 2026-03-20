import React from 'react';
import GenericResourcePage from '../GenericResourcePage';

const PartsPage = () => {
    return (
        <GenericResourcePage
            title="Parts"
            tableName="parts"
            columns={[
                { key: 'image_url', label: 'Image', type: 'image' },
                { key: 'name', label: 'Name', type: 'text' },
                { key: 'price', label: 'Price', type: 'text' },
            ]}
            fields={[
                { key: 'name', label: 'Name', type: 'text', required: true },
                { key: 'description', label: 'Description', type: 'textarea' },
                { key: 'price', label: 'Price', type: 'number', required: true },
                { key: 'stock', label: 'Stock', type: 'number' },
                { key: 'image_url', label: 'Image', type: 'image', bucketName: 'product-images' },
            ]}
        />
    );
};

export default PartsPage;
