import { Problem } from '@/components/Problem';
import React from 'react';
import { Route, Routes, useParams, Navigate } from 'react-router';
import { useUserSessionPreference } from '@/hooks/useUserPreference';
import { t } from 'tailchat-shared';
import { PageContent } from '../PageContent';
import { InboxContent } from './Content';
import { MonicaSidebar } from './Sidebar';
import { GroupPanelRender, GroupPanelRoute } from './Panel';
export const Monica: React.FC = React.memo(() => {
  return (
    <PageContent data-tc-role="content-monica" sidebar={<MonicaSidebar />}>
      <Routes>
        <Route path="/:monicaItemId" element={<InboxNoSelect />} />
        <Route path="/" element={<Navigate to={'/main/monica/GPT-3.5'} />} />
      </Routes>
    </PageContent>
  );
});
Monica.displayName = 'Monica';

const InboxNoSelect: React.FC = React.memo(() => {
  const { monicaItemId } = useParams();

  return (
    <div>
      <div>hello-{monicaItemId}</div>
      <GroupPanelRoute />
    </div>
  );
});
InboxNoSelect.displayName = 'InboxNoSelect';
