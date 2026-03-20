import React from 'react';
import GenericResourcePage from '../GenericResourcePage';

const AccessoryCategoriesPage = () => {
    return (
        <GenericResourcePage
            title="Accessory Categories"
            entityLabel="Category"
            entityLabelPlural="Accessory categories"
            sectionTitle="All accessory categories"
            tableName="accessory_categories"
            columns={[
                { key: 'image_url', label: 'Image', type: 'image' },
                { key: 'name', label: 'Name', type: 'text' },
            ]}
            fields={[
                { key: 'name', label: 'Category Name', type: 'text', required: true },
                { key: 'image_url', label: 'Image', type: 'image', bucketName: 'category-images' },
            ]}
        />
    );
};

export default AccessoryCategoriesPage;
