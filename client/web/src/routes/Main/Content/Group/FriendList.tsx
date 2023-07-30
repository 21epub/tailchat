import React, { useCallback, useEffect, useState } from 'react';
import {
  createDMConverse,
  isValidStr,
  removeFriend,
  showAlert,
  showErrorToasts,
  showToasts,
  t,
  useAppDispatch,
  useAppSelector,
  useAsyncRequest,
  useEvent,
  useSearch,
  userActions,
} from 'tailchat-shared';
import { UserListItem } from '@/components/UserListItem';
import { IconBtn } from '@/components/IconBtn';
import { Button, Dropdown, Input, Menu, Tooltip } from 'antd';
import { useNavigate } from 'react-router';
import { Problem } from '@/components/Problem';
import { closeModal, openModal } from '@/components/Modal';
import { SetFriendNickname } from '@/components/modals/SetFriendNickname';
import { Icon } from 'tailchat-design';
import axios from 'axios';

let apiURL = location.host;
const hostname = location.hostname;
if (hostname == '127.0.0.1' || hostname == 'localhost') {
  apiURL = apiURL.replace('11011', '11000');
}

async function getAllUser() {
  const token = localStorage.getItem('jsonwebtoken') || '{rawData:""}';

  console.log('[getAllUser]token', token);
  const res: any = await axios
    .post(
      `//` + apiURL + `/api/user/getAllUsers`,
      {},
      {
        headers: {
          'x-token': JSON.parse(token).rawData,
        },
      }
    )
    .then(function (response) {
      console.log('[getAllUser]2', response);
      return response;
    });

  // .json<{ data: { token: string } }>();

  return res;
}

async function fn() {
  return await getAllUser();
}
let dataSource: any = [];
/**
 * 好友列表
 */
export const FriendList: React.FC<{
  onSwitchToAddFriend: () => void;
  groupId: string;
}> = React.memo((props) => {
  // const friends = useAppSelector((state) => {
  //   console.log('[state.user]', state);
  //   return state.user.friends;
  // });
  const [searchText, setSearchText] = useState('');
  const [friends, setFriends] = useState([]);

  const fn2 = async () => {
    // do something
    const ret = await fn();
    console.log('[getAllUser]3', ret);
    dataSource = ret.data.data;
    setFriends(ret.data.data);
    return ret;
  };

  useEffect(() => {
    dataSource = [];
    fn2();
  }, []);

  const filterFn = (searchText) => {
    // console.log("[newFriends]dataSource",dataSource,friends)
    const newFriends: any = dataSource.filter((item) => {
      // console.log("[newFriends]item",item)
      return (item.nickname || '').includes(searchText);
    });
    console.log('[newFriends]', searchText, newFriends);
    setFriends(newFriends);
  };
  // const friends = fn();

  // const {
  //   searchText,
  //   setSearchText,
  //   isSearching,
  //   searchResult: filterMembers,
  // } = useSearch({
  //   dataSource: friends,
  //   filterFn: (item, searchText) => (item.nickname || '').includes(searchText),
  // });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [, handleCreateConverse] = useAsyncRequest(
    async (targetId: string) => {
      const converse = await createDMConverse([targetId]);
      navigate(`/main/group/${props.groupId}/converse.${converse._id}`);
    },
    [navigate]
  );

  const handleSetFriendNickname = useEvent(async (userId: string) => {
    const key = openModal(
      <SetFriendNickname
        userId={userId}
        onSuccess={() => {
          closeModal(key);
        }}
      />
    );
  });

  const handleRemoveFriend = useEvent(async (targetId: string) => {
    showAlert({
      message: t(
        '是否要从自己的好友列表中删除对方? 注意:你不会从对方的好友列表消失'
      ),
      onConfirm: async () => {
        try {
          await removeFriend(targetId);
          showToasts(t('好友删除成功'), 'success');
          dispatch(userActions.removeFriend(targetId));
        } catch (err) {
          showErrorToasts(err);
        }
      },
    });
  });

  // if (friends.length === 0) {
  //   return (
  //     <Problem
  //       text={
  //         <div>
  //           <p className="mb-2">{t('暂无好友')}</p>
  //           <Button type="primary" onClick={props.onSwitchToAddFriend}>
  //             {t('立即添加')}
  //           </Button>
  //         </div>
  //       }
  //     />
  //   );
  // }

  return (
    <div
      className="py-2.5 px-5"
      style={{
        height: '480px',
        width: '380px',
        /* box-sizing: border-box; */
        overflow: 'overlay',
      }}
    >
      <div>{t('用户列表')}</div>
      <Input
        placeholder={t('搜索用户')}
        size="middle"
        suffix={<Icon fontSize={20} color="grey" icon="mdi:magnify" />}
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          filterFn(e.target.value);
        }}
      />
      <RrenderList
        friends={friends}
        handleCreateConverse={handleCreateConverse}
      />
    </div>
  );
});
FriendList.displayName = 'FriendList';
const RrenderList = (pros: any) => {
  const friends = pros.friends;
  const handleCreateConverse = pros.handleCreateConverse;
  console.log('[RrenderList]friends', friends);
  if (friends.length) {
    return (
      <div>
        {friends.map((m) => (
          <UserListItem
            key={m._id}
            userId={m._id}
            actions={[
              <Tooltip key="message" title={t('发送消息')}>
                <div>
                  <IconBtn
                    icon="mdi:message-text-outline"
                    onClick={() => {
                      handleCreateConverse(m._id);
                      closeModal();
                    }}
                  />
                </div>
              </Tooltip>,
            ]}
          />
        ))}
      </div>
    );
  } else {
    return null;
  }
};
RrenderList.displayName = 'RrenderList';
