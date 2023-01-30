import { ElMessage } from 'element-plus'
import axios from '@/http/axios'
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