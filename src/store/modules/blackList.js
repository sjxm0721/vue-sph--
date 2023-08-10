import { reqGetBlackList,reqSetWhiteList,reqSearchBlackList } from "@/api/account/blackList";
const state={
    blackListMsg:[],
};

const mutations={
    BLACKLIST(state,blackListMsg){
        state.blackListMsg=blackListMsg;
    }
};

const actions={
    async getBlackList({commit}){
        let result=await reqGetBlackList();
        if(result.code==200){
            commit('BLACKLIST',result.data);
        }
    },
    async setWhiteList({commit},userId){
        let result=await reqSetWhiteList(userId);
        if(result.code==200){
            return 'ok';
        }
        else{
            return Promise.reject(new Error('failed'));
        }
    },
    async searchBlackList({commit},inputContent){
        let result=await reqSearchBlackList(inputContent);
        if(result.code==200){
            commit('BLACKLIST',result.data);
        }
    }
};

export default{
    namespaced: true,
    state,
    mutations,
    actions
}