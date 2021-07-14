import React, { Component } from 'react';
import { BasicLayoutProps, Settings as LayoutSettings } from '@ant-design/pro-layout';
import defaultSettings from '../config/defaultSettings';
import { formatMessage, Link, RequestConfig } from 'umi';
import 'react-pdf/dist/pdf.worker.entry';
import { Layout, message, notification } from 'antd';
import { queryCurrentUser } from '@/services/user';
const { Footer } = Layout;

export function rootContainer(container: Component) {
  const App = () => <div>{container}</div>;

  return React.createElement(App, null, container);
}

export interface InitialState {
  settings?: LayoutSettings;
  currentUser?: API.CurrentUser;
}
export async function getInitialState(): Promise<InitialState> {
  const currentUser = await queryCurrentUser();

  return {
    currentUser,
    settings: defaultSettings,
  };
}

const footerRender: BasicLayoutProps['footerRender'] = (_, defaultDom) => {
  return (
    <>
      {defaultDom}
      <div
        style={{
          padding: '0px 24px 24px',
          textAlign: 'center',
        }}
      >
        <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
          <img
            src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
            width="82px"
            alt="netlify logo"
          />
        </a>
      </div>
    </>
  );
};

// const handleMenuCollapse = (payload: boolean): void =>
//   dispatch &&
//   dispatch({
//     type: 'global/changeLayoutCollapsed',
//     payload,
//   });
export const layout = ({
  initialState,
}: {
  initialState: { settings?: LayoutSettings };
}): BasicLayoutProps => {
  return {
    // onCollapse:handleMenuCollapse,
    menuItemRender: (menuItemProps, defaultDom) => {
      if (menuItemProps.isUrl) {
        return defaultDom;
      }
      return <Link to={menuItemProps.path}>{defaultDom}</Link>;
    },
    breadcrumbRender: (routers = []) => [
      {
        path: '/',
        breadcrumbName: formatMessage({
          id: 'menu.home',
          defaultMessage: 'Home',
        }),
      },
      ...routers,
    ],
    itemRender: (route, params, routes, paths) => {
      const first = routes.indexOf(route) === 0;
      return first ? (
        <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
      ) : (
        <span>{route.breadcrumbName}</span>
      );
    },
    formatMessage: formatMessage,
    footerRender: footerRender,

    ...initialState?.settings,
  };
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response, data } = error;
  if (response && response.status) {
    if (response.status === 401) {
      window.location.href = `/api/users/custom/login?from=${encodeURIComponent(
        window.location.href,
      )}`;
    }
    if (response.status === 400 && data.subErrors) {
      const err = data.subErrors.map((i: any, index: number) => i.message);
      message.error(err.join(' '));
      return response;
    }
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    if (data.code) {
      message.error(data.message);
    } else if (data instanceof Blob) {
      let reader = new FileReader();
      reader.readAsText(data);
      setTimeout(() => {
        const { result = '' } = reader;
        const messageStr = JSON.parse(result).message;
        messageStr && message.error(messageStr);
      }, 500);
    } else {
      notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: errorText,
      });
    }
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

/**
 * 配置request请求时的默认参数
 */
export const request: RequestConfig = {
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
};
