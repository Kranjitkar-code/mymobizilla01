import React from 'react';
import GenericResourcePage from '../GenericResourcePage';

const MachineryBrandsPage = () => {
    return (
        <GenericResourcePage
            title="Machinery Brands"
            entityLabel="Brand"
            entityLabelPlural="Machinery brands"
            sectionTitle="All machinery brands"
            tableName="machinery_brands"
            columns={[
                { key: 'logo_url', label: 'Logo', type: 'image' },
                { key: 'name', label: 'Name', type: 'text' },
            ]}
            fields={[
                { key: 'name', label: 'Brand Name', type: 'text', required: true },
                { key: 'logo_url', label: 'Logo', type: 'image', bucketName: 'brand-logos' },
            ]}
        />
    );
};

export default MachineryBrandsPage;
