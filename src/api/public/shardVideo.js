import md5 from 'js-md5' //引入MD5加密
import OSS from './tools/aliyun-oss-sdk-6.16.0.min.js'
import {ossSignature} from '@/api/homePage/index.js' // 这里指前端调用接口的api方法
export const uploadByPieces = async ({randoms, file, pieceSize = 2, progress, resourceType, success, error}) => {
    // 如果文件传入为空直接 return 返回
    if (!file) return
    const chunkSize = pieceSize * 1024 * 1024 // 2MB一片
    let resData = {}
    let params = {}
    await ossSignature().then((res) => {
        if (res.code === 200) {
            params = res.data
        }
    })
    const client = new OSS({
        // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
        region: "oss-cn-hongkong",
        // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
        accessKeyId: params.accessKeyId,
        accessKeySecret: params.accessKeySecret,
        // 从STS服务获取的安全令牌（SecurityToken）。
        stsToken: params.stsToken,
        // 填写Bucket名称，例如examplebucket。
        bucket: params.bucket,
    });
    var filename = params.dir + file.name
    if (file.size > chunkSize) {
        try {
            // 分片上传。
            const uploadRes = await client.multipartUpload(filename, file, {
                partSize: chunkSize,
                callback: params.callback
            });
            resData = uploadRes.data.code === 200 ? uploadRes.data.data : {}
            console.log(uploadRes);
        } catch (err) {
            console.log(err);
        }
    } else {
        try {
            // 分片上传。
            const uploadRes = await client.put(filename, file, {callback: params.callback});
            resData = uploadRes.data.code === 200 ? uploadRes.data.data : {}
            console.log(uploadRes);
        } catch (err) {
            console.log(err);
        }
    }
    success(resData)
}
