import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN'
import enUS from './en-US'
import esES from './es-ES'
import viVN from './vi-VN'
import { useSettingsStore } from '@/stores/settings'

// 支持的语言列表
export const SUPPORTED_LANGUAGES = [
  { value: 'zh-CN', label: 'chinese' },
  { value: 'en-US', label: 'english' },
  { value: 'es-ES', label: 'spanish' },
  { value: 'vi-VN', label: 'vietnamese' }
]

// 初始化i18n实例
const i18n = createI18n({
  legacy: false, // 使用Composition API必须设置为false
  locale: 'zh-CN', // 默认语言
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
    'es-ES': esES,
    'vi-VN': viVN
  }
})

// 导出i18n实例
export default i18n

// 导出语言切换函数
export const switchLanguage = (locale: string) => {
  i18n.global.locale.value = locale
  const settingsStore = useSettingsStore()
  settingsStore.setLanguage(locale)
}