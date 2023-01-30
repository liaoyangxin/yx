import axios from '@/http/axios'

export function initData(data) {
	return new Promise((resolve, reject) => {
		axios({
			method: 'post',
			url: '/statistics/index',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

// 获取菜单
export function findByLoginUser(data) {
	return new Promise((resolve, reject) => {
		axios({
			method: 'post',
			url: '/auth/menu/findByLoginUser',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 修改密码
export function updatePassword(data) {
	return new Promise((resolve, reject) => {
		axios({
			method: 'post',
			url: '/auth/users/updatePassword',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 退出登录
export function logout(data) {
	return new Promise((resolve, reject) => {
		axios({
			method: 'post',
			url: '/auth/logout',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 文件/视频上传
export function fileUpload(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'post',
			url: '/library/upload',
			timeout: 50000000,
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 分类下拉列表
export function dropDownList(attr) {
	return new Promise((resolve, reject) => {
		axios({
			method: 'get',
			// url: '/manage/category/dropDownList'
			url: `/manage/category/dropDownList`,
			params:attr
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 作者选项
export function authorDropDownList(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'get',
			url: `/manage/author/dropDownList`,
			params:data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 主题选项 
export function subjectDropDownList(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'GET',
			url: `/manage/subject/dropDownList`,
			params:data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 获取资源库的视频数据
// data{duration:'时长 null',geCreateAt:'创建时间 ''', leCreateAt:'结束时间 ''', kw:'关键字搜索 ''', pn:'页码 1', ps:'页大小 number', size:'视频容量 null'}
export function videoPage(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'post',
			url: '/library/video/page',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 主视频的保存 
export function iwpostSave(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'post',
			url: '/manage/iwpost/save',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 获取资源库的图片数据
export function imagePage(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/library/image/page',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 右边信息流的保存
export function infoFlowSave(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/manage/info-flow/save',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}


// 右边信息流详情的保存
export function infoFlowSaveContent(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/manage/info-flow/saveContent',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 内容的删除 批量
export function batchDelete(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/manage/iwpost/batch/delete',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 内容的禁用 批量
export function batchDisable(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/manage/iwpost/batch/disable',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
} 
// 内容的启用 批量
export function batchEnable(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/manage/iwpost/batch/enable',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

// 保存文档资源 
// {
//   "authorId": 0, 作者id
//   "content": "", 输入的内容
//   "id": 0, 文档id 保存后返回来的
//   "infoId": 0, 信息流的id
//   "name": "" 当前编辑的文档的名称
// }
export function textSave(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/library/text/save',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 获取内容主页列表
export function iwpostPage(data){
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

// 获取内容主页 获取查询中 时长、观看次数、观看人数的最大值
export function queryLimit(){
	return new Promise((resolve, reject) => {
		axios({
			method: 'GET',
			url: '/manage/iwpost/queryLimit',
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 内容详情
export function details(attr){
	return new Promise((resolve, reject) => {
		axios({
			method: 'GET',
			url: '/manage/iwpost/details',
			params: attr
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 详细流的详情 
export function infoFlowDetails(attr){
	return new Promise((resolve, reject) => {
		axios({
			method: 'GET',
			url: '/manage/info-flow/details',
			params: attr
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 查询自建内容 里面输入的文字
export function textDetails(attr){
	return new Promise((resolve, reject) => {
		axios({
			method: 'GET',
			url: '/library/text/details',
			params: attr
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 信息流的删除 批量 ids:[]
export function infoFlowDelete(attr){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/manage/info-flow/batch/delete',
			data: attr
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 信息流的禁用 批量 ids: []
export function infoFlowDisable(attr){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/manage/info-flow/batch/disable',
			data: attr
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 信息流的启用 批量 ids: []
export function infoFlowEnable(attr){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/manage/info-flow/batch/enable',
			data: attr
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 视频组件的删除 批量 ids:[]
export function videoBatchDelete(attr){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/library/video/batch/delete',
			data: attr
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

// 图片组件的删除 批量 ids:[]
export function imageBatchDelete(attr){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/library/image/batch/delete',
			data: attr
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 修改视频的名字
export function videoModify(attr){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/library/video/modify',
			data: attr
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

// 修改图片的名字
export function imageModify(attr){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/library/image/modify',
			data: attr
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// -------------------------- 视频资源库
// 获取视频的查询条件中的 时长最大值 容量最大值
export function videoQueryLimit(){
	return new Promise((resolve, reject) => {
		axios({
			method: 'get',
			url: '/library/video/queryLimit'
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 获取图片的查询条件中的 时长最大值 容量最大值
export function imageQueryLimit(){
	return new Promise((resolve, reject) => {
		axios({
			method: 'get',
			url: '/library/image/queryLimit'
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 分页查询文档资源
export function textPage(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/library/text/page',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 文档资源的批量删除 
export function textBatchDelete(data){
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/library/text/batch/delete',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 标签下拉列表
export function tagDropDownList(){
	return new Promise((resolve, reject) => {
		axios({
			method: 'GET',
			url: '/manage/tag/dropDownList',
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// oss 上传图片/视频 oss/signature
export function ossSignature() {
	return new Promise((resolve, reject) => {
		axios({
			method: 'GET',
			url: '/oss/signature',
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 关键词新增
export function addKeyWorld(data) {
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: '/manage/tag/add',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

