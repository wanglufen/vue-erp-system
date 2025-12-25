import axios from 'axios'
import { ElMessage } from 'element-plus'

// 1. 创建 axios 实例
const service = axios.create({
  // 这里的 '/api' 是一个暗号，后面我们在 vite.config.ts 里配置代理
  // 意思是：凡是 '/api' 开头的请求，都发给后端
  baseURL: '/api', 
  timeout: 5000 // 请求超时时间
})

// 2. 请求拦截器 (发送请求前做的事)
service.interceptors.request.use(
  (config) => {
    // 比如：在请求头里带上 Token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 3. 响应拦截器 (收到结果后做的事)
service.interceptors.response.use(
  (response) => {
    const res = response.data
    // 假设后端约定：code === 200 代表成功
    if (res.code !== 200) {
      ElMessage.error(res.msg || '系统错误')
      return Promise.reject(new Error(res.msg || 'Error'))
    }
    return res
  },
  (error) => {
    // 处理 401, 404, 500 等 HTTP 状态码
    ElMessage.error(error.message || '网络请求失败')
    return Promise.reject(error)
  }
)

export default service