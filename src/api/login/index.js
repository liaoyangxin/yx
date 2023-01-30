import axios from '@/http/axios'
//获取用户当前登录团队
export function login(data) { 
    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url:'/auth/login',
            data,
            // headers: {
            //     'content-type':'multipart/form-data;'
            // }
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
// 获取公钥
export function getPublicKey() { 
    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url:'/auth/rsa/getPublicKey',
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
// 获取登录信息
export function getLoginUser(params) { 
    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url:'/auth/users/getLoginUser',
            params
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}