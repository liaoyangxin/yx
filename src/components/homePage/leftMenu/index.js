import { findByLoginUser } from '@/api/homePage'
import { ElMessage } from 'element-plus'

export async function init() {
	let getRes = null
	await findByLoginUser().then(res => {
		if( res.code === 200){
			getRes = res.data
		} else {
			ElMessage.error({
				message: res.message,
				type: 'error'
			})
		}
	})
	return getRes
}
