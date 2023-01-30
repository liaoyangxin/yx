import axios from './axios.js'

export function get(url, params={}) {
    return new Promise((resolve, reject) => {
        axios({
            url: url,
            method: 'get',
            params: params
        }).then(res => {
            resolve(res)
        }).catch(err => {
            console.log('err', err)
            reject(err)
        })
    })
}

// export function post(url, data={}, headers={'Content-Type': 'application/json'}) {
//     return new Promise((resolve, reject) => {
//         axios({
//             url: url,
//             method: 'post',
//             data: data,
//             headers:headers
//         }).then(res => {
//             resolve(res)
//         }).catch(err => {
//             reject(err)
//         })
//     })
// }

export function post(url, data={}) {
    return new Promise((resolve, reject) => {
        axios({
            url: url,
            method: 'post',
            data
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export default { get, post }