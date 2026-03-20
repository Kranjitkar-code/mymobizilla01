import React from 'react';
import GenericResourcePage from '../GenericResourcePage';

const AccessoriesPage = () => {
    return (
        <GenericResourcePage
            title="Accessories"
            entityLabel="Accessory"
            entityLabelPlural="Accessories"
            tableName="accessories"
            columns={[
                { key: 'image_url', label: 'Image', type: 'image' },
                { key: 'name', label: 'Name', type: 'text' },
                { key: 'price', label: 'Price', type: 'text' },
                { key: 'stock', label: 'Stock', type: 'text' },
            ]}
            fields={[
                { key: 'name', label: 'Name', type: 'text', required: true },
                { key: 'description', label: 'Description', type: 'textarea' },
                { key: 'price', label: 'Price', type: 'number', required: true },
                { key: 'stock', label: 'Stock Quantity', type: 'number' },
                { key: 'image_url', label: 'Image', type: 'image', bucketName: 'product-images' },
            ]}
        />
    );
};

export default AccessoriesPage;
