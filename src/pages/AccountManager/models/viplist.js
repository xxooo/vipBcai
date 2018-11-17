import { getMyUserList, addProxyOrUser } from '@/services/accountManager';

export default {
  namespace: 'vip',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    //查询提现记录列表
    *fetch({ payload }, { call, put }) {
      const response = yield call(getMyUserList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(addProxyOrUser, payload);
      if (callback) {
        callback(response);
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: {
          list: action.payload.data,
          pagination: false,
        },
      };
    },
  },
};
