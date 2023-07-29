import { regCustomPanel, regGroupPanel } from '@capital/common';
import { WebviewKeepAlive } from '@capital/component';
import React from 'react';
import { Translate } from './translate';

const PLUGIN_NAME = 'com.msgbyte.planka';

regCustomPanel({
  name: `${PLUGIN_NAME}`,
  position: 'group',
  label: Translate.panelName,
  icon: 'mdi:radio-tower',
  render: () => (
    <WebviewKeepAlive
      className="w-full h-full bg-white"
      url="https://plankanban.github.io/planka/#/boards/745664150193046535"
    />
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
