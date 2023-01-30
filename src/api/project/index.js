import axios from '@/http/axios'

//专题主列表
export function subjectList(data) {
	return new Promise((resolve, reject) => {
		axios({
			method: 'post',
			url: '/manage/subject/page',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 专题批量禁用
export function batchDisable(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/manage/subject/batch/disable',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
} 
//专题批量启用
export function batchEnable(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/manage/subject/batch/enable',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 专题批量删除
export function batchDel(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/manage/subject/batch/delete',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
//添加修改专题信息
export function subjectAddAndEdit(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/manage/subject/add',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
//专题详情查询
export function subjectDetail(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'GET',
			url: '/manage/subject/details?id='+data,
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
//专题播放统计
export function subjectStatistics(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/manage/subject/playStatistics',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

