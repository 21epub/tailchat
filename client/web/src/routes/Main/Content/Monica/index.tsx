import { Problem } from '@/components/Problem';
import React, { useEffect, useState } from 'react';
import { Route, Routes, useParams, Navigate, useNavigate } from 'react-router';
import { useUserSessionPreference } from '@/hooks/useUserPreference';
import { t, uploadFile } from 'tailchat-shared';
import { PageContent } from '../PageContent';
import { InboxContent } from './Content';
import { MonicaSidebar } from './Sidebar';
import { GroupPanelRender, GroupPanelRoute } from './Panel';
import axios from 'axios';
import { MonicaConverse } from './Converse';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { HfInference } from '@huggingface/inference';
import { dataUrlToFile, getMessageTextDecorators } from '@/plugin/common';

const HF_ACCESS_TOKEN = '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';
const inference = new HfInference(HF_ACCESS_TOKEN);

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
      console.log('[getAllUser]1', response);
      return response;
    });

  // .json<{ data: { token: string } }>();

  return res;
}

const tokenMaps = {};
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

async function sendMessageAIChatBot(
  converseId: String,
  content: String,
  plain: String,
  meta: any,
  monicaItemId: string
): Promise<string> {
  const token = localStorage.getItem('jsonwebtoken') || '{rawData:""}';
  const memberId = ConverseMap[monicaItemId]['memberId'];
  // let tokenNew = '';
  // if (tokenMaps[memberId]) {
  //   tokenNew = tokenMaps[memberId];
  // } else {
  const tokenNew = await signUserTokenAIChatBot(memberId);
  //   tokenMaps[memberId] = tokenNew;
  // }

  // const  tokenNew = crypto
  //     .createHash('md5')
  //     .update(memberId + "wagon000")
  //     .digest('hex');

  console.log(
    '[sendMessageAIChatBot]',
    converseId,
    content,
    plain,
    meta,
    memberId,
    tokenNew
  );
  const res: any = await axios
    .post(
      `//` + apiURL + `/api/chat/message/sendMessage`,
      { converseId: converseId, content: content, plain: plain, meta: meta },
      {
        headers: {
          'x-token': tokenNew.data.data || JSON.parse(token).rawData,
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

async function createDMConverseAIChatBot(
  memberIds: Array<String>
): Promise<string> {
  const token = localStorage.getItem('jsonwebtoken') || '{rawData:""}';
  const res: any = await axios
    .post(
      `//` + apiURL + `/api/chat/converse/createDMConverse`,
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
      `//` + apiURL + `/api/friend/request/acceptOther`,
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
      `//` + apiURL + `/api/user/searchUserWithUniqueName`,
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

async function registerUser(
  email_arg: string,
  nickname_arg: string,
  password_arg: string,
  emailOTP_arg: string
): Promise<string> {
  const token = localStorage.getItem('jsonwebtoken') || '{rawData:""}';

  const userByEmail = await findUserByEmail(email_arg);
  const email = userByEmail.data;
  console.log('[email]', email);
  let gpt35Reg = null;
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

  return gpt35Reg;
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
      `//` + apiURL + `/api/user/register`,
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
      `//` + apiURL + `/api/friend/request/isAdd`,
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
      `//` + apiURL + `/api/friend/request/add`,
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
    .post(`//` + apiURL + `/api/user/createTemporaryUser`, {
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
      `//` + apiURL + `/api/user/verifyEmail2`,
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
    ConverseMap[nickname] = {
      converseId: converseId,
      memberId: memberId,
    };
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
    asyncFun('Stable-Diffusion@163.com', 'Stable-Diffusion', 'Wagon000', '');
    getAllUser();
    navigate(`/main/monica/GPT-3.5`);
  }, []);

  //  useEffect(()=>{
  //   （async function fn(){<!-- -->
  //     await otherFn();
  //     })()
  //   const gpt4 = await registerTemporaryAccount("","GPT-4.0")
  // },[])
  useEffect(() => {
    if (ConverseMap['GPT-3.5'] && ConverseMap['GPT-3.5']['converseId']) {
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

async function generateImage(val: any) {
  // you can generate the code, inspect it and then run it
  // const code = await agent.generateCode(
  //   "Draw a picture of a cat wearing a top hat. Then caption the picture and read it out loud."
  // );
  // console.log(code);
  // const messages1 = await agent.evaluateCode(code);
  // console.log(messages1); // contains the data

  // or you can run the code directly, however you can't check that the code is safe to execute this way, use at your own risk.
  // const messages = await agent.run(
  //   "Draw a picture of a cat wearing a top hat. Then caption the picture and read it out loud."
  // );
  const ret = await inference.textToImage({
    model: 'stabilityai/stable-diffusion-2',
    inputs: val || '一张戴着大礼帽的猫的照片。然后给图片配上文字，大声读出来。',
    parameters: {
      negative_prompt: 'blurry',
    },
  });
  console.log(ret);

  const blob = new Blob([ret], {
    type: ret.type,
  });
  return blob;
  // const objectUrl = URL.createObjectURL(blob);
  // // const tmpLink = document.createElement('a');
  // // tmpLink.href = objectUrl;
  // // tmpLink.download = 'fileName.jpeg';

  // // document.body.appendChild(tmpLink); // 如果不需要显示下载链接可以不需要这行代码
  // // tmpLink.click();
  // URL.revokeObjectURL(objectUrl);
  // console.log(blob, objectUrl);
  // return  window.URL.createObjectURL(blob)
  // createMiniQrcode(blob);
  // await createRepo({
  //   repo: "wagon123/nlp-model", // or {type: "model", name: "my-user/nlp-test"},
  //   credentials: { accessToken: HF_ACCESS_TOKEN },
  // });

  // const ret2 = await uploadFile({
  //   repo: "wagon123/nlp-model",
  //   credentials: { accessToken: HF_ACCESS_TOKEN },
  //   // Can work with native File in browsers
  //   file: {
  //     path: "pytorch_model.bin",
  //     content: new Blob(ret),
  //   },
  // });
  // console.log(ret2);
}

function blobToDataURI(blob, callback) {
  const reader = new FileReader();
  reader.onload = function (e) {
    callback(e.target.result);
  };
  reader.readAsDataURL(blob);
}
const InboxNoSelect: React.FC = React.memo(() => {
  const [isShowLoading, setIsShowLoading] = useState(false);
  const { monicaItemId } = useParams();
  console.log('[InboxNoSelect]', monicaItemId, ConverseMap);

  const converseId: any = ConverseMap[monicaItemId]
    ? ConverseMap[monicaItemId]['converseId']
    : null;
  console.log('[InboxNoSelect] converseId', converseId);
  async function sendMessageCallback(msg) {
    setIsShowLoading(true);
    console.log('[sendMessageCallback]', monicaItemId);

    try {
      if (monicaItemId == 'Stable-Diffusion') {
        const imgURL = await generateImage(msg);

        const dataUrl = imgURL;
        blobToDataURI(dataUrl, async function (dataUrl) {
          const file = dataUrlToFile(dataUrl);
          const res = await uploadFile(file);
          const answer = getMessageTextDecorators().image(res.url, {
            width: 400,
            height: 400,
          });
          console.log('[getMessageTextDecorators]', answer);

          sendMessageAIChatBot(
            converseId,
            answer,
            answer,
            { mentions: [] },
            monicaItemId
          );
        });
      } else {
        const { data } = await axios.post('https://yyejoq.laf.dev/chatgpt', {
          question: msg,
        });
        console.log('[chatgpt]', data);
        // let data={
        //   answer:"收到的问题是："+msg
        // }
        sendMessageAIChatBot(
          converseId,
          '[md]' + data.answer + '[/md]',
          '[md]' + data.answer + '[/md]',
          { mentions: [] },
          monicaItemId
        );
      }
    } catch (error) {
      const data = {
        answer: 'chatGPT接口错误，收到的问题是：' + msg,
      };
      sendMessageAIChatBot(
        converseId,
        '[md]' + data.answer + '[/md]',
        '[md]' + data.answer + '[/md]',
        { mentions: [] },
        monicaItemId
      );
    }
    setIsShowLoading(false);
  }
  if (!converseId) return null;
  return (
    <>
      <MonicaConverse
        converseId={converseId}
        sendMessageCallback={sendMessageCallback}
      />
      {isShowLoading ? (
        <div
          style={{
            display: 'inline-block',
            position: 'absolute',
            bottom: '15px',
            left: '31px',
            background: ' rgba(75, 85, 99, var(--tw-bg-opacity))',

            right: '16px',
          }}
        >
          <LoadingSpinner />
        </div>
      ) : null}
    </>
  );
});
InboxNoSelect.displayName = 'InboxNoSelect';

/**
 * LoadingSpinner
 *
 */
