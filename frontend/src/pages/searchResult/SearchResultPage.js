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
        myName: "",
        myAvatar: "",
        searchMode: 0, //searchMode=1时，显示相关讨论区，为0时显示用户
        searchUserList: [],

        searchCommmentAreaList: [],
        searchInput: "",
    },
    methods: {
        // 正则表达式匹配，从上个界面的url得到searchInput
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
            this.searchInput = atob(decodeURI(this.getParams('searchContent')));
            this.$axios.post('http://127.0.0.1:8000/user/get_user_information')
                .then(
                    (res) => {
                        res = res.data
                        if (res.code != 200) {
                            console.log('failed to initialize')
                            return
                        }
                        this.myName = res.data.information.user_name
                        this.myAvatar = res.data.information.user_photo
                        this.searchMode = 0
                        if (this.searchInput.length > 0)
                            this.handleSearch()
                        this.searchInput = ''
                    }
                )
        },

        // 搜索处理
        handleSearch() {
            this.searchUserList = []
            this.searchCommmentAreaList = []
            if (this.searchInput.length > 0) {
                let data = {
                    "searchString": this.searchInput,
                }
                this.$axios.get('http://127.0.0.1:8000/SearchAndResults/SearchForPapersAndUsers', { params: data })
                    .then(
                        (res) => {
                            let result = res.data
                            if (result.code === 200) {
                                let resUser = result.data.findUsers
                                resUser.forEach(
                                    (key) => {
                                        this.searchUserList.push(
                                            {
                                                userId: key.id,
                                                userName: key.user_name,
                                                userAvatar: "/media/" + key.user_photo,
                                            }
                                        )
                                    }
                                )
                                let resCA = result.data.findCommentAreas
                                resCA.forEach(
                                    (key) => {
                                        this.searchCommmentAreaList.push(
                                            {
                                                id: key.id,
                                                title: key.title,
                                                address: key.path
                                            }
                                        )
                                    }
                                )
                            }
                            else {
                                if (result.data.msg === 'cookie out of date') {
                                    alert('登录超时，请重新登录')
                                    window.location.href = 'http://127.0.0.1:8000/user/login.html'
                                }
                                console.log("请求失败")
                            }
                        }
                    )
            }
        },

        //页面跳转处理
        handleBack() {
            history.back()
        },

        handleUserDetail(id) {
            window.location.href = "http://127.0.0.1:8000/SearchAndResults/UserProfilePage.html?userid=" + id
        },

        handleCommentAreaDetail(id) {
            window.location.href = "http://127.0.0.1:8000/commentarea/commentArea.html?id=" + id
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
    }
})