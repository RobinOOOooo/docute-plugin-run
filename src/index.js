function docutePluginRun(globalOptions) {
  return {
    name: 'docutePluginRun',
    extend: (api) => {
      // 获取 自定义设置
      const getCustomOptions = function (str) {
        let customOptions = str.match(/\{.*?\}/)
        if (customOptions) {
          try {
            // eslint-disable-next-line no-new-func
            customOptions = new Function(`return ${customOptions[0]}`)()
          } catch {
            customOptions = {}
          }
        }
        return customOptions
      }

      // 替换markdown内容
      const replaceContent = function (content) {
        const regexp = /^```\s*html\s+run(.*\r?\n)([^]*?)```/gm
        return content.replace(regexp, (matched, optionsStr, code) => {
          const customOptions = getCustomOptions(optionsStr.trim())
          const options = Object.assign({}, {themeColor: '#009688', themeBorderColor: '#eaeaea'}, globalOptions, customOptions)

          return `<vue-run-sfc v-bind='${JSON.stringify(
            options
          )}' code="${encodeURIComponent(code)}"></vue-run-sfc>`
        })
      }

      api.processMarkdown(replaceContent)
    }
  }
}
