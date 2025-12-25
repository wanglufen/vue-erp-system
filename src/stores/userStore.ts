import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginApi } from '../api/userApi' // @ 代表 src 目录
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '') // 从本地缓存读取
  const userInfo = ref<any>(null)
  
  // 登录动作
  const login = async (params: any) => {
    try {
      // 调用 api 时直接传对象
      const res = await loginApi(params) 
      if (res.code === 200) {
        token.value = res.data.token
        userInfo.value = res.data.user
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('userInfo', JSON.stringify(res.data.user))
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  // 退出动作
  const logout = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  return { token, userInfo, login, logout }
})