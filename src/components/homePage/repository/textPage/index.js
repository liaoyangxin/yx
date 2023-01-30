import { ElMessage } from 'element-plus'
import * as homePageFns from '@/api/homePage/index.js'
// 获取文本
export async function textPage(attr){
    let obj = {}
    await homePageFns.textPage(attr).then(res => {
        if (res.code === 200) {
            obj = res
        } else {
            ElMessage.error({
                message: res.message,
                type: 'error'
            }) 
        }
    })
    return obj
} 

export async function textBatchDelete(attr){
    // let obj = {}
    await homePageFns.textBatchDelete(attr).then(res => {
        if (res.code === 200) {
            // obj = res
        } else {
            ElMessage.error({
                message: res.message,
                type: 'error'
            }) 
        }
    })
    // return obj
}
// 详情
export async function textDetails(attr){
    let obj = {}
    await homePageFns.textDetails(attr).then(res => {
        if (res.code === 200) {
            obj = res
        } else {
            ElMessage.error({
                message: res.message,
                type: 'error'
            }) 
        }
    })
    return obj
}
