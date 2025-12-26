import { defineStore } from 'pinia'

interface SettingsState {
  language: string
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    // 从localStorage获取语言设置，如果没有则使用默认语言
    language: localStorage.getItem('language') || 'zh-CN'
  }),
  
  getters: {
    currentLanguage: (state) => state.language
  },
  
  actions: {
    setLanguage(language: string) {
      this.language = language
      localStorage.setItem('language', language)
    }
  }
})