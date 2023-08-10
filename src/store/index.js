import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import category from './modules/category'
import specific from './modules/specific'
import userAccount from './modules/userAccount'
import blackList from './modules/blackList'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    category,
    specific,
    userAccount,
    blackList
  },
  getters
})

export default store
