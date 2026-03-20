import React from 'react';
import GenericResourcePage from '../GenericResourcePage';

const BlogsPage = () => {
    return (
        <GenericResourcePage
            title="Blogs"
            tableName="blogs"
            columns={[
                { key: 'image_url', label: 'Cover', type: 'image' },
                { key: 'title', label: 'Title', type: 'text' },
                { key: 'published', label: 'Published', type: 'boolean' },
            ]}
            fields={[
                { key: 'title', label: 'Title', type: 'text', required: true },
                { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
                { key: 'content', label: 'Content', type: 'textarea' },
                { key: 'published', label: 'Published', type: 'boolean' },
                { key: 'image_url', label: 'Cover Image', type: 'image', bucketName: 'blog-images' },
            ]}
        />
    );
};

export default BlogsPage;
