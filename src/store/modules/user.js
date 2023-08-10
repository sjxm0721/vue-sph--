import { login, register, getInfo,updateUserInfo,reqSelectCollection,reqDeleteCollection } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    userName:'',
    collectionList:[],
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USERNAME:(state,userName)=>{
    state.userName=userName;
  },
  COLLECTIONLIST(state,collectionList){
    state.collectionList=collectionList;
  }
}

const actions = {
  // user login
  //处理登录业务
  async login({ commit }, userInfo) {
    //结构出用户名与密码
    const { username, password } = userInfo;
    let result=await login({username:username.trim(),password:password});
    if(result.code==200){
      commit('SET_TOKEN', result.data['token']);
      setToken(result.data['token']);
      return 'OK';
    }
    else if(result.code==201){
      return Promise.reject(new Error('passwordError'));
    }
    else{
      return Promise.reject(new Error('noAccount'));
    }
  },

  async register({commit},userInfo){
    const {username,password}=userInfo;
    let result=await register({username:username.trim(),password:password});
    if(result.code==200){
      return 'OK';
    }
    else 
    {
      return Promise.reject(new Error('failed'));
    }
  },

  async updateUserInfo({commit},userInfo){
    const{userName,avatar,userId}=userInfo;
    let result=await updateUserInfo({userName:userName.trim(),avatar:avatar,userId,userId});
    if(result.code==200){
      return 'OK';
    }
    else{
      return Promise.reject(new Error('failed'));
    }
  },

  async selectCollection({commit},userId){
    let result=await reqSelectCollection(userId);
    if(result.code==200){
      commit('COLLECTIONLIST',result.data);
    }
  },

  async deleteCollection({commit},{userId,activityId}){
    let result=await reqDeleteCollection(userId,activityId);
    if(result.code==200){
      return 'OK';
    }
    else{
      return Promise.reject(new Error('failed'));
    } 
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar,userName } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_USERNAME',userName)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  // logout({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     logout(state.token).then(() => {
  //       removeToken() // must remove  token  first
  //       resetRouter()
  //       commit('RESET_STATE')
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

