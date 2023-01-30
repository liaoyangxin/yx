import axios from '@/http/axios'

//分类主列表
export function categoryList(data) {
	return new Promise((resolve, reject) => {
		axios({
			method: 'post',
			url: '/manage/category/page',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 分类批量禁用
export function batchDisable(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/manage/category/batch/disable',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
} 
//分类批量启用
export function batchEnable(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/manage/category/batch/enable',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 分类批量删除
export function batchDel(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/manage/category/batch/delete',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
//添加修改分类信息
export function categoryAddAndEdit(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/manage/category/add',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
//分类详情查询
export function categoryDetail(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'GET',
			url: '/manage/category/details?id='+data,
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
//分类播放统计
export function categoryStatistics(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/manage/category/playStatistics',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

