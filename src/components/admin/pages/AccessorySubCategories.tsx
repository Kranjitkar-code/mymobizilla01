import React from 'react';
import GenericResourcePage from '../GenericResourcePage';

const AccessorySubCategoriesPage = () => {
    return (
        <GenericResourcePage
            title="Accessory Sub Categories"
            entityLabel="Subcategory"
            entityLabelPlural="Accessory subcategories"
            sectionTitle="All accessory subcategories"
            tableName="accessory_sub_categories"
            searchKeys={['name', 'category_id']}
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

export default AccessorySubCategoriesPage;
