import { regCustomPanel, regGroupPanel } from '@capital/common';
import { WebviewKeepAlive } from '@capital/component';
import React, { useEffect } from 'react';
import { Translate } from './translate';
import axios from 'axios';

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
const ServicenotifyRender = (props) => {
  useEffect(() => {
    async function asyncFunction() {
      const { data: aiBot } = await ensureAIBot(
        'servicenotify',
        'servicenotify',
        '/plugins/com.msgbyte.servicenotify/assets/icon.png'
      );
      console.log('[ServicenotifyRender]aiBot', aiBot);
      const targetId = aiBot.data;
      const { data } = await createDMConverse(targetId, targetId);

      console.log('[ServicenotifyRender]data', data);

      // navigate(`/main/group/${props.groupId}/converse.${converse._id}`);
    }
    // asyncFunction()
  }, []);
  return <div>hello service notify</div>;
};

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
