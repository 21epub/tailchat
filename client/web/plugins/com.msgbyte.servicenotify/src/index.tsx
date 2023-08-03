import { regCustomPanel, regGroupPanel } from '@capital/common';
import { Button, Icon, WebviewKeepAlive } from '@capital/component';
import React, { useEffect, useState } from 'react';
import { Translate } from './translate';
import axios from 'axios';
// import { t, useGlobalConfigStore } from 'tailchat-shared';

const PLUGIN_NAME = 'com.msgbyte.servicenotify';
let apiURL = location.host;
const hostname = location.hostname;
if (hostname == '127.0.0.1' || hostname == 'localhost') {
  apiURL = apiURL.replace('11011', '11000');
}

regCustomPanel({
  name: `${PLUGIN_NAME}`,
  position: 'group',
  label: Translate.panelName,
  icon: 'icon-park-outline:volume-notice',
  render: (props) => <ServicenotifyRender groupId={props.groupId} />,
});

async function ensureAIBot(botId: string, nickname: string, avatar: string) {
  const token = localStorage.getItem('jsonwebtoken') || '{rawData:""}';

  console.log('[ensureAIBot]token', token);
  const res: any = await axios
    .post(
      `//` + apiURL + `/api/user/ensureAIBot`,
      { botId: botId, nickname: nickname, avatar: avatar },
      {
        headers: {
          'x-token': JSON.parse(token).rawData,
        },
      }
    )
    .then(function (response) {
      console.log('[ensureAIBot]response', response);
      return response;
    });

  return res;
}
async function createDMConverse(userId, memberId) {
  const token = localStorage.getItem('jsonwebtoken') || '{rawData:""}';
  const tokenNew = await signUserTokenAIChatBot(userId);
  console.log('[ensureAIBot]userId,memberId', userId, memberId);
  console.log('[ensureAIBot]token', token);
  console.log('[ensureAIBot]token', tokenNew);
  const res: any = await axios
    .post(
      `//` + apiURL + `/api/chat/converse/createDMConverseSelf`,
      { memberIds: [memberId] },
      {
        headers: {
          'x-token': tokenNew.data.data, //|| JSON.parse(token).rawData,
        },
      }
    )
    .then(function (response) {
      console.log('[ensureAIBot]response', response);
      return response;
    });

  return res;
}

async function signUserTokenAIChatBot(userId: String): Promise<string> {
  const token = localStorage.getItem('jsonwebtoken') || '{rawData:""}';
  const res: any = await axios
    .post(
      `//` + apiURL + `/api/user/signUserToken`,
      { userId: userId },
      {
        headers: {
          'x-token': JSON.parse(token).rawData,
        },
      }
    )
    .then(function (response) {
      console.log(response);
      return response;
    });

  // .json<{ data: { token: string } }>();

  return res;
}

async function getAllNotify(): Promise<string> {
  const token = localStorage.getItem('jsonwebtoken') || '{rawData:""}';
  const res: any = await axios
    .post(
      `//` + apiURL + `/api/servicenotify/getAllNotify`,
      {},
      {
        headers: {
          'x-token': JSON.parse(token).rawData,
        },
      }
    )
    .then(function (response) {
      console.log(response);
      return response;
    });

  // .json<{ data: { token: string } }>();

  return res;
}

const ServicenotifyRender = (props) => {
  // const announcementInfo = useGlobalConfigStore((state) => state.announcement);
  const [notify, setNotify] = useState([]);

  useEffect(() => {
    async function asyncFunction() {
      // const { data: aiBot } = await ensureAIBot(
      //   'servicenotify',
      //   'servicenotify',
      //   '/plugins/com.msgbyte.servicenotify/assets/icon.png'
      // );
      // console.log('[ServicenotifyRender]aiBot', aiBot);
      // const targetId = aiBot.data;
      // const { data } = await createDMConverse(targetId, targetId);

      // console.log('[ServicenotifyRender]data', data);

      // navigate(`/main/group/${props.groupId}/converse.${converse._id}`);
      const notifys = await getAllNotify();
      console.log('[ServicenotifyRender]notifys', notifys);
      setNotify(notifys.data.data);
      setTimeout(() => {
        asyncFunction();
      }, 5000);
    }

    asyncFunction();
  }, []);

  if (notify.length) {
    return (
      <div
        style={{
          overflowY: 'scroll',
          height: '100%',
        }}
      >
        {notify.map((announcementInfo, i) => (
          <div className="rounded-lg shadow-xl bg-white  m-5" key={i}>
            <div className="p-5 m-5">
              <header className="font-semibold text-lg pb-5 text-black">
                {' '}
                {announcementInfo.text}
              </header>
              <p className="text-gray-500 px-4">{announcementInfo.createdAt}</p>
              <footer className="text-right space-x-5">
                <Button
                  type="link"
                  className="py-2 px-4 mt-5 bg-green-500 rounded-lg text-white font-semibold hover:bg-green-600"
                >
                  {announcementInfo.link}
                </Button>
              </footer>
            </div>
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div>
        <div>hello service notify</div>
        {/* <NotifyBar /> */}
      </div>
    );
  }
};

const NotifyBar: React.FC = React.memo(() => {
  //   const announcementInfo = useGlobalConfigStore((state) => state.announcement);
  // //   // const [ackId, setAckId] = useLocalStorageState('ackGlobalAnnouncement');
  //   if (!announcementInfo) {
  //     return null;
  // }
  return <div>111</div>;

  //   // if (ackId === announcementInfo.id) {
  //   //   // 如果该公告已读，也不展示
  //   //   return null;
  //   // }

  //   return (
  //     <div className="text-center bg-indigo-400 text-white relative px-6">
  //       <span className="select-text">{announcementInfo.text}</span>

  //       {announcementInfo.link && (
  //         <Button
  //           type="link"
  //           className="text-indigo-700 font-bold ml-2"
  //           size="small"
  //           onClick={() => window.open(announcementInfo.link)}
  //         >
  //           {t('了解更多')}
  //         </Button>
  //       )}

  //       <Icon
  //         className="absolute top-0.5 right-1 opacity-80 hover:opacity-100 cursor-pointer text-xl"
  //         icon="mdi:close-circle-outline"
  //         // onClick={() => setAckId(announcementInfo.id)}
  //       />
  //     </div>
  //   );
});
NotifyBar.displayName = 'NotifyBar';

// regGroupPanel({
//   name: `${PLUGIN_NAME}/grouppanel`,
//   label: Translate.panelName,
//   provider: PLUGIN_NAME,
//   extraFormMeta: [{ type: 'text', name: 'url', label: 'URL' }],
//   render:  () => (
//     <WebviewKeepAlive
//       className="w-full h-full bg-white"
//       url="https://plankanban.github.io/planka/#/boards/745664150193046535"
//     />
//   )
// });
