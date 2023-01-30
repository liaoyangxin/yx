import { ElMessage } from 'element-plus'
import * as uploaderFns from '@/api/uploader/index.js'
//获取观看次数观看人数最大值
export async function searchCriteria(){
    let obj = {}
    await uploaderFns.searchCriteria().then(res => {
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
//列表
export async function uploaderList(data){
    let obj = {}
    await uploaderFns.uploaderList(data).then(res => {
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
//列表批量禁用
export async function batchDisable(attr) {
	let obj = {}
	await uploaderFns.batchDisable(attr).then(res => {
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
//列表批量启用
export async function batchEnable(attr) {
	let obj = {}
	await uploaderFns.batchEnable(attr).then(res => {
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
//列表批量删除
export async function batchDel(attr) {
	let obj = {}
	await uploaderFns.batchDel(attr).then(res => {
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
//添加修改up主信息
export async function autherAddAndEdit(attr) {
	let obj = {}
	await uploaderFns.autherAddAndEdit(attr).then(res => {
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
//查询up主详情信息
export async function autherDetail(attr) {
	let obj = {}
	await uploaderFns.autherDetail(attr).then(res => {
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
//播放统计查询
export async function statistics(attr) {
	let obj = {}
	await uploaderFns.statistics(attr).then(res => {
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
//视频列表
export async function videoList(attr) {
	let obj = {}
	await uploaderFns.videoList(attr).then(res => {
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