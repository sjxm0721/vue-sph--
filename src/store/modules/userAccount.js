import { reqGetTotalUser,reqSetBlackList,reqSearchAccount } from "@/api/account/user";

const state={
    totalUserMsg:[],
};

const mutations={
    TOTALUSER(state,totalUserMsg){
        state.totalUserMsg=totalUserMsg;
    }
};

const actions={
    async getTotalUser({commit}){
        let result=await reqGetTotalUser();
        if(result.code==200){
            commit('TOTALUSER',result.data);
        }
    },
    async setBlackList({commit},{userId,userName}){
        let result=await reqSetBlackList(userId,userName);
        if(result.code==200){
            return 'ok';
        }
        else{
            return Promise.reject(new Error('failed'));
        }
    },
    async searchAccount({commit},inputContent){
        let result=await reqSearchAccount(inputContent);
        if(result.code==200){
            commit('TOTALUSER',result.data);
        }
    }
};

export default{
    namespaced: true,
    state,
    mutations,
    actions
}