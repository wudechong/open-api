import globalLocale from '@/locale'
import cn_locale from './lib/cn'
import en_locale from './lib/en'

const messages = {
	cn: {
		...globalLocale.cn,
		...cn_locale
	},
	en: {
		...globalLocale.en,
		...en_locale
	}
}

export default messages