<template>
  <div class="settings-container">
    <div class="settings-header">
      <h2>{{ $t('settings.language') }}</h2>
    </div>
    
    <div class="settings-content">
      <el-form :model="settingsForm" label-width="120px">
        <el-form-item :label="$t('settings.systemLanguage')">
          <el-select
            v-model="settingsForm.language"
            :placeholder="$t('settings.selectLanguage')"
            style="width: 200px"
            @change="handleLanguageChange"
          >
            <el-option
              v-for="lang in languages"
              :key="lang.value"
              :label="$t(`settings.${lang.label}`)"
              :value="lang.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { SUPPORTED_LANGUAGES } from '@/locales'
import { useSettingsStore } from '@/stores/settings'

const { locale } = useI18n()
const settingsStore = useSettingsStore()

const languages = SUPPORTED_LANGUAGES

const settingsForm = ref({
  language: settingsStore.currentLanguage
})

onMounted(() => {
  // 初始化时将store中的语言设置应用到i18n
  locale.value = settingsStore.currentLanguage
})

const handleLanguageChange = (value: string) => {
  locale.value = value
  settingsStore.setLanguage(value)
}
</script>

<style scoped>
.settings-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.settings-header {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.settings-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #303133;
}

.settings-content {
  margin-top: 20px;
}
</style>