import React from 'react';
import GenericResourcePage from '../GenericResourcePage';

const TestimonialsPage = () => {
    return (
        <GenericResourcePage
            title="Testimonials"
            tableName="testimonials"
            columns={[
                { key: 'name', label: 'Name', type: 'text' },
                { key: 'rating', label: 'Rating', type: 'text' },
            ]}
            fields={[
                { key: 'name', label: 'Customer Name', type: 'text', required: true },
                { key: 'content', label: 'Testimonial', type: 'textarea', required: true },
                { key: 'rating', label: 'Rating (1-5)', type: 'number' },
                { key: 'image_url', label: 'Customer Image', type: 'image', bucketName: 'testimonials' },
            ]}
        />
    );
};

export default TestimonialsPage;
