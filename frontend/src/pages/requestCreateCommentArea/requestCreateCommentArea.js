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
    created: function() {
        this.initDatas()
    },
    data: {
        paperTitle: "",
        searchInput: "",
        fileList: new Array(),
        userAvatar: "",
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
        // 页面初始化
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
                        this.userAvatar = res.data.information.user_photo
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
        handleChange(file, fileList) {
            if (fileList.length > 0)
                this.fileList = [fileList[fileList.length - 1]]
        },
        uploadHttpRequest(param) {
            if (this.paperTitle.length > 0 && this.fileList.length > 0) {
                let formData = new FormData()
                formData.append('paper', param.file)
                formData.append('title', this.paperTitle)
                this.$axios.post('http://127.0.0.1:8000/commentarea/request_create_comment_area', formData)
                    .then(
                        (res) => {
                            res = res.data
                            if (res.code === 200) {
                                this.$message({
                                    type: "success",
                                    message: "上传成功，等待审核",
                                })
                            }
                            else {
                                if (res.data.msg === 'cookie out of date') {
                                    alert('登录超时，请重新登录')
                                    window.location.href = 'http://127.0.0.1:8000/user/login.html'
                                }
                                this.$message({
                                    type: "error",
                                    message: "上传失败",
                                })
                            }
                        }
                    )
            }
        },
        handleUpload() {
            if (this.paperTitle.length > 0 && this.fileList.length > 0) {
                this.$refs.upload.submit()
                this.$refs.upload.clearFiles()
                this.paperTitle = ""
            }
        }
    }
})