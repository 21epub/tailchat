import { Avatar, Icon } from 'tailchat-design';
import React from 'react';
import { t, useDMConverseList, useUserInfo, useUnread } from 'tailchat-shared';
import { NavbarNavItem } from './NavItem';

function usePersonalUnread(): boolean {
  const converse = useDMConverseList();
  const unreads = useUnread(converse.map((converse) => String(converse._id)));

  return unreads.some((u) => u === true);
}

export const My: React.FC = React.memo(() => {
  const userInfo = useUserInfo();
  const unread = usePersonalUnread();

  return (
    <div data-tc-role="navbar-personal">
      <NavbarNavItem
        name={t('我的')}
        // to={'/main/monica'}
        showPill={false}
        className="bg-gray-700"
      >
        {/* <Avatar
          shape="square"
          size={48}
          name={"AI"}
          src={userInfo?.avatar}
        /> */}
        {/* <Icon className="text-3xl text-white" icon=" noto:person" /> */}
        <Icon
          className="text-3xl text-white"
          icon="fluent-emoji-high-contrast:person"
        />
      </NavbarNavItem>
    </div>
  );
});
My.displayName = 'My';
