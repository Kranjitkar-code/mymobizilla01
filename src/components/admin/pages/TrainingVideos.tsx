import React from 'react';
import GenericResourcePage from '../GenericResourcePage';

const TrainingVideosPage = () => {
    return (
        <GenericResourcePage
            title="Training Videos"
            entityLabel="Video"
            entityLabelPlural="Training videos"
            sectionTitle="All training videos"
            tableName="training_videos"
            searchKey="title"
            fallbackData={[
                {
                    id: 'default-video-1',
                    title: 'Basic Mobile Repair Training',
                    video_url: 'https://youtu.be/kT4o4Vmvr3M',
                    description: 'Watch our basic mobile repair training session and learn fundamental repair techniques.',
                    thumbnail_url: 'https://img.youtube.com/vi/kT4o4Vmvr3M/maxresdefault.jpg',
                },
            ]}
            columns={[
                { key: 'thumbnail_url', label: 'Thumbnail', type: 'image' },
                { key: 'title', label: 'Title', type: 'text' },
                { key: 'video_url', label: 'Video URL', type: 'text' },
            ]}
            fields={[
                { key: 'title', label: 'Title', type: 'text', required: true },
                { key: 'video_url', label: 'Video URL (YouTube/Vimeo)', type: 'text', required: true },
                { key: 'description', label: 'Description', type: 'textarea' },
                { key: 'thumbnail_url', label: 'Thumbnail', type: 'image', bucketName: 'training-videos' },
            ]}
        />
    );
};

export default TrainingVideosPage;
