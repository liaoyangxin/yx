import { ElMessage } from 'element-plus'
import * as homePageFns from '@/api/homePage/index.js'

// 信息流的删除 批量 ids:[]
export async function infoFlowDelete(attr) {
	let str
	await homePageFns.infoFlowDelete(attr).then(res => {
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

// 信息流的禁用 批量 ids: []
export async function infoFlowDisable(attr) {
	let str
	await homePageFns.infoFlowDisable(attr).then(res => {
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
// 信息流的启用 批量 ids: []
export async function infoFlowEnable(attr) {
	let str
	await homePageFns.infoFlowEnable(attr).then(res => {
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