import React, { useEffect, useState } from 'react';
import type { MenuProps } from 'antd';
import _isNil from 'lodash/isNil';
import _compact from 'lodash/compact';
import {
  PERMISSION,
  useAppSelector,
  useGroupInfo,
  useHasGroupPermission,
  useTranslation,
} from 'tailchat-shared';
import { SectionHeader } from '@/components/SectionHeader';
import { useGroupHeaderAction } from './useGroupHeaderAction';
import { Icon } from 'tailchat-design';
import { IconBtn } from '@/components/IconBtn';
import { openModal } from '@/components/Modal';
import { UserListItem } from '@/components/UserListItem';
import { FriendList } from './FriendList';

interface GroupHeaderProps {
  groupId: string;
}
export const GroupHeader: React.FC<GroupHeaderProps> = React.memo((props) => {
  const { groupId } = props;
  const groupInfo = useGroupInfo(groupId);
  const { t } = useTranslation();
  const [showGroupDetail, showInvite] = useHasGroupPermission(groupId, [
    PERMISSION.core.groupDetail,
    PERMISSION.core.invite,
  ]);

  const { handleShowGroupDetail, handleInviteUser, handleQuitGroup } =
    useGroupHeaderAction(groupId);

  if (_isNil(groupInfo)) {
    return null;
  }

  const menu: MenuProps = {
    items: _compact([
      showGroupDetail && {
        key: '0',
        label: t('查看详情'),
        onClick: handleShowGroupDetail,
      },
      showInvite && {
        key: '1',
        label: t('邀请用户'),
        onClick: handleInviteUser,
      },
      {
        key: '2',
        label: t('退出群组'),
        danger: true,
        onClick: handleQuitGroup,
      },
    ] as MenuProps['items']),
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
      }}
    >
      <div>
        <SectionHeader menu={menu} data-testid="group-header">
          {groupInfo?.name}
        </SectionHeader>
      </div>

      <div
        style={{
          alignItems: 'center',
          flex: 1,
          justifyContent: 'flex-end',

          display: 'grid',

          paddingRight: '15px',
        }}
      >
        <IconBtn
          key="create"
          title={t('创建会话')}
          shape="square"
          icon="nimbus:edit"
          iconClassName="text-2xl"
          onClick={() =>
            openModal(
              // <div>hello</div>
              // <CreateDMConverse hiddenUserIds={converse.members} />
              <ConversePanelMembers members={[]} groupId={groupId} />
            )
          }
        />
      </div>
    </div>
  );
});
GroupHeader.displayName = 'GroupHeader';

const ConversePanelMembers: React.FC<{ members: string[]; groupId: string }> =
  React.memo(({ members, groupId }) => {
    return <FriendList groupId={groupId} onSwitchToAddFriend={() => {}} />;
    const friendIds = useAppSelector(
      (state) => state.user.friends.map((f) => f.id)
      // .filter((item) => !withoutUserIds.includes(item))
    );

    console.log('[FriendPicker]', friendIds);

    return (
      <div>
        {friendIds.map((member) => (
          <UserListItem key={member} userId={member} />
        ))}
      </div>
    );
  });
ConversePanelMembers.displayName = 'ConversePanelMembers';
