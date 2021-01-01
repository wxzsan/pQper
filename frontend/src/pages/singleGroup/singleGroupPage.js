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
        userName: "",
        userAvatar: "",

        chatGroupId: 1,
        chatGroupName: "",

        paperList: [],
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
            //获取chatGroupId
            this.chatGroupId = Number(this.getParams("id"))
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
                        this.userName = res.data.information.user_name
                        this.userAvatar = res.data.information.user_photo
                    }
                )

            //获取完chatGroupId后开始获取chatGroupName和论文列表
            let data = {
                "chatGroupId": this.chatGroupId,
            }
            this.$axios.get('http://127.0.0.1:8000/chatgroup/getChatGroupName', { params: data })
                .then(
                    (res) => {
                        res = res.data
                        if (res.code != 200) {
                            console.log('failed to initialize')
                            return
                        }
                        this.chatGroupName = res.data.name
                    }
                )
            this.$axios.get('http://127.0.0.1:8000/chatgroup/getChatGroupPapers', { params: data })
                .then(
                    (res) => {
                        res = res.data
                        if (res.code != 200) {
                            console.log('failed to initialize')
                            return
                        }
                        res = res.data
                        res.paperList.forEach(
                            (key) => {
                                this.paperList.push(
                                    {
                                        title: key.title,
                                        paperId: key.id,
                                        path: key.path,
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
            window.location.href = "http://127.0.0.1:8000/chatgroup/chatGroupPaper.html?id=" + id
        },

        handleBack() {
            window.location.href = "http://127.0.0.1:8000/chatgroup/myChatGroupList.html"
        },

        handleManage(command) {
            if (command == "1")
                window.location.href = 'http://127.0.0.1:8000/chatgroup/memberInGroupPage.html?id=' + this.chatGroupId
            else
                window.location.href = 'http://127.0.0.1:8000/chatgroup/uploadPaperToChatGroup.html?id=' + this.chatGroupId
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