<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useUserStore } from '../../stores/userStore'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getSmsCodeApi } from '../../api/userApi'

const userStore = useUserStore()
const router = useRouter()

// 当前激活的 Tab ('account' | 'mobile' | 'qr')
const activeTab = ref('account')
const loading = ref(false)

// === 账号登录数据 ===
const accountForm = reactive({ username: '', password: '' })
const accountRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}
const accountFormRef = ref()

// === 手机登录数据 ===
const mobileForm = reactive({ phone: '', code: '' })
const mobileRules = {
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}
const mobileFormRef = ref()
// 倒计时逻辑
const countdown = ref(0)
const sendSms = async () => {
  if(!mobileForm.phone) return ElMessage.warning('请先输入手机号')
  await getSmsCodeApi(mobileForm.phone)
  ElMessage.success('验证码已发送: 1234')
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if(countdown.value <= 0) clearInterval(timer)
  }, 1000)
}

// === 统一登录处理 ===
const handleLogin = async () => {
  let params: any = { loginType: activeTab.value }
  
  // 1. 账号登录
  if (activeTab.value === 'account') {
    console.log(accountFormRef.value)
    if (!accountFormRef.value) return
    await accountFormRef.value.validate(async (valid: boolean) => {
      if (valid) {
        params.username = accountForm.username
        params.password = accountForm.password
        await doLogin(params)
      }
    })
  } 
  // 2. 手机登录
  else if (activeTab.value === 'mobile') {
    if (!mobileFormRef.value) return
    await mobileFormRef.value.validate(async (valid: boolean) => {
      if (valid) {
        params.phone = mobileForm.phone
        params.code = mobileForm.code
        await doLogin(params)
      }
    })
  }
}

// 执行 Store 登录动作
const doLogin = async (params: any) => {
  loading.value = true
  // 注意：这里我们需要修改 userStore 的 login 方法来接收对象参数，或者在这里拼装
  // 为了简单，假设 userStore.login 已经改造支持传对象，或者我们直接调用 api
  // 这里我们临时直接调 store，但 store 需要稍微改一下（见下文提示）
  const success = await userStore.login(params) 
  loading.value = false
  if (success) {
    ElMessage.success('登录成功')
    router.push('/dashboard')
  } else {
    ElMessage.error('登录失败')
  }
}
</script>

<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="title">ERP 企业管理系统</h2>
      
      <!-- Tab 切换 -->
      <el-tabs v-model="activeTab" stretch>
        
        <!-- Tab 1: 账号密码 -->
        <el-tab-pane label="账号密码" name="account">
          <el-form ref="accountFormRef" :model="accountForm" :rules="accountRules" size="large">
            <el-form-item prop="username">
              <el-input v-model="accountForm.username" placeholder="用户名 (admin)" prefix-icon="User"/>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="accountForm.password" type="password" placeholder="密码 (123)" prefix-icon="Lock" show-password/>
            </el-form-item>
            <el-button type="primary" class="w-100" :loading="loading" @click="handleLogin">登录</el-button>
          </el-form>
        </el-tab-pane>

        <!-- Tab 2: 手机短信 -->
        <el-tab-pane label="手机短信" name="mobile">
          <el-form ref="mobileFormRef" :model="mobileForm" :rules="mobileRules" size="large">
            <el-form-item prop="phone">
              <el-input v-model="mobileForm.phone" placeholder="手机号" prefix-icon="Iphone"/>
            </el-form-item>
            <el-form-item prop="code">
              <div style="display: flex; width: 100%;">
                <el-input v-model="mobileForm.code" placeholder="验证码 (1234)" prefix-icon="Message"/>
                <el-button class="ml-2" :disabled="countdown > 0" @click="sendSms">
                  {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                </el-button>
              </div>
            </el-form-item>
            <el-button type="primary" class="w-100" :loading="loading" @click="handleLogin">登录</el-button>
          </el-form>
        </el-tab-pane>

        <!-- Tab 3: 扫码登录 -->
        <el-tab-pane label="微信扫码" name="qr">
          <div class="qr-box">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ERP-LOGIN" alt="QR Code"/>
            <p>请使用企业微信扫一扫</p>
            <!-- 模拟点击扫码成功 -->
            <el-button type="success" size="small" @click="doLogin({loginType: 'qr'})">模拟扫码成功</el-button>
          </div>
        </el-tab-pane>

      </el-tabs>
    </el-card>
  </div>
</template>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #2d3a4b; /* 深色背景更像 ERP */
}
.login-card { width: 420px; }
.title { text-align: center; margin-bottom: 20px; color: #333; }
.w-100 { width: 100%; }
.ml-2 { margin-left: 10px; }
.qr-box { text-align: center; padding: 20px; }
.qr-box img { width: 150px; height: 150px; margin-bottom: 10px; }
</style>