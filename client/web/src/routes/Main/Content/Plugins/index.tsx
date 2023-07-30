import { Problem } from '@/components/Problem';
import React from 'react';
import { Route, Routes } from 'react-router';
import { t } from 'tailchat-shared';
import { PageContent } from '../PageContent';
import { PluginsPanel } from '../Personal/Plugins';

export const Plugins: React.FC = React.memo(() => {
  return (
    <PageContent data-tc-role="content-inbox">
      <Routes>
        <Route path="/" element={<InboxNoSelect />} />
      </Routes>
    </PageContent>
  );
});
Plugins.displayName = 'Plugins';

const InboxNoSelect: React.FC = React.memo(() => {
  return (
    <div className="w-full">
      <PluginsPanel />
      {/* hello */}
      {/* <Problem text={t('提及(@)您的消息会在这里出现哦')} /> */}
    </div>
  );
});
InboxNoSelect.displayName = 'InboxNoSelect';
