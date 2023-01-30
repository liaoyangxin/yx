import { ElMessage } from 'element-plus'
import * as homePageFns from '@/api/homePage/index.js'


// 获取主页数据详情
export async function details(attr){
    let arr = {}
    await homePageFns.details(attr).then(res => {
        if (res.code === 200) {
            arr = res
        } else {
            ElMessage.error({
                message: res.message,
                type: 'error'
            }) 
        }
    })
    return arr
}