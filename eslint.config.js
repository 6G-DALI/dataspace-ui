import antfu from '@antfu/eslint-config'
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss'

export default antfu({}, {
  plugins: {
    'better-tailwindcss': eslintPluginBetterTailwindcss,
  },
  rules: {
    // enable all recommended rules to report a warning
    ...eslintPluginBetterTailwindcss.configs['recommended-warn'].rules,
  },
  settings: {
    'better-tailwindcss': {
      // tailwindcss 4: the path to the entry file of the css based tailwind config (eg: `src/global.css`)
      entryPoint: 'src/assets/tailwind.css',
    },
  },
})
