import { Problem } from '@/components/Problem';
import { SplitPanel } from '@/components/SplitPanel';
import { GroupIdContextProvider } from '@/context/GroupIdContext';
import React from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import { isValidStr, t, useGroupInfo } from 'tailchat-shared';
import { PageContent } from '../PageContent';
import { GroupPanelRender, GroupPanelRoute } from './Panel';
import { GroupPanelRedirect } from './PanelRedirect';
import { Sidebar } from './Sidebar';
import { pluginCustomPanel } from '@/plugin/common';
import { ErrorBoundary } from '@/plugin/component';

export const Group: React.FC = React.memo(() => {
  const allParams = useParams();
  const { groupId: groupId, '*': extId } = useParams();

  console.log('[Group]allParams', allParams, groupId, extId);
  const groupInfo = useGroupInfo(groupId);

  const routeMatch = (
    <Routes>
      <Route path="/:panelId" element={<GroupPanelRoute />} />
      <Route path="/" element={<GroupPanelRedirect />} />
    </Routes>
  );
  let isConverse = false;
  if (groupId == 'converse') {
    isConverse = true;
  }

  if (!isConverse && !groupInfo) {
    return <Problem text={t('群组未找到')} />;
  }

  const pinnedPanelId = isConverse ? extId : groupInfo.pinnedPanelId;
  console.log(
    '[Group]isValidStr',
    allParams,
    groupInfo,
    isValidStr(pinnedPanelId)
  );
  return (
    <GroupIdContextProvider value={groupId}>
      <PageContent data-tc-role="content-group" sidebar={<Sidebar />}>
        {isValidStr(pinnedPanelId) ? (
          <SplitPanel className="flex-auto w-full">
            <div>{routeMatch}</div>
            <div>
              <GroupPanelRender groupId={groupId} panelId={extId} />
            </div>
          </SplitPanel>
        ) : (
          routeMatch
        )}
      </PageContent>
    </GroupIdContextProvider>
  );
});
Group.displayName = 'Group';
