import React from 'react';
import GenericResourcePage from '../GenericResourcePage';

const OrdersPage = () => {
    return (
        <GenericResourcePage
            title="Orders"
            tableName="orders"
            columns={[
                { key: 'id', label: 'Order ID', type: 'text' },
                { key: 'customer_name', label: 'Customer', type: 'text' },
                { key: 'status', label: 'Status', type: 'text' },
                { key: 'total', label: 'Total', type: 'text' },
                { key: 'created_at', label: 'Date', type: 'text' },
            ]}
            fields={[
                { key: 'customer_name', label: 'Customer Name', type: 'text', required: true },
                { key: 'customer_email', label: 'Customer Email', type: 'text' },
                { key: 'customer_phone', label: 'Customer Phone', type: 'text' },
                { key: 'status', label: 'Status', type: 'text', required: true },
                { key: 'total', label: 'Total', type: 'number' },
                { key: 'notes', label: 'Notes', type: 'textarea' },
            ]}
            searchKey="customer_name"
        />
    );
};

export default OrdersPage;
