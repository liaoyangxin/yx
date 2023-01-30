import { ElMessage } from 'element-plus'
import * as homePageFns from '@/api/homePage/index.js'
// 类型
export async function dropDownList(attr){
    let arr = []
    await homePageFns.dropDownList(attr).then(res => {
        if (res.code === 200) {
            arr = res.data
        } else {
            ElMessage.error({
                message: res.message,
                type: 'error'
            }) 
        }
    })
    return arr
}
// 作者
export async function authorDropDownList(attr){
    let arr = []
    await homePageFns.authorDropDownList(attr).then(res => {
        if (res.code === 200) {
            arr = res.data
        } else {
            ElMessage.error({
                message: res.message,
                type: 'error'
            }) 
        }
    })
    return arr
}
// 关键字
export async function tagDropDownList(attr){
    let arr = []
    await homePageFns.tagDropDownList(attr).then(res => {
        if (res.code === 200) {
            arr = res.data
        } else {
            ElMessage.error({
                message: res.message,
                type: 'error'
            }) 
        }
    })
    return arr
}
// 主题
export async function subjectDropDownList(attr){
    let arr = []
    await homePageFns.subjectDropDownList(attr).then(res => {
        if (res.code === 200) {
            arr = res.data
        } else {
            ElMessage.error({
                message: res.message,
                type: 'error'
            }) 
        }
    })
    return arr
}
// 关键词新增
export async function addKeyWorld(attr) {
	let str
	await homePageFns.addKeyWorld(attr).then(res => {
		if (res.code === 200) {
			str = res
		} else {
			ElMessage.error({
				message: res.message,
				type: 'error'
			})
		}
	})
	return str
}
