
import * as homePageFns from '@/api/homePage'
import * as loginFns from '@/api/login'
import { ElMessage } from 'element-plus'
import router from '@/routes/index'
// 修改密码
export async function changPwd(attr) {
	let obj = {}
	await homePageFns.updatePassword(attr).then(res => {
		
		if (res.code === 200) {
			// ElMessage.success({
			// 	message: '修改成功!',
			// 	type: 'success'
			// })
			// router.push('/')
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
// 退出登录
export function loginOut() {
	homePageFns.logout().then(res => {
		if (res.code === 200) {
			ElMessage.success({
				message: res.data,
				type: 'success'
			})
			router.push('/')
		} else {
			ElMessage.error({
				message: res.message,
				type: 'error'
			})
		}
		
	})
}

// 获取公钥
export async function getPublicKey() {
	let str = ''
	await loginFns.getPublicKey().then(res => {
		if (res.code === 200) {
			str = res.data
		} else {
			ElMessage.error({
				message: res.message,
				type: 'error'
			})
		}
	})
	return str
}
// 获取登录

export async function getLoginUser(attr) {
	let obj = {}
	await loginFns.getLoginUser(attr).then(res => {
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