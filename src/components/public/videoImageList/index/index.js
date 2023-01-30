import { ElMessage } from 'element-plus'
import * as homePageFns from '@/api/homePage/index.js'
import * as audioFns from '@/api/audioAccount/index.js'

// 类型
// attr{
//     duration:'时长 null',
//     geCreateAt:'创建时间 ''', 
//     leCreateAt:'结束时间 ''', 
//     kw:'关键字搜索 ''', pn:'页码 1', 
//     ps:'页大小 number', 
//     size:'视频容量 null'
// }
export async function videoPage(attr) {
	let obj = {}
	await homePageFns.videoPage(attr).then(res => {
		if (res.code === 200) {
			obj = res.data
		} else {
			ElMessage.error({
				message: res.message,
				type: 'error'
			})
		}
	})
	return obj
}
// 获取图片资源库的数据
export async function imagePage(attr) {
	let obj = {}
	await homePageFns.imagePage(attr).then(res => {
		if (res.code === 200) {
			obj = res.data
		} else {
			ElMessage.error({
				message: res.message,
				type: 'error'
			})
		}
	})
	return obj
}
// 视频的删除 ids:[]
export async function videoBatchDelete(attr) {
	await homePageFns.videoBatchDelete(attr).then(res => {
		if (res.code === 200) {
			// arr = res.data.records
		} else {
			ElMessage.error({
				message: res.message,
				type: 'error'
			})
		}
	})
}
// 图片的删除 ids:[]
export async function imageBatchDelete(attr) {
	await homePageFns.imageBatchDelete(attr).then(res => {
		if (res.code === 200) {
			// arr = res.data.records
		} else {
			ElMessage.error({
				message: res.message,
				type: 'error'
			})
		}
	})
	// return arr
}

// 音频资源库数据
export async function audioPage(attr) {
	let obj = {}
	await audioFns.audioPage(attr).then(res => {
		if (res.code === 200) {
			obj = res.data
		} else {
			ElMessage.error({
				message: res.message,
				type: 'error'
			})
		}
	})
	return obj
}
// 音频的删除 ids:[]
export async function audioBatchDelete(attr) {
	await audioFns.audioBatchDelete(attr).then(res => {
		if (res.code === 200) {
			// arr = res.data.records
		} else {
			ElMessage.error({
				message: res.message,
				type: 'error'
			})
		}
	})
}