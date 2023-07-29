import { Problem } from '@/components/Problem';
import { pluginCustomPanel } from '@/plugin/common';
import { findPluginPanelInfoByName } from '@/utils/plugin-helper';
import { Alert } from 'antd';
import ErrorBoundary from 'antd/lib/alert/ErrorBoundary';
import React, { useMemo } from 'react';
import { isValidStr, t, useGroupPanelInfo } from 'tailchat-shared';

interface GroupPluginPanelProps {
  groupId: string;
  panelId: string;
}

/**
 * 插件群组面板
 */
export const GroupPluginPanel: React.FC<GroupPluginPanelProps> = React.memo(
  (props) => {
    const panelInfo = useGroupPanelInfo(props.groupId, props.panelId);

    let isGroupPlugin = false;
    if (panelInfo === null && props.panelId.indexOf('com.msgbyte.') != -1) {
      isGroupPlugin = true;
    }
    if (isGroupPlugin) {
      let ret = null;
      pluginCustomPanel
        .filter((p) => p.position === 'group')
        .map((p) => {
          console.log(
            '[Group]pluginCustomPanel',
            p,
            p.name,
            props.panelId,
            p.name == props.panelId
          );
          if (p.name == props.panelId) {
            ret = (
              <ErrorBoundary>{React.createElement(p.render)}</ErrorBoundary>
            );
            return false;
          }
        });
      return ret;
    }
    if (!panelInfo) {
      return (
        <Alert className="w-full text-center" message={t('无法获取面板信息')} />
      );
    }

    if (typeof panelInfo.provider !== 'string') {
      return (
        <Alert
          className="w-full text-center"
          message={t('未找到插件的提供者')}
        />
      );
    }

    // 从已安装插件注册的群组面板中查找对应群组的面板配置
    const pluginPanelInfo = useMemo(() => {
      if (!isValidStr(panelInfo.pluginPanelName)) {
        return null;
      }

      return findPluginPanelInfoByName(panelInfo.pluginPanelName);
    }, [panelInfo.name]);

    if (!pluginPanelInfo) {
      // TODO: 如果没有安装, 引导用户安装插件
      return (
        <Alert
          className="w-full text-center"
          message={
            <div>
              <p>{t('该面板由插件提供')}</p>
              <p>
                {t('插件名')}: {panelInfo.provider}
              </p>
              <p>
                {t('面板名')}: {panelInfo.pluginPanelName}
              </p>
            </div>
          }
        />
      );
    }

    const Component = pluginPanelInfo.render;

    if (!Component) {
      // 没有找到插件组件
      // TODO: Fallback
      return <Problem text={t('插件渲染函数不存在')} />;
    }

    return <Component panelInfo={panelInfo} />;
  }
);
GroupPluginPanel.displayName = 'GroupPluginPanel';
