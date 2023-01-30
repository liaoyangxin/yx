import axios from 'axios';
import { ElMessage } from 'element-plus'
import router from '@/routes/index'

//  让请求在浏览器中允许跨域携带cookie
axios.defaults.withCredentials = true;
// 使用自定义配置新建一个 axios 实例
const service = axios.create({
	// 基础的请求地址
	//baseURL: process.env.NODE_ENV === 'development' ? "/api" : "https://dev.api.idworlds.com/",
	baseURL: "/api",
	// 设置超时时间 5s
	headers: {
		post: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' && 'multipart/form-data'
		}
	},
	timeout: 50000
});

// 请求拦截器，例如请求的时候在头部加上请求的token
service.interceptors.request.use(config => {
	if (config.url.indexOf('.aliyuncs.com') > -1) {
		config.withCredentials = false
	} else {
		if (sessionStorage.getItem('token')) {
			config.headers.Authorization = sessionStorage.getItem('token')
		}
	}
	return config;  //  有且必须有一个config对象被返回
}, error => {
	//   对请求错误做些什么
	console.log(error);
	return Promise.reject();
});
// 响应拦截器,例如判断服务器返回的状态，400，500啥的，其实超时可以写到这里面来，我分开写了一个比较直观
service.interceptors.response.use(
	response => {
		if (response.status === 200) {
			if (response.data.code === 4001) {
				ElMessage.error({
					message: response.data.message,
					type: 'error'
				})
				router.push('/')
			} else {
				return Promise.resolve(response.data);
			}

		} else {
			return Promise.reject(response);
		}
	},
	// 服务器状态码不是200的情况,这些自定义（需要与后台商量返回）
	error => {
		if (
			400 <= error.response.status < 500
		) {
			ElMessage.error({
				message: '用户信息过期，请重新登陆',
				type: 'error'
			})
			router.push('/')
			// 清除token
			// localStorage.removeItem("token");
			// 跳转登录
		} else {
			if (error.response.status >= 500) {
				alert("服务器开小差了，请稍后再试！");
			} else {
				alert("服务器开小差了，请稍后再试！");
				return Promise.reject(error)
			}
		}
	}
);

export default service;