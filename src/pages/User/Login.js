import React, { Component } from 'react';
import { connect } from 'dva';
import { Alert, Checkbox } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

/**
 * 登录页面
 */
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'login/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;

    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab="账户密码登录">
            {login.status === 'error' &&
              login.type === 'account' &&
              !submitting &&
              this.renderMessage(login.message ? login.message : '登录失败')}
            <UserName name="username" placeholder="请输入帐号" />
            <Password
              name="password"
              placeholder="请输入密码"
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
          </Tab>
          {/*<Tab key="mobile" tab="手机号登录">*/}
          {/*{login.status === 'error' &&*/}
          {/*login.type === 'mobile' &&*/}
          {/*!submitting &&*/}
          {/*this.renderMessage('验证码错误')}*/}
          {/*<Mobile name="mobile" />*/}
          {/*<Captcha name="vcode" countDown={120} onGetCaptcha={this.onGetCaptcha} />*/}
          {/*</Tab>*/}
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox>
            {/*<a style={{ float: 'right' }} href="">*/}
            {/*忘记密码*/}
            {/*</a>*/}
          </div>

          <Submit loading={submitting}>登录</Submit>
          {/*<div className={styles.other}>*/}
          {/*其他登录方式*/}
          {/*<Icon className={styles.icon} type="alipay-circle"/>*/}
          {/*<Icon className={styles.icon} type="taobao-circle"/>*/}
          {/*<Icon className={styles.icon} type="weibo-circle"/>*/}
          {/*<Link className={styles.register} to="/User/Register">*/}
          {/*注册账户*/}
          {/*</Link>*/}
          {/*</div>*/}
        </Login>
      </div>
    );
  }
}

export default connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))(LoginPage);
