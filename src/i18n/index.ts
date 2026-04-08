export type Locale = 'zh-CN' | 'en'

export const translations: Record<Locale, Record<string, string>> = {
  'zh-CN': {
    'app.title': '加密理财⑮问',
    'app.subtitle': '输入加密项目名称，回答几个问题，帮你判断能不能存',
    'app.inputPlaceholder': '输入项目名称，例如：Aave, Lido...',
    'app.startButton': '开始诊断',
    'app.yes': '是',
    'app.no': '否',
    'app.yesDetail': '是的',
    'app.noDetail': '不是',
    'app.restart': '重新开始',
    'app.share': '发推分享',
    'app.download': '保存图片',
    'app.history': '历史记录',
    'app.noHistory': '暂无历史记录',
    'app.clearHistory': '清除历史',
    'app.back': '返回',
    'app.questionIndex': '第 {{current}} 题',
    'app.resultTitle.can': '可以存！',
    'app.resultTitle.cannot': '不能存！',
    'app.resultFor': '关于「{{name}}」的诊断结果',
    'app.pathTitle': '决策路径',
    'app.madeWith': '加密理财⑮问',
    'app.copied': '已复制到剪贴板',
    'app.shareNotSupported': '您的浏览器不支持分享功能，图片已下载',
    'app.lang': 'EN',
  },
  en: {
    'app.title': 'Crypto EarnFAQ',
    'app.subtitle': 'Enter a crypto project name, answer a few questions, find out if you should deposit',
    'app.inputPlaceholder': 'Enter project name, e.g.: Aave, Lido...',
    'app.startButton': 'Start Diagnosis',
    'app.yes': 'Yes',
    'app.no': 'No',
    'app.yesDetail': 'Yes',
    'app.noDetail': 'No',
    'app.restart': 'Start Over',
    'app.share': 'Share on X',
    'app.download': 'Save Image',
    'app.history': 'History',
    'app.noHistory': 'No history yet',
    'app.clearHistory': 'Clear History',
    'app.back': 'Back',
    'app.questionIndex': 'Question {{current}}',
    'app.resultTitle.can': 'Safe to Deposit!',
    'app.resultTitle.cannot': 'Do NOT Deposit!',
    'app.resultFor': 'Diagnosis for "{{name}}"',
    'app.pathTitle': 'Decision Path',
    'app.madeWith': 'Crypto EarnFAQ',
    'app.copied': 'Copied to clipboard',
    'app.shareNotSupported': 'Share not supported, image downloaded instead',
    'app.lang': '中文',
  },
}

export function t(locale: Locale, key: string, params?: Record<string, string | number>): string {
  let text = translations[locale][key] || translations['zh-CN'][key] || key
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{{${k}}}`, String(v))
    })
  }
  return text
}
