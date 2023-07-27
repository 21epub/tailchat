import React, { PropsWithChildren } from 'react';
import {
  DevContainer,
  GroupPanelType,
  isValidStr,
  t,
  useDMConverseList,
  useGroupInfo,
} from 'tailchat-shared';
import { useParams } from 'react-router';
import { GroupHeader } from './GroupHeader';
import { GroupSection } from '@/components/GroupSection';
import { CommonSidebarWrapper } from '@/components/CommonSidebarWrapper';
import { SidebarItem } from './SidebarItem';
import { Icon } from 'tailchat-design';
import { openModal } from '@/components/Modal';
import { CreateDMConverse } from '@/components/modals/CreateDMConverse';
import { SidebarDMItem } from '../Personal/SidebarDMItem';
const SidebarSection: React.FC<
  PropsWithChildren<{
    action: React.ReactNode;
  }>
> = React.memo((props) => {
  return (
    <div className="h-10 text-gray-900 dark:text-white flex pt-4 px-2">
      <span className="flex-1 overflow-hidden overflow-ellipsis text-xs text-gray-700 dark:text-gray-300">
        {props.children}
      </span>
      <div className="text-base opacity-70 hover:opacity-100 cursor-pointer">
        {props.action}
      </div>
    </div>
  );
});
SidebarSection.displayName = 'SidebarSection';
/**
 * 群组面板侧边栏组件
 */
export const Sidebar: React.FC = React.memo(() => {
  const { groupId = '' } = useParams<{ groupId: string }>();
  const groupInfo = useGroupInfo(groupId);
  const groupPanels = groupInfo?.panels ?? [];
  const converseList = useDMConverseList();
  return (
    <CommonSidebarWrapper data-tc-role="sidebar-group">
      <GroupHeader groupId={groupId} />

      <div className="p-2 space-y-1 overflow-auto">
        {groupPanels
          .filter((panel) => !isValidStr(panel.parentId))
          .map((panel) =>
            panel.type === GroupPanelType.GROUP ? (
              <GroupSection key={panel.id} header={panel.name}>
                {groupPanels
                  .filter((sub) => sub.parentId === panel.id)
                  .map((sub) => (
                    <SidebarItem key={sub.id} groupId={groupId} panel={sub} />
                  ))}
              </GroupSection>
            ) : (
              <SidebarItem key={panel.id} groupId={groupId} panel={panel} />
            )
          )}

        <SidebarSection
          action={
            <DevContainer>
              <Icon
                icon="mdi:plus"
                onClick={() => openModal(<CreateDMConverse />)}
              />
            </DevContainer>
          }
        >
          {t('私信')}
        </SidebarSection>

        {converseList.map((converse) => {
          return <SidebarDMItem key={converse._id} converse={converse} />;
        })}
      </div>
    </CommonSidebarWrapper>
  );
});
Sidebar.displayName = 'Sidebar';
