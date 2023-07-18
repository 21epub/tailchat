import { Avatar, Icon } from 'tailchat-design';
import React from 'react';
import { t, useDMConverseList, useUserInfo, useUnread } from 'tailchat-shared';
import { NavbarNavItem } from './NavItem';

function usePersonalUnread(): boolean {
  const converse = useDMConverseList();
  const unreads = useUnread(converse.map((converse) => String(converse._id)));

  return unreads.some((u) => u === true);
}

export const MonicaNav: React.FC = React.memo(() => {
  const userInfo = useUserInfo();
  const unread = usePersonalUnread();

  return (
    <div data-tc-role="navbar-personal">
      <NavbarNavItem
        name={t('AIChatBot')}
        to={'/main/monica'}
        showPill={true}
        className="bg-gray-700"
      >
        {/* <Avatar
          shape="square"
          size={48}
          name={"AI"}
          src={userInfo?.avatar}
        /> */}
        {/* <Icon className="text-3xl text-white" icon=" noto:person" /> */}
        <Icon className="text-3xl text-white" icon="tabler:file-text-ai" />
      </NavbarNavItem>
    </div>
  );
});
MonicaNav.displayName = 'MonicaNav';
