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
  const { groupId = '' } = useParams<{
    groupId: string;
  }>();
  const groupInfo = useGroupInfo(groupId);
  console.log('[Group]', allParams);
  const routeMatch = (
    <Routes>
      <Route path="/:panelId" element={<GroupPanelRoute />} />
      <Route path="/" element={<GroupPanelRedirect />} />
    </Routes>
  );
  if (groupId.indexOf('com.msgbyte') != -1) {
    let ret = null;
    {
      pluginCustomPanel
        .filter((p) => p.position === 'personal')
        .map((p) => {
          console.log('[Group]p:', p);
          if (p.name.indexOf(groupId.trim()) != -1) {
            ret = (
              <PageContent data-tc-role="content-group" sidebar={<Sidebar />}>
                <SplitPanel className="flex-auto w-full">
                  <div>{routeMatch}</div>
                  <div>
                    <ErrorBoundary>
                      {React.createElement(p.render)}
                    </ErrorBoundary>
                  </div>
                </SplitPanel>
              </PageContent>
            );

            return false;
          }
          // <Route
          //   key={p.name}
          //   path={`/custom/${p.name}`}
          //   element={
          //     <ErrorBoundary>{React.createElement(p.render)}</ErrorBoundary>
          //   }
          // />
        });
    }

    return ret;
  }

  if (!groupInfo) {
    return <Problem text={t('群组未找到')} />;
  }

  const pinnedPanelId = groupInfo.pinnedPanelId;

  return (
    <GroupIdContextProvider value={groupId}>
      <PageContent data-tc-role="content-group" sidebar={<Sidebar />}>
        {isValidStr(pinnedPanelId) ? (
          <SplitPanel className="flex-auto w-full">
            <div>{routeMatch}</div>
            <div>
              <GroupPanelRender groupId={groupId} panelId={pinnedPanelId} />
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
