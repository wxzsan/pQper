/* eslint-disable */

import Vue from 'vue'
// import App from './App'
// import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

Vue.use(ElementUI)
Vue.prototype.$axios = axios

var vm = new Vue({
    el: '#app',
    created: function () {
        this.initDatas()
    },
    data: {
        userId: 0,
        Administrator: 0,
        userName: "",
        userAvatar: "",
        updateInfoList: [],
        searchInput: "",
    },
    methods: {
        // 正则表达式匹配
        getParams(key) {
            var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)")
            var r = window.location.search.substr(1).match(reg)
            if (r != null) {
                return unescape(r[2])
            }
            return null
        },
        // 页面初始化，填入数据
        initDatas() {

            this.$axios.post('http://127.0.0.1:8000/user/get_user_information')
                .then(
                    (res) => {
                        res = res.data
                        if (res.code != 200) {
                            if (res.data.msg === 'cookie out of date') {
                                alert('登录超时，请重新登录')
                                window.location.href = 'http://127.0.0.1:8000/user/login.html'
                            }
                            console.log('failed to initialize')
                            return
                        }
                        this.Administrator = res.data.information.privilege
                        this.userId = res.data.information.id
                        this.userName = res.data.information.user_name
                        this.userAvatar = res.data.information.user_photo
                        this.handleFresh()
                    }
                )
        },

        // 搜索框事件处理
        handleSearch() {
            if (this.searchInput.length > 0) {
                var searchContent = btoa(encodeURI(this.searchInput))
                window.location.href = 'http://127.0.0.1:8000/SearchAndResults/SearchResultPage.html?searchContent=' + searchContent
            }
        },

        handleFresh() {
            this.updateInfoList = []
            let timestamp = Number(Date.parse(new Date()))
            let timespan = 1000 * 3600 * 24 * 30  //设置刷新出来的天数时只需要改最后一个数
            let data = {
                'userid': this.userId,
                'time': (timestamp - timespan) / 1000,
            }
            let config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
            }
            this.$axios.post('http://127.0.0.1:8000/SearchAndResults/Momments', JSON.stringify(data), config)
                .then(
                    (res) => {
                        res = res.data
                        if (res.code === 200) {
                            let result = res.data
                            result.LongComments.forEach(
                                (key) => {
                                    this.updateInfoList.push({
                                        title: key.title,
                                        commentid: key.id,
                                        posterid: key.poster,
                                        poster: key.poster_name,
                                        posttime: key.post_time.slice(0, 19).replace('T', ' '),
                                        content: key.content,
                                    })
                                }
                            )
                        }
                        else {
                            if (res.data.msg === 'cookie out of date') {
                                alert('登录超时，请重新登录')
                                window.location.href = 'http://127.0.0.1:8000/user/login.html'
                            }
                            console.log("请求失败")
                        }
                    }
                )
        },

        handleDetail(id) {
            window.location.href = "http://127.0.0.1:8000/commentarea/longComment.html?id=" + id
        },
        quit: function () {
            this.$axios.post('http://127.0.0.1:8000/user/logout')
                .then(
                    (res) => {
                        res = res.data
                        if (res.code != 200) {
                            if (res.data.msg === 'cookie out of date') {
                                alert('登录超时，请重新登录')
                                window.location.href = 'http://127.0.0.1:8000/user/login.html'
                            }
                            console.log('failed to initialize')
                            return
                        }
                        window.location.href = 'http://127.0.0.1:8000/user/login.html'
                    }
                )
        },
    },
})