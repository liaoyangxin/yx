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
// 详细流的详情 
export function infoFlowDetails(attr){
	return new Promise((resolve, reject) => {
		axios({
			method: 'GET',
			url: '/openApi/info-flow/details',
			params: attr
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
// 查询自建内容 里面输入的文字
export function textDetails(attr){
	return new Promise((resolve, reject) => {
		axios({
			method: 'GET',
			url: '/openApi/library/text/details',
			params: attr
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
// 秒转 00:00:00
export function secondsToTime(value) {
    let result = parseInt(value)
    let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
    let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
    let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
 
    let res = '';
    res += `${h}:`;
    res += `${m}:`;
    res += `${s}`;
    return res;
}
// 00:00:00 转毫秒
export function timeToSec(time) {
    let hour = time.split(':')[0]
    let min = time.split(':')[1]
    let sec = time.split(':')[2]
    let s = Number(hour * 3600) + Number(min * 60) + Number(sec)
    return s * 1000
}
// 00:00:00 转秒
export function timeToSeconds(time) {
    let hour = time.split(':')[0]
    let min = time.split(':')[1]
    let sec = time.split(':')[2]
    let s = Number(hour * 3600) + Number(min * 60) + Number(sec)
    return s
}