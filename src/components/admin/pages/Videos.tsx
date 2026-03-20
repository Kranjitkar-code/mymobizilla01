import React from 'react';
import GenericResourcePage from '../GenericResourcePage';

const VideosPage = () => {
    return (
        <GenericResourcePage
            title="Our Video Lists"
            tableName="videos"
            columns={[
                { key: 'thumbnail_url', label: 'Thumbnail', type: 'image' },
                { key: 'title', label: 'Title', type: 'text' },
                { key: 'video_url', label: 'Video URL', type: 'text' },
            ]}
            fields={[
                { key: 'title', label: 'Title', type: 'text', required: true },
                { key: 'video_url', label: 'Video URL (YouTube/Vimeo)', type: 'text', required: true },
                { key: 'description', label: 'Description', type: 'textarea' },
                { key: 'thumbnail_url', label: 'Thumbnail', type: 'image', bucketName: 'video-thumbnails' },
            ]}
        />
    );
};

export default VideosPage;
