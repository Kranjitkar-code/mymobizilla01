import React from 'react';
import GenericResourcePage from '../GenericResourcePage';

const WhyChooseUsPage = () => {
    return (
        <GenericResourcePage
            title="Why Choose Us"
            tableName="why_choose_us"
            columns={[
                { key: 'icon_url', label: 'Icon', type: 'image' },
                { key: 'title', label: 'Title', type: 'text' },
            ]}
            fields={[
                { key: 'title', label: 'Title', type: 'text', required: true },
                { key: 'description', label: 'Description', type: 'textarea', required: true },
                { key: 'icon_url', label: 'Icon', type: 'image', bucketName: 'icons' },
            ]}
        />
    );
};

export default WhyChooseUsPage;
