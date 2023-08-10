import { reqGetFatherAttr,reqGetChildrenAttr,reqDeleteChildrenAttr,reqAddOrUpdateChildrenAttr,reqGetCategoryList,reqGetLevelList,reqGetOrganizationList } from "@/api/activity/category";


const state={
    fatherAttrData:[],
    childrenAttrData:[],
    organizationAttrData:[],
    levelAttrData:[],
    categoryAttrData:[],
};

const mutations={
    FATHERATTR(state,fatherAttrData){
        state.fatherAttrData=fatherAttrData;
    },
    CHILDRENATTR(state,childrenAttrData){
        state.childrenAttrData=childrenAttrData;
    },
    LEVELATTRDATA(state,data){
      state.levelAttrData=data;
    },
    ORGANIZATIONATTRDATA(state,data){
      state.organizationAttrData=data;
    },
    CATEGORYATTRDATA(state,data){
      state.categoryAttrData=data;
    }
};

const actions={
    //获取父属性数据
    async getFatherAttr({commit}) {
        let result = await reqGetFatherAttr();
        if (result.code == 200) {
          commit('FATHERATTR',result.data);
        }
      },
      //获取子属性数据
      async getChildrenAttr({commit},fatherAttrId){
        const result=await reqGetChildrenAttr(fatherAttrId);
        if(result.code==200){
          commit('CHILDRENATTR',result.data);
        }
      },
      //删除子属性
      async deleteChildrenAttr({commit},{fatherAttrId,id}) {
        let result=await reqDeleteChildrenAttr(fatherAttrId,id);
        if(result.code==200){
            return '0k';
        }
        else 
            return Promise.reject(new Error('error'));
      },
      //修改子属性
      async addOrUpdateChildrenAttr({commit},children){
        let result = await reqAddOrUpdateChildrenAttr(children);
            if (result.code == 200) {
              return 'OK';
            }
            else{
              return Promise.reject(new Error('error'));
            }
        },
      async getLevelAttrData({commit}){
        let result=await reqGetLevelList();
        if(result.code==200){
          commit('LEVELATTRDATA',result.data);
        }
      },
      async getCategoryAttrData({commit}){
        let result=await reqGetCategoryList();
        if(result.code==200){
          commit('CATEGORYATTRDATA',result.data);
        }
      },
      async getOrganizationAttrData({commit}){
        let result=await reqGetOrganizationList();
        if(result.code==200){
          commit('ORGANIZATIONATTRDATA',result.data);
        }
      }
};

export default{
    namespaced: true,
    state,
    mutations,
    actions
}