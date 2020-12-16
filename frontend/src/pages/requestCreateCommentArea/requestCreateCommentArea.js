/* eslint-disable */

import Vue from 'vue'
// import App from './App'
// import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

Vue.use(ElementUI)
Vue.prototype.$axios = axios

Vue.prototype.$axios = axios
var vm = new Vue({
    el: '#app',
    data: {
        paperTitle: "",
        paperStr: "",
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
        // 搜索框事件处理
        //! 尚未完成
        handleSearch() {
            if (this.searchInput.length > 0) {
                var searchContent = btoa(encodeURI(this.searchInput))
                window.location.href = 'searchResultPage.html?searchContent=' + searchContent
            }
        },
        handleChange(file, fileList) {
            if (fileList.length > 0) {
                this.fileList = [fileList[fileList.length - 1]]
            }
            var reader = new FileReader()
            reader.readAsDataURL(fileList[0].raw)
            reader.onload = (e) => {
                this.paperStr = reader.result
            }
        },
        handleUpload(file) {
            if (this.paperTitle.length > 0 && this.paperStr.length > 0) {
                let data = {
                    "paperPdfInStr": this.paperStr,
                    "paperTitle": this.paperTitle,
                }
                let config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                }
                this.$axios.post('http://127.0.0.1:8000/commentarea/request_create_comment_area', JSON.stringify(data), config)
                    .then(
                        (res) => {
                            res = res.data
                            if (res.code === 200)
                                this.$message("上传成功，等待审核")
                            else
                                this.$message("上传失败")
                        }
                    )
            }
        }
    }
})