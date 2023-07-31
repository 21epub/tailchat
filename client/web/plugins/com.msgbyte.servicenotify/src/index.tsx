import { regCustomPanel, regGroupPanel } from '@capital/common';
import { WebviewKeepAlive } from '@capital/component';
import React from 'react';
import { Translate } from './translate';

const PLUGIN_NAME = 'com.msgbyte.servicenotify';

regCustomPanel({
  name: `${PLUGIN_NAME}`,
  position: 'group',
  label: Translate.panelName,
  icon: 'icon-park-outline:volume-notice',
  render: () => (
    // <WebviewKeepAlive
    //   className="w-full h-full bg-white"
    //   url="https://plankanban.github.io/planka/#/boards/745664150193046535"
    // />
    <div>hello service notify</div>
  ),
});

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
