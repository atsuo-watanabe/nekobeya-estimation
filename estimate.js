new Vue({
    el: '#app',
    data: {
        selection: {
            house: null,
            room: null,
            plan: null,
            old_price: null,
            from_date: '',
            to_date: '',
            cat_count: 1,
            is_airport:false,
            is_pickup: false,
            is_sending: false,
            options: [
                {
                    name: '',
                    unit_price: null,
                    count: null
                }
            ]
        },
        houses: {
            wxAArFXAzvwHMUQshtRq: {
                name: '羽田空港店',
                estimation_prefix_note: 'ねこべや羽田空港店をお問い合わせ頂き誠にありがとうございます。\nご希望の日程ですが、現時点でお預かり可能です。\n\nお見積りご案内させて頂きます。',
                estimation_suffix_note: '上記内容でご予約進めてもよろしいでしょうか？\nご確認・ご検討よろしくお願い致します。\nねこべや羽田空港店',
                additional_cat_fee: 3000,
                rooms: [
                    { id: 'all', name: 'すべて', price: 0 },
                    { id: 'four', name: '4畳', price: 7000 },
                    { id: 'two', name: '2畳', price: 5500 },
                    { id: 'one_window', name: '1畳(窓あり)', price: 5500 },
                    { id: 'one', name: '1畳(窓なし)', price: 5500 }
                ],
                plans: [
                    { id: 'basic', name: '毎日報告プラン', price: 0, description: "" },
                    { id: 'report', name: '最終日報告プラン', price: -1000, description: "・最終日報告プランでお見積りご案内させて頂きます。\n・毎日、報告希望（1日1,100円追加）の場合はお申し出くださいませ。" }
                ],
                old_prices: [
                    { id: 'none', name: 'なし', value: 0, additional_cat_value: 0 },
                    { id: 'end', name: '-¥1,000/日（最終日）', value: -1000 },
                    { id: 'old', name: '-¥1,000/日（旧）', value: -1000 }
                ],
            },
            LQd85lKTPb1VDheSmAzU: {
                name: '湘南店',
                estimation_prefix_note: '',
                estimation_suffix_note: '',
                additional_cat_fee: 3000,
                rooms: [
                    { id: 'all', name: 'すべて', price: 0 },
                    { id: 'five', name: '５畳', price: 5500 },
                    { id: 'two', name: '２畳', price: 4500 }
                ]                ,
                plans: [
                    { id: 'all', name: 'すべて', price: 0, description: '' },
                    { id: 'basic', name: '基本プラン（文章報告プラン）', price: 0, description: "" },
                    { id: 'movie', name: '動画報告プラン', price: 500, description: '' }
                ],
                old_prices: [
                    { id: 'none', name: 'なし', value: 0, additional_cat_value: 0 },
                    { id: '-800-yukichi', name: '-¥800/日(ゆきち2畳）', value: -800, additional_cat_value: -1200 },
                    { id: '1800', name: '-¥1800/日(ゆきち)', value: -1800, additional_cat_value: -1200 }
                ],
            },
        },
        transportation_fee: {
            airport: 0,
            pickup: 0,
            sending: 0
        },
        rooms: [
        ],
        plans: [
        ],
        old_prices: [
        ],
        additional_cat_fee: 0,
        high_seasons: [
            {from: '2022/03/18', to: '2022/04/05'},
            {from: '2022/04/22', to: '2022/05/08'},
            {from: '2022/07/15', to: '2022/08/31'},
            {from: '2022/09/16', to: '2022/09/25'},
            {from: '2022/12/23', to: '2023/01/09'},
            {from: '2023/03/17', to: '2023/04/03'},
            {from: '2023/04/21', to: '2023/05/08'},
            {from: '2023/07/14', to: '2023/08/31'},
            {from: '2023/12/22', to: '2024/01/09'},
        ],
        high_season_unit_price: 500,
        estimations: []
    },
    mounted: function () {
        const today = moment().format('YYYY-MM-DD')
        this.selection.from_date = today
        this.selection.to_date = today

        // this.selection.house = this.houses[this.initHouseId];
        // this.selection.room = this.rooms[0];
        // this.selection.plan = this.plans[0];
        // this.selection.old_price = this.old_prices[0];
        // axios.get(`/article/editor/${this.request_id}/edit/data`)
        //     .then(response => {
        //         const result = response.data;
        //         this.article = {
        //             title: result.interviewArticle.title,
        //             studentName: result.interviewArticle.studentName,
        //             universityName: result.interviewArticle.universityName,
        //             jobType: result.interviewArticle.jobTypeId,
        //             workPeriodFrom: result.interviewArticle.workPeriodFrom,
        //             workPeriodTo: result.interviewArticle.workPeriodTo,
        //             interviewUniversityClassId: result.interviewArticle.universityClassId,
        //             image: result.interviewArticle.imageId ?
        //                 { imageId: result.interviewArticle.imageId,
        //                     image: result.interviewArticle.image } :
        //                 null,
        //             sections: result.interviewArticle.sections
        //         };
        //         this.corporationId = result.interviewArticle.corporationId;
        //         this.jobTypes = result.jobTypes;
        //         this.universityClasses = result.universityClasses;
        //         if (result.interviewArticle.image) {
        //             this.previewImage = result.imageApiBaseUrl + result.interviewArticle.image + '?w=400&h=300';
        //         }
        //     })
        //     .catch(error => {
        //         alert('インタビュー記事取得に失敗しました。');
        //     })
    },
    filters: {
        formatYen: function (value) {
            if (value < 0) {
                const inversion = value * -1
                return `-¥${inversion.toLocaleString()}`
            }
            return `¥${value.toLocaleString()}`
        }
    },
    computed: {
        selectableHouses: function() {
            let results = []
            for (const [key, value] of Object.entries(this.houses)) {
                results.push({id: key, name: value['name']})
            }

            return results
        },
    },
    methods: {
        onChangeHouse: function() {
            const selectedHouse = this.houses[this.selection.house.id]
            this.rooms = selectedHouse.rooms
            this.plans = selectedHouse.plans
            this.old_prices = selectedHouse.old_prices
            this.additional_cat_fee = selectedHouse.additional_cat_fee
        },
        onChangeAirport: function() {
            if (!this.selection.is_airport) {
                Vue.set(this.transportation_fee, "airport", 0)
            }
        },
        onChangePickup: function() {
            if (!this.selection.is_pickup) {
                Vue.set(this.transportation_fee, "pickup", 0)
            }
        },
        onChangeSending: function() {
            if (!this.selection.is_sending) {
                Vue.set(this.transportation_fee, "sending", 0)
            }
        },
        onClickAddOption: function() {
            const option = {
                name: '',
                unit_price: null,
                count: null
            }
            this.selection.options.push(option)
        },
        onClickEstimate: function() {
            if (!this.selection.house || !this.selection.room || !this.selection.plan) {
                alert('「店舗」・「部屋」・「プラン」を全て選択してください')
                return
            }
            this.adjustSelection()
            const days = this.calculateDays()
            let rooms
            if (this.selection.room.id === 'all') {
                rooms = this.rooms.filter(room => room.id !== 'all')
            } else {
                rooms = [this.selection.room]
            }
            let plans
            if (this.selection.plan.id === 'all') {
                plans = this.plans.filter(plan => plan.id !== 'all')
            } else {
                plans = [this.selection.plan]
            }

            let estimations = [];
            rooms.forEach(room => {
                plans.forEach(plan => {
                    estimations.push(this.createEstimation(room, plan, days))
                })
            })
            this.estimations = estimations
        },
        adjustSelection: function () {
            const from = moment(this.selection.from_date)
            const to = moment(this.selection.to_date)
            if (from.isAfter(to)) {
                this.selection.from_date = to.format('YYYY-MM-DD')
                this.selection.to_date = from.format('YYYY-MM-DD')
            }
            if (this.selection.cat_count < 1) {
                this.selection.cat_count = 1
            }
        },
        createEstimation: function (room, plan, days) {
            const name = `${room.name}部屋 - ${plan.name}`
            const basic_fee= this.calculateBasicFee(room, days)
            const additional_cat_fee = this.selection.cat_count > 1 ?
                this.calculateAdditionalCatFee(this.additional_cat_fee, this.selection.cat_count, days) :
                null
            const transportation_fee = this.calculateTransportationFee()
            const plan_fee = this.calculatePlan(plan, days)
            const high_season_fees = this.resolveHighSeasonFees()
            const option_fees = this.calculateOptions()

            const basic_fee_total = basic_fee.total
            const additional_cat_fee_total = additional_cat_fee ? additional_cat_fee.total : 0
            const transportation_fee_total = transportation_fee ? transportation_fee.total : 0
            const plan_fee_total = plan_fee ? plan_fee.total : 0
            const sum_up = (acc, value) => acc + value
            const high_season_fees_total = high_season_fees.length > 0 ? high_season_fees.map(fee => fee.total).reduce(sum_up) : 0
            const option_fees_total = option_fees.length > 0 ? option_fees.map(fee => fee.total).reduce(sum_up) : 0

            const total = basic_fee_total + additional_cat_fee_total + transportation_fee_total + plan_fee_total + high_season_fees_total + option_fees_total
            const consumption_tax = Math.ceil(total * 0.1)
            const tax_include = total + consumption_tax
            return {
                selection: JSON.parse(JSON.stringify(this.selection)), // deep copy
                name: name,
                room: room,
                plan: plan,
                days: days,
                basic_fee: basic_fee,
                additional_cat_fee: additional_cat_fee,
                transportation_fee: transportation_fee,
                plan_fee: plan_fee,
                high_season_fees: high_season_fees,
                option_fees: option_fees,
                total: total,
                consumption_tax: consumption_tax,
                tax_include: tax_include
            }
        },
        calculateBasicFee: function(room, days) {
            const old_price =this.selection.old_price.value
            const unit_price = room.price + old_price
            const start_day = moment(this.selection.from_date).format('M/D')
            const end_day = moment(this.selection.to_date).format('M/D')

            return {
                name: '基本料金',
                unit_price: unit_price,
                days: days,
                total: unit_price * days,
                formula: `${ this.$options.filters.formatYen(unit_price) } × ${days}日分 (${start_day}~${end_day}　${days-1}泊${days}日)`
            }
        },
        calculateAdditionalCatFee: function(additional_cat_fee, cat_counts, days) {
            const old_price =this.selection.old_price.additional_cat_value
            const unit_price = additional_cat_fee + old_price
            const additional_cat_counts = cat_counts - 1
            return {
                name: '頭数追加料金',
                unit_price: unit_price,
                additional_cat_counts: additional_cat_counts,
                days: days,
                total: unit_price * additional_cat_counts * days,
                formula: `${ this.$options.filters.formatYen(unit_price) } × ${additional_cat_counts}匹 × ${days}日`
            }
        },
        calculateTransportationFee: function() {
            if (!this.selection.is_airport && !this.selection.is_pickup && !this.selection.is_sending) {
                return null
            }
            let kind
            if (this.selection.is_airport) {
                kind = '空港送迎'
            }
            else if (this.selection.is_pickup && this.selection.is_sending) {
                kind = '往復'
            }
            else if (this.selection.is_pickup) {
                kind = 'お迎え'
            } else {
                kind = 'お送り'
            }

            return {
                name: `送迎代 (${kind})`,
                airport_fee: this.transportation_fee.airport,
                pickup_fee: this.transportation_fee.pickup,
                sending_fee: this.transportation_fee.sending,
                total: this.transportation_fee.airport + this.transportation_fee.pickup + this.transportation_fee.sending,
                formula: this.resolveTransportationFormula()
            }
        },
        resolveTransportationFormula: function() {
            if (
                (this.selection.is_pickup && this.selection.is_sending) &&
                (this.transportation_fee.pickup === 0 && this.transportation_fee.sending === 0)
            ) {
                return '無料 (往復)'
            }

            let airport = null
            if (this.selection.is_airport) {
                airport = this.transportation_fee.airport === 0 ? '空港送迎無料' : `${this.$options.filters.formatYen(this.transportation_fee.airport)}`
            }

            let pickup = null
            if (this.selection.is_pickup) {
                pickup = this.transportation_fee.pickup === 0 ? '無料' : `${this.$options.filters.formatYen(this.transportation_fee.pickup)}`
            }

            let sending = null
            if (this.selection.is_sending) {
                sending = this.transportation_fee.sending === 0 ? '無料' : `${this.$options.filters.formatYen(this.transportation_fee.sending)}`
            }

            if (airport) {
                return `${airport} `
            } else if (pickup && sending) {
                return `${pickup} (お迎え) + ${sending}(お送り)`
            } else if (pickup) {
                return `${pickup} (お迎え)`
            } else {
                return `${sending} (お送り)`
            }
        },
        calculatePlan: function(plan, days) {
            if (plan.price <= 0) {
                return null
            }
            return {
                name: plan.name,
                unit_price: plan.price,
                description: plan.description,
                days: days,
                total: plan.price * days,
                formula: `${this.$options.filters.formatYen(plan.price)} × ${days}日分`
            }
        },
        calculateDays: function() {
            const diff = moment(this.selection.to_date).diff(moment(this.selection.from_date))
            const duration = moment.duration( diff )
            return Math.floor( duration.asDays() ) + 1;
        },
        resolveHighSeasonFees: function() {
            return this.high_seasons.map(term => this.resolveHighSeasonFee(term)).filter(days => days != null)
        },
        resolveHighSeasonFee: function(term) {
            let current_day = moment(this.selection.from_date)
            const end_day = moment(this.selection.to_date)
            let high_season_dates = []
            const from = moment(term.from)
            const to = moment(term.to)
            while (end_day.isSameOrAfter(current_day)) {
                if (current_day.isSame(from) || current_day.isSame(to) || current_day.isBetween(from, to)) {
                    high_season_dates.push(current_day.format('M/D'))
                }
                current_day = current_day.add(1, 'days')
            }
            if (high_season_dates.length < 1) {
                return null
            }
            const days = high_season_dates.length
            const unit_price = this.high_season_unit_price
            const from_date = high_season_dates[0]
            const to_date = high_season_dates[(days - 1)]
            return {
                name: `シーズン料金 (${from_date} ~ ${to_date})`,
                days: days,
                unit_price: unit_price,
                total: unit_price * days,
                formula: `${this.$options.filters.formatYen(unit_price)} × ${days}日分 (${from_date}~${to_date})`
            }
        },
        calculateOptions: function() {
            return this.selection.options
                .filter(option => option.name)
                .map(option => {
                    const name = option.name
                    const count = option.count == null ? 0 : option.count
                    const unit_price = option.unit_price == null ? 0 : option.unit_price
                    return {
                        name: name,
                        count: count,
                        unit_price: unit_price,
                        total: unit_price * count,
                        formula: `${this.$options.filters.formatYen(unit_price)} × ${count}`
                    }
                })
        },
        onClickCopyEstimation() {
            const create_high_season_fees_text = (high_season_fees) => {
                if (high_season_fees.length < 1) {
                    return ''
                }

                const details = high_season_fees.map(fee => `${fee.formula}=${this.$options.filters.formatYen(fee.total)}（税抜）\n`).join('')
                return `シーズン料金：${details}`
            }
            const create_option_fees_text = (fees) => {
                if (fees.length < 1) {
                    return ''
                }

                return fees.map(fee => `${fee.name}:${fee.formula}=${this.$options.filters.formatYen(fee.total)}（税抜）\n`).join('')
            }
            const create_optional_fee_text = (fee) => {
                if (!fee) {
                    return ''
                }
                return `${fee.name}:${fee.formula}=${this.$options.filters.formatYen(fee.total)}（税抜）\n`
            }
            const prefix_note = this.houses[this.selection.house['id']]['estimation_prefix_note']
            const suffixNote = this.houses[this.selection.house['id']]['estimation_suffix_note']
            const estimationNameSolver = this.estimations.length > 1 ? (estimation) => `【${estimation.name}】\n` : (_) => ''
            const text = this.estimations.map(estimation => {
                return `
${estimationNameSolver(estimation)}${estimation.plan ? estimation.plan.description : ''}

【見積もり料金】ねこべや${this.selection.house.name}店(${estimation.room.name}部屋)　猫${estimation.selection.cat_count}匹
基本料金：${estimation.basic_fee.formula}=${this.$options.filters.formatYen(estimation.basic_fee.total)}（税抜）
${create_optional_fee_text(estimation.additional_cat_fee)}${create_optional_fee_text(estimation.transportation_fee)}${create_optional_fee_text(estimation.plan_fee)}${create_high_season_fees_text(estimation.high_season_fees)}${create_option_fees_text(estimation.option_fees)}
合計金額　${this.$options.filters.formatYen(estimation.tax_include)}（税込：消費税10%）
`
            })
                .join("\n")
            const prefix = `${prefix_note}\n`
            const suffix = `\n${suffixNote}`

            this.copyTextToClipboard(prefix + text + suffix);
        },
        copyTextToClipboard(textVal){
            navigator.clipboard
                .writeText(textVal)
                .then(() => {
                    alert('クリップボードにコピーしました');
                })
                .catch(e => {
                    console.error(e)
                })
        },
        createShonanEstimationSentence: function() {

        },
    }
})