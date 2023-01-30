import { ElMessage } from 'element-plus'
import * as homePageFns from '@/api/homePage/index.js'


export async function textSave(attr) {
	let id
	await homePageFns.textSave(attr).then(res => {
		if (res.code === 200) {
			id = res.data
		} else {
			ElMessage.error({
				message: res.message,
				type: 'error'
			})
		}
	})
	return id
}

export async function infoFlowSaveContent(attr) {
	let obj = {}
	await homePageFns.infoFlowSaveContent(attr).then(res => {
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
// 获取自建内容里面的文字 
export async function textDetails(attr) {
	let str
	await homePageFns.textDetails(attr).then(res => {
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
