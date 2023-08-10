//将四个模块请求的接口函数统一暴露
import * as category from './activity/category'
import * as specific from './activity/specific'

import * as user from './account/user'
import * as blackList from './account/blackList'

export default{
    category,
    specific,
    user,
    blackList
}