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
        userId: 0,  // 调试时暂时如此假设
        userName: "",
        userAvatar: "",
        star: 0,
        userMomentList: [],
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
        // 页面初始化，填入所有动态数据
        initDatas() {
            let str = this.getParams('userid')
            if (str == '')
                this.userId = 0
            else
                this.userId = +str
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
                        this.myName = res.data.information.user_name
                        this.myAvatar = res.data.information.user_photo
                    }
                )
            this.$axios.post('http://127.0.0.1:8000/user/get_user_information', { "id": this.userId })
                .then(
                    (res) => {
                        res = res.data
                        if (res.code != 200) {
                            console.log('failed to initialize')
                            return
                        }
                        res = res.data
                        this.star = res.star
                        res = res.information

                        this.userName = res.user_name
                        this.userAvatar = res.user_photo

                    }
                )
            this.$axios.post('http://127.0.0.1:8000/SearchAndResults/SelfMomments', { "userid": this.userId })
                .then(
                    (res) => {
                        res = res.data
                        if (res.code != 200) {
                            console.log('failed to initialize')
                            return
                        }
                        res = res.data
                        res.LongComments.forEach(
                            (key) => {
                                this.userMomentList.push(
                                    {
                                        title: key.title,
                                        id: key.id,
                                        posttime: key.post_time.slice(0, 19).replace('T', ' '),
                                        content: key.content,
                                    }
                                )
                            }
                        )
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

        handleDetail(id) {
            window.location.href = "http://127.0.0.1:8000/commentarea/longComment.html?id=" + id
        },


        handleStar() {
            this.star = 1
            let data = {
                'id': this.userId,
            }
            this.$axios.post('http://127.0.0.1:8000/user/add_star_user', JSON.stringify(data))
                .then(
                    (res) => {
                        res = res.data
                        if (res.code != 200) {
                            if (res.data.msg === 'cookie out of date') {
                                alert('登录超时，请重新登录')
                                window.location.href = 'http://127.0.0.1:8000/user/login.html'
                            }
                            console.log('关注错误')
                            return
                        }
                        this.$message({
                            type: "success",
                            message: "关注成功",
                        })
                    }
                )
        },

        handleCancelStar() {
            this.star = 0
            let data = {
                'id': this.userId,
            }
            this.$axios.post('http://127.0.0.1:8000/user/remove_star_user', JSON.stringify(data))
                .then(
                    (res) => {
                        res = res.data
                        if (res.code != 200) {
                            if (res.data.msg === 'cookie out of date') {
                                alert('登录超时，请重新登录')
                                window.location.href = 'http://127.0.0.1:8000/user/login.html'
                            }
                            console.log('取消关注错误')
                            return
                        }
                        this.$message({
                            type: "success",
                            message: "取消关注成功",
                        })
                    }
                )
        }
    }
})