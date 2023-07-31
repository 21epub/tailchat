import { Avatar, Icon } from 'tailchat-design';
import React from 'react';
import { t, useDMConverseList, useUserInfo, useUnread } from 'tailchat-shared';
import { NavbarNavItem } from './NavItem';
import clsx from 'clsx';
import { Popover } from 'antd';
import { SettingsAccount } from '@/components/modals/SettingsView/Account';

function usePersonalUnread(): boolean {
  const converse = useDMConverseList();
  const unreads = useUnread(converse.map((converse) => String(converse._id)));

  return unreads.some((u) => u === true);
}
const content = <SettingsAccount />;
export const My: React.FC = React.memo(() => {
  const userInfo = useUserInfo();
  const unread = usePersonalUnread();
  // trigger="click"

  return (
    <div data-tc-role="navbar-personal">
      <div className="px-3 relative group">
        <Popover content={content} title="用户信息" placement="rightTop">
          <div
            className={clsx(
              'w-12 h-12 transition-all duration-300 cursor-pointer flex items-center justify-center overflow-hidden', // hover:rounded-lg
              'bg-gray-700',

              {
                // 'rounded-1/2': !isActive,
                // 'rounded-lg': isActive,
              }
            )}
            style={{
              borderRadius: '0.6rem',
              // background: '#ffffff',
            }}
          >
            {<Icon className="text-3xl" icon="twemoji:person" />}
          </div>
        </Popover>
      </div>

      {/* <NavbarNavItem
        name={t('我的')}
    
        showPill={false}
        className="bg-gray-700"
      >
       
        <Icon
          className="text-3xl text-white"
          icon="fluent-emoji-high-contrast:person"
        />
      </NavbarNavItem> */}
    </div>
  );
});
My.displayName = 'My';
