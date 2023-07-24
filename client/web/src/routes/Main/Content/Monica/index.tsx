import { Problem } from '@/components/Problem';
import React, { useEffect, useState } from 'react';
import { Route, Routes, useParams, Navigate, useNavigate } from 'react-router';
import { useUserSessionPreference } from '@/hooks/useUserPreference';
import { t } from 'tailchat-shared';
import { PageContent } from '../PageContent';
import { InboxContent } from './Content';
import { MonicaSidebar } from './Sidebar';
import { GroupPanelRender, GroupPanelRoute } from './Panel';
import axios from 'axios';
import { MonicaConverse } from './Converse';
/*
http://127.0.0.1:11000/api/openapi/app/setAppBotInfo
{"appId":"tc_64ba79a000667beec62113d4","fieldName":"callbackUrl","fieldValue":"http://127.0.0.1:11000/api/chat/ack/test"}
{"code":200}


http://127.0.0.1:11000/api/openapi/app/get

{"appId":"tc_64ba79a000667beec62113d4"}

{
    "code": 200,
    "data": {
        "_id": "64ba79a000667beec62113d5",
        "owner": "64b9559e0e3de693ac3a06c6",
        "appId": "tc_64ba79a000667beec62113d4",
        "appName": "bot-1",
        "appDesc": "",
        "appIcon": "",
        "capability": [
            "bot"
        ],
        "createdAt": "2023-07-21T12:27:12.259Z",
        "updatedAt": "2023-07-21T12:31:50.015Z",
        "__v": 0,
        "bot": {
            "callbackUrl": "http://127.0.0.1:11000/api/chat/ack/test"
        }
    }
}

http://127.0.0.1:11000/api/openapi/integration/addBotUser
{"appId":"tc_64ba79a000667beec62113d4","groupId":"64ba7e3900667beec62113ef"}
{"code":200}

http://127.0.0.1:11000/api/chat/message/sendMessage
{"converseId":"64ba7e3900667beec62113ee",
"groupId":"64ba7e3900667beec62113ef",
"content":"[at=64ba7e7f00667beec62113f8]bot-1[/at] hello bot-1",
"plain":"@bot-1 hello bot-1","meta":{"mentions":["64ba7e7f00667beec62113f8"]}}

{
    "code": 200,
    "data": {
        "_id": "64ba7eaf00667beec6211403",
        "content": "[at=64ba7e7f00667beec62113f8]bot-1[/at] hello bot-1",
        "author": "64b9559e0e3de693ac3a06c6",
        "groupId": "64ba7e3900667beec62113ef",
        "converseId": "64ba7e3900667beec62113ee",
        "hasRecall": false,
        "meta": {
            "mentions": [
                "64ba7e7f00667beec62113f8"
            ]
        },
        "reactions": [],
        "createdAt": "2023-07-21T12:48:47.472Z",
        "updatedAt": "2023-07-21T12:48:47.472Z",
        "__v": 0
    }
}


注册
http://127.0.0.1:11000/api/user/register

{"email":"wagon7310-1@163.com","nickname":"wagon7310-1","password":"Wagon000","emailOTP":""}
{
    "code": 200,
    "data": {
        "_id": "64bb2b45081e7a74f2b61214",
        "email": "wagon7310-1@163.com",
        "nickname": "wagon7310-1",
        "discriminator": "5159",
        "temporary": false,
        "type": "normalUser",
        "emailVerified": false,
        "banned": false,
        "createdAt": "2023-07-22T01:05:09.843Z",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGJiMmI0NTA4MWU3YTc0ZjJiNjEyMTQiLCJuaWNrbmFtZSI6IndhZ29uNzMxMC0xIiwiZW1haWwiOiJ3YWdvbjczMTAtMUAxNjMuY29tIiwiaWF0IjoxNjg5OTg3OTA5LCJleHAiOjE2OTI1Nzk5MDl9.igUMosOV05BQMnz4TX2U9btLjIslC1aKFf2l7raA7og"
    }
}


查找好友


http://127.0.0.1:11000/api/user/searchUserWithUniqueName

{"uniqueName":"test#5913"}
{
    "code": 200,
    "data": {
        "_id": "64b9559e0e3de693ac3a06c6",
        "email": "9ed112e5b5.temporary@msgbyte.com",
        "nickname": "test",
        "discriminator": "5913",
        "temporary": true,
        "avatar": null,
        "type": "normalUser",
        "emailVerified": false,
        "banned": false,
        "createdAt": "2023-07-20T15:41:18.074Z"
    }
}

申请好友

http://127.0.0.1:11000/api/friend/request/add
{"to":"64b9559e0e3de693ac3a06c6"}
{
    "code": 200,
    "data": {
        "from": "64bb2b45081e7a74f2b61214",
        "to": "64b9559e0e3de693ac3a06c6",
        "_id": "64bb2cb0081e7a74f2b61231",
        "__v": 0
    }
}

接受 
http://127.0.0.1:11000/api/friend/request/accept
{"requestId":"64bb2cb0081e7a74f2b61231"}
{"code":200}

创建聊天
http://127.0.0.1:11000/api/chat/converse/createDMConverse
{"memberIds":["64bb2b45081e7a74f2b61214"]}
{
    "code": 200,
    "data": {
        "_id": "64bb2e24081e7a74f2b61240",
        "type": "DM",
        "members": [
            "64b9559e0e3de693ac3a06c6",
            "64bb2b45081e7a74f2b61214"
        ],
        "createdAt": "2023-07-22T01:17:24.698Z",
        "updatedAt": "2023-07-22T01:17:24.698Z",
        "__v": 0
    }
}


*/

async function createDMConverseAIChatBot(
  memberIds: Array<String>
): Promise<string> {
  const token = localStorage.getItem('jsonwebtoken') || '{rawData:""}';
  const res: any = await axios
    .post(
      `http://127.0.0.1:11000/api/chat/converse/createDMConverse`,
      { memberIds: memberIds },
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

async function acceptAIChatBot(requestId: string): Promise<string> {
  const token = localStorage.getItem('jsonwebtoken') || '{rawData:""}';
  const res: any = await axios
    .post(
      `http://127.0.0.1:11000/api/friend/request/acceptOther`,
      { requestId: requestId },
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

async function searchAIChatBot(uniqueName: string): Promise<string> {
  const token = localStorage.getItem('jsonwebtoken') || '{rawData:""}';
  const res: any = await axios
    .post(
      `http://127.0.0.1:11000/api/user/searchUserWithUniqueName`,
      { uniqueName: uniqueName },
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

async function registerAIChatBot(
  email: string,
  nickname: string,
  password: string,
  emailOTP: string
): Promise<string> {
  const token = localStorage.getItem('jsonwebtoken') || '{rawData:""}';
  const res: any = await axios
    .post(
      `http://127.0.0.1:11000/api/user/register`,
      {
        email: email,
        nickname: nickname,
        password: password,
        emailOTP: emailOTP,
      },
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

async function isAddAIChatBot(to: string): Promise<string> {
  const token = localStorage.getItem('jsonwebtoken') || '{rawData:""}';
  const res: any = await axios
    .post(
      `http://127.0.0.1:11000/api/friend/request/isAdd`,
      { to: to },
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

async function addAIChatBot(to: string): Promise<string> {
  const token = localStorage.getItem('jsonwebtoken') || '{rawData:""}';
  const res: any = await axios
    .post(
      `http://127.0.0.1:11000/api/friend/request/add`,
      { to: to },
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

async function registerTemporaryAccount(
  url: string,
  nickname: string
): Promise<string> {
  const res: any = await axios
    .post(`http://127.0.0.1:11000/api/user/createTemporaryUser`, {
      nickname: nickname,
    })
    .then(function (response) {
      console.log(response);
      return response;
    });

  // .json<{ data: { token: string } }>();

  return res;
}

async function findUserByEmail(email: string): Promise<string> {
  const token = localStorage.getItem('jsonwebtoken') || '{rawData:""}';
  const res: any = await axios
    .post(
      `http://127.0.0.1:11000/api/user/verifyEmail2`,
      { email: email },
      {
        headers: {
          'x-token': JSON.parse(token).rawData,
        },
      }
    )
    .then(function (response) {
      console.log('[response]', response);
      return response;
      // return {
      //   data: {
      //     token: response.data;
      //   }
      // }
    });

  // .json<{ data: { token: string } }>();

  return res;
}

const ConverseMap: any = {};
// http://localhost:11011/api/user/createTemporaryUser
// http://127.0.0.1:11000/api/user/createTemporaryUser
export const Monica: React.FC = React.memo(() => {
  const [ais, setAis] = useState<any>(null);
  const navigate = useNavigate();

  const asyncFun = async (
    email_arg: any,
    nickname_arg: any,
    password_arg: any,
    emailOTP_arg: any
  ) => {
    let gpt35Reg;
    // const gpt35Reg = await registerAIChatBot("GPT-3.5@163.com","GPT-3.5","Wagon000","");
    // console.log("[gpt35Reg]",gpt35Reg)

    const userByEmail = await findUserByEmail(email_arg);
    const email = userByEmail.data;
    console.log('[email]', email);
    if (!email.data) {
      const gpt35Reg_t = await registerAIChatBot(
        email_arg,
        nickname_arg,
        password_arg,
        emailOTP_arg
      );
      console.log('[gpt35Reg]', gpt35Reg_t);
      gpt35Reg = gpt35Reg_t.data.data;
    } else {
      gpt35Reg = email.data;
    }
    console.log('[gpt35Reg]', gpt35Reg);
    const nickname = gpt35Reg.nickname;
    const discriminator = gpt35Reg.discriminator;
    const memberId = gpt35Reg._id;
    const gpt35Search = await searchAIChatBot(nickname + '#' + discriminator);
    console.log('[gpt35Search]', gpt35Search);
    const to = gpt35Search.data.data._id;

    const gpt35isAdd = await isAddAIChatBot(to);
    console.log('[gpt35isAdd]', gpt35isAdd);
    const isExist = gpt35isAdd.data.data.isExist;
    const isFriend = gpt35isAdd.data.data.isFriend;
    if (isFriend) {
    } else if (isExist) {
      const requestId = gpt35isAdd.data.data.isExist._id;
      const gtp35Accept = await acceptAIChatBot(requestId);
      console.log('[gtp35Accept]', gtp35Accept);
    } else {
      const gpt35Add = await addAIChatBot(to);
      console.log('[gpt35Add]', gpt35Add);
      const requestId = gpt35Add.data.data._id;
      const gtp35Accept = await acceptAIChatBot(requestId);
      console.log('[gtp35Accept]', gtp35Accept);
    }

    const gtp35Converse = await createDMConverseAIChatBot([memberId]);
    console.log('[gtp35Converse]', gtp35Converse);
    const converseId: any = gtp35Converse.data.data._id;

    console.log('[MonicaConverse]', nickname, converseId);
    ConverseMap[nickname] = converseId;
    // var ret = []
    // ret.push(<Route path="/:monicaItemId"  element={<MonicaConverse  converseId={converseId}/>}/>)
    if (nickname == 'GPT-3.5') {
      setAis({
        [nickname]: converseId,
      });
    }

    // const gpt35Add =   await addAIChatBot(to)
    // console.log("[gpt35Add]",gpt35Add)
    // const requestId = gpt35Add.data.data._id
    // const gtp35Accept = await acceptAIChatBot(requestId)
    // console.log("[gtp35Accept]",gtp35Accept)
    // const gtp35Converse = await createDMConverseAIChatBot([memberId])
    // console.log("[gtp35Converse]",gtp35Converse)
    // const converseId = gtp35Converse.data.data._id
  };

  useEffect(() => {
    asyncFun('GPT-3.5@163.com', 'GPT-3.5', 'Wagon000', '');
    asyncFun('GPT-4.0@163.com', 'GPT-4.0', 'Wagon000', '');
    asyncFun('Bard@163.com', 'Bard', 'Wagon000', '');
    asyncFun('Claude+@163.com', 'Claude+', 'Wagon000', '');
    asyncFun(
      'Claude-Instant-100k@163.com',
      'Claude-Instant-100k',
      'Wagon000',
      ''
    );

    navigate(`/main/monica/GPT-3.5`);
  }, []);

  //  useEffect(()=>{
  //   （async function fn(){<!-- -->
  //     await otherFn();
  //     })()
  //   const gpt4 = await registerTemporaryAccount("","GPT-4.0")
  // },[])
  useEffect(() => {
    if (ConverseMap['GPT-3.5']) {
      navigate(`/main/monica/GPT-3.5`);
    }
  }, [ais]);
  return (
    <PageContent data-tc-role="content-monica" sidebar={<MonicaSidebar />}>
      <Routes>
        <Route path="/:monicaItemId" element={<InboxNoSelect />} />
        {/* <Route path="/" element={<Navigate to={'/main/monica/GPT-3.5'} />} /> */}
        {/* {ais} */}
      </Routes>
    </PageContent>
  );
});
Monica.displayName = 'Monica';

const InboxNoSelect: React.FC = React.memo(() => {
  const { monicaItemId } = useParams();
  console.log('[InboxNoSelect]', monicaItemId, ConverseMap);

  const converseId = ConverseMap[monicaItemId];
  console.log('[InboxNoSelect] converseId', converseId);
  return <MonicaConverse converseId={converseId} />;
});
InboxNoSelect.displayName = 'InboxNoSelect';
