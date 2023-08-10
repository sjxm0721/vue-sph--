import {reqActivityList,reqAddOrUpdateActivity,reqDeleteActivity,reqGetTotalActivity,reqChooseTotalActivity,reqGetActivityByLikeNum,reqGetActivityByCollectNum, reqGetUserActivity,reqClickLike,reqCollectActivity} from '@/api/activity/specific'

const state={
    activityData:[],
    totalActivity:[],
    activityByLikeNum:[],
    activityByCollectNum:[],
};

const mutations={
    ACTIVITY(state,data){
        state.activityData=data;
    },
    TOTALACTIVITY(state,totalActivity){
        state.totalActivity=totalActivity;
    },
    ACTIVITYBYLIKENUM(state,data){
        state.activityByLikeNum=data;
    },
    ACTIVITYBYCOLLECTNUM(state,data){
        state.activityByCollectNum=data;
    }
};

const actions={
    async getActivityList({commit},{fatherAttrId,childrenAttrId}){
        const result=await reqActivityList(fatherAttrId,childrenAttrId);
        if(result.code==200){
            commit('ACTIVITY',result.data);
        }
      },
    async addOrUpdateActivity({commit},activity){
        let result=await reqAddOrUpdateActivity(activity);
        if(result.code==200){
            return 'ok';
        }
        else{
            return Promise.reject(new Error('failed'));
        }
    },
    async deleteActivity({commit},activityId){
        let result=await reqDeleteActivity(activityId);
        if(result.code==200){
            return 'ok';
        }
        else{
            return Promise.reject(new Error('failed'));
        }
    },
    async getTotalActivity({commit}){
        let result=await reqGetTotalActivity();
        if(result.code==200){
            commit('TOTALACTIVITY',result.data);
        }
    },
    async chooseTotalActivity({commit},chooseContent){
        let result=await reqChooseTotalActivity(chooseContent);
        if(result.code==200){
            commit('TOTALACTIVITY',result.data);
        }
    },
    async getActivityByLikeNum({commit}){
        let result=await reqGetActivityByLikeNum();
        if(result.code==200){
            commit('ACTIVITYBYLIKENUM',result.data);
        }
    },
    async getActivityByCollectNum({commit}){
        let result=await reqGetActivityByCollectNum();
        if(result.code==200){
            commit('ACTIVITYBYCOLLECTNUM',result.data);
        }
    },
    async getUserActivity({commit},chooseContent){
        let result=await reqGetUserActivity(chooseContent);
        if(result.code==200){
            commit('TOTALACTIVITY',result.data);
        }
    },
    async addClickNum({commit},activityId){
        let result=await reqClickLike(activityId);
        if(result.code==200){
            return 'OK';
        }
        else{
            return Promise.reject(new Error('failed'));
        }
    },
    async collectActivity({commit},data){
        let result=await reqCollectActivity(data);
        if(result.code==200){
            return 'OK';
        }
        else{
            return Promise.reject(new Error('failed'));
        }
    }
};

export default{
    namespaced: true,
    state,
    mutations,
    actions
}