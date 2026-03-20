import React from 'react';
import GenericResourcePage from '../GenericResourcePage';

const TeamMembersPage = () => {
    return (
        <GenericResourcePage
            title="Team Members"
            entityLabel="Team Member"
            entityLabelPlural="Team Members"
            tableName="team_members"
            columns={[
                { key: 'photo_url', label: 'Photo', type: 'image' },
                { key: 'name', label: 'Name', type: 'text' },
                { key: 'role', label: 'Role', type: 'text' },
            ]}
            fields={[
                { key: 'name', label: 'Name', type: 'text', required: true },
                { key: 'role', label: 'Role', type: 'text', required: true },
                { key: 'bio', label: 'Bio', type: 'textarea' },
                { key: 'photo_url', label: 'Photo', type: 'image', bucketName: 'team-photos' },
            ]}
        />
    );
};

export default TeamMembersPage;
