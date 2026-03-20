import React from 'react';
import GenericResourcePage from '../GenericResourcePage';

const InventoriesPage = () => {
    return (
        <GenericResourcePage
            title="Inventories"
            tableName="inventories"
            columns={[
                { key: 'name', label: 'Item Name', type: 'text' },
                { key: 'sku', label: 'SKU', type: 'text' },
                { key: 'quantity', label: 'Quantity', type: 'text' },
                { key: 'price', label: 'Price', type: 'text' },
            ]}
            fields={[
                { key: 'name', label: 'Item Name', type: 'text', required: true },
                { key: 'sku', label: 'SKU', type: 'text', required: true },
                { key: 'quantity', label: 'Quantity', type: 'text', required: true },
                { key: 'price', label: 'Price (₨)', type: 'text' },
                { key: 'description', label: 'Description', type: 'textarea' },
            ]}
            searchKey="name"
        />
    );
};

export default InventoriesPage;
