import axios from '@/http/axios'

// 分页查询音频资源
export function audioPage(data) {
	return new Promise((resolve, reject) => {
		axios({
			method: 'post',
			url: '/library/audio/page',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 获取音频的查询条件中的 时长最大值 容量最大值
export function audioQueryLimit(){
	return new Promise((resolve, reject) => {
		axios({
			method: 'get',
			url: '/library/audio/queryLimit'
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

// 主视频（音频）的保存 
export function iwpostSave(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'post',
			url: '/manage/iwpost/save',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 音频的删除 批量 ids:[]
export function audioBatchDelete(attr){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/library/audio/batch/delete',
			data: attr
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 音频的名字修改
export function audioModify(attr){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/library/audio/modify',
			data: attr
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}