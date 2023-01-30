import { ElMessage } from 'element-plus'
import * as projectFns from '@/api/project/index.js'

//列表
export async function subjectList(data){
    let obj = {}
    await projectFns.subjectList(data).then(res => {
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
// 专题批量禁用
export async function batchDisable(attr) {
	let obj = {}
	await projectFns.batchDisable(attr).then(res => {
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
	await projectFns.batchEnable(attr).then(res => {
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
export async function batchDel(attr) {
	let obj = {}
	await projectFns.batchDel(attr).then(res => {
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
//添加修改专题信息
export async function subjectAddAndEdit(attr) {
	let obj = {}
	await projectFns.subjectAddAndEdit(attr).then(res => {
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
//专题详情查询
export async function subjectDetail(attr) {
	let obj = {}
	await projectFns.subjectDetail(attr).then(res => {
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
//专题播放统计
export async function subjectStatistics(attr) {
	let obj = {}
	await projectFns.subjectStatistics(attr).then(res => {
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