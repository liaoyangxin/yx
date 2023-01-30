import { ElMessage } from 'element-plus'
import * as homePageFns from '@/api/homePage/index.js'


// 获取主页数据
export async function iwpostPage(attr){
    let arr = []
    await homePageFns.iwpostPage(attr).then(res => {
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

//列表批量禁用
export async function batchDisable(attr) {
	let obj = {}
	await homePageFns.batchDisable(attr).then(res => {
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
//列表批量启用
export async function batchEnable(attr) {
	let obj = {}
	await homePageFns.batchEnable(attr).then(res => {
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
//列表批量删除
export async function batchDelete(attr) {
	let obj = {}
	await homePageFns.batchDelete(attr).then(res => {
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
//获取分页查询的条件限制
export async function queryLimit() {
	let obj = {}
	await homePageFns.queryLimit().then(res => {
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