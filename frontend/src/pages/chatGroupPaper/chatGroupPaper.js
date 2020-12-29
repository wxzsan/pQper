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
        selectedTab: "first",
        searchInput: "",
        annotationInput: "",
        clickX: 0,
        clickY: 0,
        clickPage: 0,
        isClicked: false,
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
        // 页面初始化，填入所有评论数据
        initDatas() {
            this.paperId = parseInt(this.getParams("id"))
            this.paperDir = 'http://127.0.0.1:8000/chatgroup/showpdf.html?id=' + this.paperId
            this.isClicked = false
            window.addEventListener('message', (msg) => {
                this.clickX = msg.data.data[0]
                this.clickY = msg.data.data[1]
                this.clickPage = msg.data.data[2]
                this.isClicked = true
            })
        },
        // 搜索框事件处理
        handleSearch() {
            if (this.searchInput.length > 0) {
                var searchContent = btoa(encodeURI(this.searchInput))
                window.location.href = 'http://127.0.0.1:8000/SearchAndResults/SearchResultPage.html?searchContent=' + searchContent
            }
        },
        handlePostAnnotation() {
            if (this.isClicked && this.annotationInput.length > 0) {
                let data = {
                    "x": this.clickX,
                    "y": this.clickY,
                    "pageNum": this.clickPage,
                    "paperId": this.paperId,
                    "content": this.annotationInput,
                }
                let config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                }
                this.$axios.post('http://127.0.0.1:8000/chatgroup/add_annotation', JSON.stringify(data), config)
                    .then(
                        (res) => {
                            res = res.data
                            if (res.code === 200) {
                                this.annotationInput = ""
                                this.$message({
                                    type: "success",
                                    message: "发送成功",
                                })
                            }
                            else {
                                this.$message({
                                    type: "error",
                                    message: "发送失败",
                                })
                            }
                        }
                    )
            }
        },
    }
})