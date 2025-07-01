// import { firebase } from '@react-native-firebase/storage'
// import fire from '@react-native-firebase/app';

// const firebaseConfig = {
// 	apiKey: "AIzaSyDKjXrw7aErTJqi2UziSdTzVauXbHP3S6U",
// 	authDomain: "rocketpdv-dev.firebaseapp.com",
// 	projectId: "rocketpdv-dev",
// 	databaseURL: "https://rocketpdv-dev.firebaseio.com",
// 	storageBucket: "rocketpdv-dev.appspot.com",
// 	messagingSenderId: "954863674958",
// 	appId: "1:954863674958:web:f4912a2426952adac8051f"
// }

// if (!fire.apps.length) {
// 	fire.initializeApp(firebaseConfig)
// } else {
// 	fire.app()
// }
export const localeBr = {
	name: 'pt-br',
	config: {
		months: 'janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro'.split(
			'_'
		),
		monthsShort: 'jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez'.split('_'),
		weekdays: 'domingo_segunda-feira_terça-feira_quarta-feira_quinta-feira_sexta-feira_sábado'.split(
			'_'
		),
		weekdaysShort: 'dom_seg_ter_qua_qui_sex_sáb'.split('_'),
		weekdaysMin: 'do_2ª_3ª_4ª_5ª_6ª_sá'.split('_'),
		weekdaysParseExact: true,
		longDateFormat: {
			LT: 'HH:mm',
			LTS: 'HH:mm:ss',
			L: 'DD/MM/YYYY',
			LL: 'D [de] MMMM [de] YYYY',
			LLL: 'D [de] MMMM [de] YYYY [às] HH:mm',
			LLLL: 'dddd, D [de] MMMM [de] YYYY [às] HH:mm',
		},
		calendar: {
			sameDay: '[Hoje às] LT',
			nextDay: '[Amanhã às] LT',
			nextWeek: 'dddd [às] LT',
			lastDay: '[Ontem às] LT',
			lastWeek: '[Última] dddd [às] LT',
			sameElse: 'L',
		},
		relativeTime: {
			future: 'em %s',
			past: 'há %s',
			s: 'poucos segundos',
			ss: '%d segundos',
			m: 'um minuto',
			mm: '%d minutos',
			h: 'uma hora',
			hh: '%d horas',
			d: 'um dia',
			dd: '%d dias',
			M: 'um mês',
			MM: '%d meses',
			y: 'um ano',
			yy: '%d anos',
		},
		dayOfMonthOrdinalParse: /\d{1,2}º/,
		ordinal: '%dº',
		invalidDate: 'Data inválida',
	}
}

export const convertToParse = (text: any) => {
	try {
		let convert = JSON.parse(text)
		return convert
	} catch (error) {
		return false
	}
}

export const sendUrl = async (store: any, uri: any) => {
	try {
		// const imageRef = firebase
		// 	.app()
		// 	.storage('gs://rock-at-promoter-photos')
		// 	.ref(`${store.id}/checkIn`)

		// console.log(uri)
		// await imageRef.putFile(uri)

		// const url = await imageRef.getDownloadURL()
		// console.log(url, 'url')
		// return url
	} catch (error) {
	}

}