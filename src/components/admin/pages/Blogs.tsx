import React from 'react';
import GenericResourcePage from '../GenericResourcePage';

const BlogsPage = () => {
    return (
        <GenericResourcePage
            title="Blogs"
            entityLabel="Blog Post"
            entityLabelPlural="Blog posts"
            sectionTitle="All blog posts"
            tableName="blogs"
            searchKey="title"
            dialogContentClassName="sm:max-w-2xl"
            columns={[
                { key: 'cover_url', label: 'Cover', type: 'image' },
                { key: 'title', label: 'Title', type: 'text' },
                { key: 'published', label: 'Published', type: 'boolean' },
                { key: 'created_at', label: 'Created', type: 'text' },
            ]}
            fields={[
                { key: 'title', label: 'Title', type: 'text', required: true },
                { key: 'excerpt', label: 'Excerpt', type: 'textarea', textareaRows: 4 },
                { key: 'content', label: 'Content', type: 'textarea', textareaRows: 16 },
                { key: 'cover_url', label: 'Cover image URL', type: 'text' },
                { key: 'published', label: 'Published (live on site)', type: 'boolean' },
            ]}
            onBeforeEdit={(row) => ({
                ...row,
                cover_url: row.cover_url ?? row.image_url ?? '',
            })}
            onBeforeSave={(data) => {
                const { image_url, ...rest } = data as Record<string, unknown>;
                return {
                    ...rest,
                    cover_url: rest.cover_url ?? image_url ?? '',
                    published: Boolean(rest.published),
                };
            }}
        />
    );
};

export default BlogsPage;
