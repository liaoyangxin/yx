import { ElMessage } from 'element-plus'
import axios from '@/http/axios'
// 获取页面信息
export function details(data) {
	return new Promise((resolve, reject) => {
		axios({
			method: 'get',
			url: '/openApi/iwpost/details',
			params: data
		}).then(res => {
			resolve(res)
		}).catch(err => {
            ElMessage.error({
                message: err.message,
                type: 'error'
            }) 
			reject(err)
		})
	})
}

// 00:00:00 转毫秒
export function timeToSec(time) {
    let hour = time.split(':')[0]
    let min = time.split(':')[1]
    let sec = time.split(':')[2]
    let s = Number(hour * 3600) + Number(min * 60) + Number(sec)
    return s * 1000
}
// 播放统计 
export function playRecord(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/openApi/play-record/record',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
            ElMessage.error({
                message: err.message,
                type: 'error'
            }) 
			reject(err)
		})
	})
}
// 信息流点击 统计 
export function infoFlowClick(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/openApi/infoFlow/click',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
            ElMessage.error({
                message: err.message,
                type: 'error'
            }) 
			reject(err)
		})
	})
}