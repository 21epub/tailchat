import { Problem } from '@/components/Problem';
import React from 'react';
import { Route, Routes } from 'react-router';
import { t } from 'tailchat-shared';
import { PageContent } from '../PageContent';
import { InboxContent } from './Content';
import { MonicaSidebar } from './Sidebar';

export const Monica: React.FC = React.memo(() => {
  return (
    <PageContent data-tc-role="content-monica" sidebar={<MonicaSidebar />}>
      <Routes>
        <Route path="/" element={<InboxNoSelect />} />
      </Routes>
    </PageContent>
  );
});
Monica.displayName = 'Monica';

const InboxNoSelect: React.FC = React.memo(() => {
  return <div>hello</div>;
});
InboxNoSelect.displayName = 'InboxNoSelect';
