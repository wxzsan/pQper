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
        chatGroupId: 0,
        paperTitle: "",
        searchInput: "",
        fileList: new Array()
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
        // 初始化数据
        initDatas() {
            this.chatGroupId = this.getParams('id')
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
                formData.append('chatGroupId', this.chatGroupId)
                this.$axios.post('http://127.0.0.1:8000/chatgroup/upload_paper_to_chatgroup', formData)
                    .then(
                        (res) => {
                            console.log(res)
                            res = res.data
                            if (res.code === 200) {
                                this.$message({
                                    type: "success",
                                    message: "上传成功",
                                })
                            }
                            else {
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