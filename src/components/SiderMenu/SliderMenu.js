import React, { PureComponent } from 'react';
import { Card, Button, Layout } from 'antd';
import pathToRegexp from 'path-to-regexp';
import Link from 'umi/link';
import styles from './index.less';
import BaseMenu, { getMenuMatches } from './BaseMenu';
import { urlToList } from '../_utils/pathTools';

const { Sider } = Layout;

/**
 * 获得菜单子节点
 * @memberof SiderMenu
 */
const getDefaultCollapsedSubMenus = props => {
  const {
    location: { pathname },
    flatMenuKeys,
  } = props;
  return urlToList(pathname)
    .map(item => getMenuMatches(flatMenuKeys, item)[0])
    .filter(item => item);
};

/**
 * Recursively flatten the data
 * [{path:string},{path:string}] => {path,path2}
 * @param  menu
 */
export const getFlatMenuKeys = menu =>
  menu.reduce((keys, item) => {
    keys.push(item.path);
    if (item.children) {
      return keys.concat(getFlatMenuKeys(item.children));
    }
    return keys;
  }, []);

/**
 * Find all matched menu keys based on paths
 * @param  flatMenuKeys: [/abc, /abc/:id, /abc/:id/info]
 * @param  paths: [/abc, /abc/11, /abc/11/info]
 */
export const getMenuMatchKeys = (flatMenuKeys, paths) =>
  paths.reduce(
    (matchKeys, path) =>
      matchKeys.concat(flatMenuKeys.filter(item => pathToRegexp(item).test(path))),
    []
  );

export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.flatMenuKeys = getFlatMenuKeys(props.menuData);
    this.state = {
      openKeys: getDefaultCollapsedSubMenus(props),
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { pathname } = state;
    if (props.location.pathname !== pathname) {
      return {
        pathname: props.location.pathname,
        openKeys: getDefaultCollapsedSubMenus(props),
      };
    }
    return null;
  }

  isMainMenu = key => {
    const { menuData } = this.props;
    return menuData.some(item => {
      if (key) {
        return item.key === key || item.path === key;
      }
      return false;
    });
  };

  handleOpenChange = openKeys => {
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys],
    });
  };

  render() {
    const {
      logo,
      collapsed,
      onCollapse,
      fixSiderbar,
      theme,
      currentUser,
      onRecharge,
      onPutForward,
    } = this.props;
    const { openKeys } = this.state;
    const defaultProps = collapsed ? {} : { openKeys };
    //collapsed false 隐藏充值体现功能
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={onCollapse}
        width={256}
        className={`${styles.sider} ${fixSiderbar ? styles.fixSiderbar : ''} ${
          theme === 'light' ? styles.light : ''
        }`}
      >
        <div className={styles.logo} key="logo" id="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
            <h1>vipBocai</h1>
          </Link>
        </div>
        {!collapsed && currentUser && Object.keys(currentUser).length ? (
          <div className={styles.logouser} key="logouser" id="logouser">
            <div className={styles.avatarHolder}>
              <img alt="" src={currentUser.avatar} />
              <div className={styles.name}>{currentUser.name}</div>
              <div className={styles.name}>{currentUser.signature}</div>
            </div>
            <div className={styles.detail}>
              <Button type="primary" onClick={onRecharge} style={{ backgroundColor: '#ff6162' }}>
                充值
              </Button>
              <Button type="primary" onClick={onPutForward} style={{ marginLeft: '20px' }}>
                提现
              </Button>
            </div>
          </div>
        ) : (
          'loading...'
        )}

        <BaseMenu
          {...this.props}
          key="Menu"
          mode="inline"
          handleOpenChange={this.handleOpenChange}
          onOpenChange={this.handleOpenChange}
          style={{ padding: '16px 0', width: '100%' }}
          {...defaultProps}
        />
      </Sider>
    );
  }
}
