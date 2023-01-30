import { ElMessage } from 'element-plus'
import * as categoryFns from '@/api/classify/index.js'

//分类列表
export async function categoryList(data){
    let obj = {}
    await categoryFns.categoryList(data).then(res => {
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
// 分类批量禁用
export async function batchDisable(attr) {
	let obj = {}
	await categoryFns.batchDisable(attr).then(res => {
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
//分类批量启用
export async function batchEnable(attr) {
	let obj = {}
	await categoryFns.batchEnable(attr).then(res => {
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
// 分类批量删除
export async function batchDel(attr) {
	let obj = {}
	await categoryFns.batchDel(attr).then(res => {
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
//添加修改分类信息
export async function categoryAddAndEdit(attr) {
	let obj = {}
	await categoryFns.categoryAddAndEdit(attr).then(res => {
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
//分类详情查询
export async function categoryDetail(attr) {
	let obj = {}
	await categoryFns.categoryDetail(attr).then(res => {
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
//分类播放统计
export async function categoryStatistics(attr) {
	let obj = {}
	await categoryFns.categoryStatistics(attr).then(res => {
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
