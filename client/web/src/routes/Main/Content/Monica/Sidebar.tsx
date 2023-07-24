import React, { PropsWithChildren, useCallback, useState } from 'react';
import { Avatar, Icon } from 'tailchat-design';
import { SidebarItem } from '../SidebarItem';
import {
  t,
  useDMConverseList,
  useUserInfo,
  DevContainer,
  useAppSelector,
} from 'tailchat-shared';

import { ModalWrapper, closeModal, openModal } from '@/components/Modal';
import { CreateDMConverse } from '@/components/modals/CreateDMConverse';
import { SectionHeader } from '@/components/SectionHeader';
import { CommonSidebarWrapper } from '@/components/CommonSidebarWrapper';
import { pluginCustomPanel } from '@/plugin/common';
import clsx from 'clsx';
import { Button, Typography } from 'antd';
import { UserPicker } from '@/components/UserPicker/UserPicker';

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

  const handleAIChatBot = useCallback(() => {
    openModal(<ModalCreateAIChatBot />);
  }, []);
  return (
    <CommonSidebarWrapper data-tc-role="sidebar-personal">
      <SectionHeader>{'AIChatBot'}</SectionHeader>

      <div className="p-2 overflow-auto">
        <SidebarItem
          name={t('GPT-3.5')}
          icon={<Icon icon="mdi:puzzle" />}
          to="/main/monica/GPT-3.5"
        />
        <SidebarItem
          name={t('GPT-4.0')}
          icon={<Icon icon="mdi:puzzle" />}
          to="/main/monica/GPT-4.0"
        />
        <SidebarItem
          name={t('Bard')}
          icon={<Icon icon="mdi:puzzle" />}
          to="/main/monica/Bard"
        />
        <SidebarItem
          name={t('Claude+')}
          icon={<Icon icon="mdi:puzzle" />}
          to="/main/monica/Claude+"
        />
        <SidebarItem
          name={t('Claude-Instant-100k')}
          icon={<Icon icon="mdi:puzzle" />}
          to="/main/monica/Claude-Instant-100k"
        />
      </div>
      <div className="p-2 overflow-auto" onClick={handleAIChatBot}>
        <div
          className={clsx(
            'w-full  cursor-pointer text-gray-700 dark:text-white rounded px-2 h-11 flex items-center text-base group mb-0.5',
            {
              'bg-black bg-opacity-20 dark:bg-white dark:bg-opacity-20': false,
            }
          )}
        >
          <div className="flex h-8 items-center justify-center text-2xl w-8 mr-3">
            {/* <Icon icon="icon-park-outline:add" /> */}
            <Icon className="text-3xl text-white" icon="mdi:plus" />
          </div>

          <Typography.Text
            className="flex-1 text-gray-900 dark:text-white"
            ellipsis={true}
          >
            {'添加'}
          </Typography.Text>

          <div className="text-base p-1 cursor-pointer hidden opacity-70 group-hover:block hover:opacity-100">
            {/* {props.action} */}
          </div>
        </div>
      </div>
      {/*       
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
        </SidebarSection> */}
    </CommonSidebarWrapper>
  );
});
MonicaSidebar.displayName = 'MonicaSidebar';
export const ModalCreateAIChatBot: React.FC = React.memo((props) => {
  const handleCreate = () => {
    closeModal();
  };
  const { hiddenUserIds = [] } = props;
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);
  return (
    <ModalWrapper title={t('添加AIChatBot')}>
      <FriendPickerAIChatBot
        withoutUserIds={hiddenUserIds}
        selectedIds={selectedFriendIds}
        onChange={setSelectedFriendIds}
      />

      <div className="text-right">
        <Button type="primary" loading={false} onClick={handleCreate}>
          {t('添加')}
        </Button>
      </div>
    </ModalWrapper>
  );
});

ModalCreateAIChatBot.displayName = 'ModalCreateAIChatBot';
interface FriendPickerProps {
  /**
   * 排除的用户id
   * 在选择好友时会进行过滤
   */
  withoutUserIds?: string[];

  /**
   * 是否包含搜索框
   * 默认为 true
   */
  withSearch?: boolean;

  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
}
export const FriendPickerAIChatBot: React.FC<FriendPickerProps> = React.memo(
  (props) => {
    const { withoutUserIds = [], selectedIds, onChange } = props;
    const friends: Array<any> = [];

    const friendIds = useAppSelector((state) => {
      console.log('[FriendPicker]', state);
      return state.user.friends
        .map((f) => f.id)
        .filter((item) => !withoutUserIds.includes(item));
    });

    return (
      <UserPicker
        selectedIds={selectedIds}
        onChange={onChange}
        allUserIds={friendIds}
      />
    );
  }
);
FriendPickerAIChatBot.displayName = 'FriendPickerAIChatBot';
