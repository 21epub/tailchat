import React, { PropsWithChildren } from 'react';
import { Icon } from 'tailchat-design';
import { SidebarItem } from '../SidebarItem';
import {
  t,
  useDMConverseList,
  useUserInfo,
  DevContainer,
} from 'tailchat-shared';

import { openModal } from '@/components/Modal';
import { CreateDMConverse } from '@/components/modals/CreateDMConverse';
import { SectionHeader } from '@/components/SectionHeader';
import { CommonSidebarWrapper } from '@/components/CommonSidebarWrapper';
import { pluginCustomPanel } from '@/plugin/common';

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
 * 个人面板侧边栏组件
 */
export const MonicaSidebar: React.FC = React.memo(() => {
  const converseList = useDMConverseList();
  const userInfo = useUserInfo();

  return (
    <CommonSidebarWrapper data-tc-role="sidebar-personal">
      <SectionHeader>{'AIChatBot'}</SectionHeader>

      <div className="p-2 overflow-auto">
        <SidebarItem
          name={t('GPT-3.5')}
          icon={<Icon icon="mdi:puzzle" />}
          to="/main/personal/friends"
        />
        <SidebarItem
          name={t('GPT-4.0')}
          icon={<Icon icon="mdi:puzzle" />}
          to="/main/personal/plugins"
        />
        <SidebarItem
          name={t('Bard')}
          icon={<Icon icon="mdi:puzzle" />}
          to="/main/personal/plugins"
        />
        <SidebarItem
          name={t('Claude+')}
          icon={<Icon icon="mdi:puzzle" />}
          to="/main/personal/plugins"
        />
        <SidebarItem
          name={t('Claude-Instant-100k')}
          icon={<Icon icon="mdi:puzzle" />}
          to="/main/personal/plugins"
        />
      </div>
    </CommonSidebarWrapper>
  );
});
MonicaSidebar.displayName = 'MonicaSidebar';
