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
        paperDir: "",
        searchInput: "",
        createRequestList: new Array(),
        userAvatar: "",
    },
    methods: {
        // 正则表达式匹配
        getParams(key) {
            var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)")
            var r = window.location.search.substr(1).match(reg)
            if (r !== null) {
                return unescape(r[2])
            }
            return null
        },
        // 页面初始化，填入所有数据
        initDatas() {
            this.$axios.post('http://127.0.0.1:8000/user/get_user_information')
                .then(
                    (res) => {
                        res = res.data
                        if (res.code !== 200) {
                            if (res.data.msg === 'cookie out of date') {
                                alert('登录超时，请重新登录')
                                window.location.href = 'http://127.0.0.1:8000/user/login.html'
                            }
                            console.log('failed to initialize')
                            return
                        }
                        this.userAvatar = res.data.information.user_photo
                    }
                )
            this.$axios.get('http://127.0.0.1:8000/commentarea/get_create_comment_area_request')
                .then(
                    (res) => {
                        res = res.data
                        if (res.code !== 200) {
                            console.log('failed to initialize')
                            return
                        }
                        res.data.createRequestList.forEach((element) => {
                            this.$axios.get('http://127.0.0.1:8000/commentarea/get_username?userId=' + element.requestor)
                                .then(
                                    (response) => {
                                        response = response.data
                                        if(response.code !== 200){
                                            console.log('failed to initialize')
                                            return
                                        }
                                        this.createRequestList.push({
                                            requestId: element.id,
                                            requestorId: element.requestor,
                                            requestor: response.data.username,
                                            paperId: element.paper,
                                            paper_title: element.paper_title,
                                        })
                                        this.paperDir = 'http://127.0.0.1:8000/commentarea/showpdf.html?handleClick=0&id=' + this.createRequestList[0].paperId
                                    }
                                )
                        })
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
        // 选中申请事件处理
        handleClick(count) {
            this.paperDir = 'http://127.0.0.1:8000/commentarea/showpdf.html?handleClick=0&id=' + this.createRequestList[count - 1].paperId
        },
        // 通过申请事件处理
        handleAccept(count) {
            this.$axios.get('http://127.0.0.1:8000/commentarea/approve_create_comment_area_request?requestId=' + this.createRequestList[count - 1].requestId)
                .then(
                    (res) => {
                        res = res.data
                        if (res.code === 200) {
                            this.createRequestList.splice(count - 1, 1);
                            this.$message({
                                type: "success",
                                message: "操作成功",
                            })
                        }
                        else{
                            if (res.data.msg === 'cookie out of date') {
                                alert('登录超时，请重新登录')
                                window.location.href = 'http://127.0.0.1:8000/user/login.html'
                            }
                            this.$message({
                                type: "error",
                                message: "操作失败",
                            })
                        }
                    }
                )
        },
        // 拒绝申请事件处理
        handleRefuse(count) {
            this.$axios.get('http://127.0.0.1:8000/commentarea/reject_create_comment_area_request?requestId=' + this.createRequestList[count - 1].requestId)
                .then(
                    (res) => {
                        res = res.data
                        if (res.code === 200) {
                            this.createRequestList.splice(count - 1, 1);
                            this.$message({
                                type: "success",
                                message: "操作成功",
                            })
                        }
                        else{
                            if (res.data.msg === 'cookie out of date') {
                                alert('登录超时，请重新登录')
                                window.location.href = 'http://127.0.0.1:8000/user/login.html'
                            }
                            this.$message({
                                type: "error",
                                message: "操作失败",
                            })
                        }
                    }
                )
        },
        confirmAccept(count) {
            this.$confirm('此操作将通过该申请，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.handleAccept(count)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '操作已取消',
                });
            });
        },
        confirmRefuse(count) {
            this.$confirm('此操作将拒绝该申请，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.handleRefuse(count)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '操作已取消',
                });
            });
        },
        quit: function () {
            this.$axios.post('http://127.0.0.1:8000/user/logout')
                .then(
                    (res) => {
                        res = res.data
                        if (res.code !== 200) {
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