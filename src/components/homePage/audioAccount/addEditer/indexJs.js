import { ElMessage } from 'element-plus'
import * as homePageFns from '@/api/homePage/index.js'

// 信息流的保存
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
// 视频/音频的保存
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

