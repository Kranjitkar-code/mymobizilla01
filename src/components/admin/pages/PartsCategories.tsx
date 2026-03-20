import React from 'react';
import GenericResourcePage from '../GenericResourcePage';

const PartsCategoriesPage = () => {
    return (
        <GenericResourcePage
            title="Parts Categories"
            entityLabel="Category"
            entityLabelPlural="Parts categories"
            sectionTitle="All parts categories"
            tableName="parts_categories"
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

export default PartsCategoriesPage;
