import React from 'react';
import GenericResourcePage from '../GenericResourcePage';

const MachinerySubCategoriesPage = () => {
    return (
        <GenericResourcePage
            title="Machinery Sub Categories"
            tableName="machinery_sub_categories"
            columns={[
                { key: 'name', label: 'Name', type: 'text' },
                { key: 'category_id', label: 'Category', type: 'text' },
            ]}
            fields={[
                { key: 'name', label: 'Sub Category Name', type: 'text', required: true },
                { key: 'category_id', label: 'Category ID', type: 'text', required: true },
                { key: 'image_url', label: 'Image', type: 'image', bucketName: 'category-images' },
            ]}
        />
    );
};

export default MachinerySubCategoriesPage;
