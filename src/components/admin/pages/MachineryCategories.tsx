import React from 'react';
import GenericResourcePage from '../GenericResourcePage';

const MachineryCategoriesPage = () => {
    return (
        <GenericResourcePage
            title="Machinery Categories"
            entityLabel="Category"
            entityLabelPlural="Machinery categories"
            sectionTitle="All machinery categories"
            tableName="machinery_categories"
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

export default MachineryCategoriesPage;
