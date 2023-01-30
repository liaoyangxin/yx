import axios from '@/http/axios'
//主列表搜索获取观看次数观看人数最大值
export function searchCriteria() {
	return new Promise((resolve, reject) => {
		axios({
			method: 'post',
			url: '/manage/author/queryMax',
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

//up主列表
export function uploaderList(data) {
	return new Promise((resolve, reject) => {
		axios({
			method: 'post',
			url: '/manage/author/page',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// up主批量禁用
export function batchDisable(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/manage/author/batch/disable',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
} 
// up主批量启用
export function batchEnable(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/manage/author/batch/enable',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// up主批量删除
export function batchDel(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/manage/author/batch/delete',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
//添加修改up主信息
export function autherAddAndEdit(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/manage/author/add',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
//up主详情查询
export function autherDetail(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'GET',
			url: '/manage/author/details?id='+data,
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
//up主播放统计
export function statistics(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/manage/author/playStatistics',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

//查询视频列表
export function videoList(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/manage/iwpost/page',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

