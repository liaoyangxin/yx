import { ElMessage } from 'element-plus'
import * as homePageFns from '@/api/homePage/index.js'
import * as audioFns from '@/api/audioAccount/index.js'

export async function videoQueryLimit(){
    let arr = {}
    await homePageFns.videoQueryLimit().then(res => {
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
export async function imageQueryLimit(){
    let arr = {}
    await homePageFns.imageQueryLimit().then(res => {
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

export async function videoModify(attr){
    // let arr = {}
    await homePageFns.videoModify(attr).then(res => {
        if (res.code === 200) {
            // arr = res
        } else {
            ElMessage.error({
                message: res.message,
                type: 'error'
            }) 
        }
    })
    // return arr
}

export async function imageModify(attr){
    // let arr = {}
    await homePageFns.imageModify(attr).then(res => {
        if (res.code === 200) {
            // arr = res
        } else {
            ElMessage.error({
                message: res.message,
                type: 'error'
            }) 
        }
    })
    // return arr
}
// 音频的按条件查询 在资源库使用
export async function audioQueryLimit(){
    let arr = {}
    await audioFns.audioQueryLimit().then(res => {
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

// 音频名字修改
export async function audioModify(attr){
    // let arr = {}
    await audioFns.audioModify(attr).then(res => {
        if (res.code === 200) {
            // arr = res
        } else {
            ElMessage.error({
                message: res.message,
                type: 'error'
            }) 
        }
    })
    // return arr
}
