import request from '../utils/request' // 引入刚才封装的 axios
import { MOCK_USERS } from './mock/userData'

// 开关：true 使用 Mock 数据，false 使用真实后端接口
const USE_MOCK = true 

// 定义类型
interface LoginParams {
  username?: string;
  password?: string;
  phone?: string;
  code?: string;
  loginType: 'account' | 'mobile' | 'qr'; // 登录类型
}

export const loginApi = async (params: LoginParams) => {
  // === 模式 A: 使用真实接口 ===
  if (!USE_MOCK) {
    // 这就是真实请求的样子，发送 POST 到 /api/login
    return request.post('/login', params)
  }

  // === 模式 B: 使用 Mock 数据 (你现在的要求) ===
  return new Promise((resolve) => {
    setTimeout(() => {
      // 1. 账号密码登录逻辑
      if (params.loginType === 'account') {
        const user = MOCK_USERS.find(
          u => u.username === params.username && u.password === params.password
        )
        if (user) {
          resolve({ code: 200, msg: '登录成功', data: { token: 'mock-token', user } })
        } else {
          resolve({ code: 401, msg: '账号或密码错误', data: null })
        }
      } 
      // 2. 手机验证码登录逻辑 (模拟)
      else if (params.loginType === 'mobile') {
        if (params.code === '1234') { // 假设验证码是 1234
           resolve({ code: 200, msg: '登录成功', data: { token: 'mobile-token', user: MOCK_USERS[1] } })
        } else {
           resolve({ code: 401, msg: '验证码错误', data: null })
        }
      }
      // 3. 扫码登录 (通常是轮询，这里直接模拟成功)
      else if (params.loginType === 'qr') {
         resolve({ code: 200, msg: '扫码成功', data: { token: 'qr-token', user: MOCK_USERS[0] } })
      }

    }, 500)
  })
}

// 获取手机验证码接口
export const getSmsCodeApi = async (phone: string) => {
  console.log('发送验证码到:', phone)
  return { code: 200, msg: '验证码已发送(默认1234)' }
}