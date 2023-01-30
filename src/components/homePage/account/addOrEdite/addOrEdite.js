import { ElMessage } from 'element-plus'
import * as homePageFns from '@/api/homePage/index.js'
// 类型
export async function dropDownList(attr){
    let arr = []
    await homePageFns.dropDownList(attr).then(res => {
        if (res.code === 200) {
            arr = res.data
        } else {
            ElMessage.error({
                message: res.message,
                type: 'error'
            }) 
        }
    })
    return arr
}
// 作者
export async function authorDropDownList(attr){
    let arr = []
    await homePageFns.authorDropDownList(attr).then(res => {
        if (res.code === 200) {
            arr = res.data
        } else {
            ElMessage.error({
                message: res.message,
                type: 'error'
            }) 
        }
    })
    return arr
}
// 关键字
export async function tagDropDownList(attr){
    let arr = []
    await homePageFns.tagDropDownList(attr).then(res => {
        if (res.code === 200) {
            arr = res.data
        } else {
            ElMessage.error({
                message: res.message,
                type: 'error'
            }) 
        }
    })
    return arr
}
// 主题
export async function subjectDropDownList(attr){
    let arr = []
    await homePageFns.subjectDropDownList(attr).then(res => {
        if (res.code === 200) {
            arr = res.data
        } else {
            ElMessage.error({
                message: res.message,
                type: 'error'
            }) 
        }
    })
    return arr
}
// 主视频的保存
export async function iwpostSave(attr){
    let obj = {}
    await homePageFns.iwpostSave(attr).then(res => {
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
// 右边信息流的保存
export async function infoFlowSave(attr) {
	let obj = {}
	await homePageFns.infoFlowSave(attr).then(res => {
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
// 左边的删除
export async function batchDelete(attr) {
	let obj = {}
	await homePageFns.batchDelete(attr).then(res => {
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
// 左边的禁用
export async function batchDisable(attr) {
	let obj = {}
	await homePageFns.batchDisable(attr).then(res => {
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
// 左边的启用
export async function batchEnable(attr) {
	let obj = {}
	await homePageFns.batchEnable(attr).then(res => {
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
// 获取主页数据详情
export async function details(attr){
    let arr = {}
    await homePageFns.details(attr).then(res => {
        if (res.code === 200) {
            arr = res.data
        } else {
            ElMessage.error({
                message: res.message,
                type: 'error'
            }) 
        }
    })
    return arr
}
// 获取信息流（条目）数据详情
export async function infoFlowDetails(attr){
    let arr = {}
    await homePageFns.infoFlowDetails(attr).then(res => {
        if (res.code === 200) {
            arr = res
        } else {
            ElMessage.error({
                message: res.message,
                type: 'error'
            }) 
        }
    })
    return arr
}
// 信息流的删除 批量 ids:[]
export async function infoFlowDelete(attr) {
	let str
	await homePageFns.infoFlowDelete(attr).then(res => {
		if (res.code === 200) {
			str = res
		} else {
			ElMessage.error({
				message: res.message,
				type: 'error'
			})
		}
	})
	return str
}
// 信息流的禁用 批量 ids: []
export async function infoFlowDisable(attr) {
	let str
	await homePageFns.infoFlowDisable(attr).then(res => {
		if (res.code === 200) {
			str = res
		} else {
			ElMessage.error({
				message: res.message,
				type: 'error'
			})
		}
	})
	return str
}
// 信息流的启用 批量 ids: []
export async function infoFlowEnable(attr) {
	let str
	await homePageFns.infoFlowEnable(attr).then(res => {
		if (res.code === 200) {
			str = res
		} else {
			ElMessage.error({
				message: res.message,
				type: 'error'
			})
		}
	})
	return str
} 
// 关键词新增
export async function addKeyWorld(attr) {
	let str
	await homePageFns.addKeyWorld(attr).then(res => {
		if (res.code === 200) {
			str = res
		} else {
			ElMessage.error({
				message: res.message,
				type: 'error'
			})
		}
	})
	return str
}