import React from 'react';
import GenericResourcePage from '../GenericResourcePage';

const SecondhandInventoryPage = () => {
    return (
        <GenericResourcePage
            title="Secondhand Inventory"
            tableName="secondhand_inventory"
            columns={[
                { key: 'image_url', label: 'Image', type: 'image' },
                { key: 'name', label: 'Device Name', type: 'text' },
                { key: 'condition', label: 'Condition', type: 'text' },
                { key: 'price', label: 'Price (₨)', type: 'text' },
                { key: 'status', label: 'Status', type: 'text' },
            ]}
            fields={[
                { key: 'name', label: 'Device Name', type: 'text', required: true },
                { key: 'brand', label: 'Brand', type: 'text', required: true },
                { key: 'model', label: 'Model', type: 'text', required: true },
                { key: 'condition', label: 'Condition (e.g. Good, Fair)', type: 'text', required: true },
                { key: 'price', label: 'Selling Price (₨)', type: 'text', required: true },
                { key: 'status', label: 'Status (available/sold)', type: 'text' },
                { key: 'description', label: 'Description', type: 'textarea' },
                { key: 'image_url', label: 'Image', type: 'image', bucketName: 'product-images' },
            ]}
            searchKey="name"
        />
    );
};

export default SecondhandInventoryPage;
