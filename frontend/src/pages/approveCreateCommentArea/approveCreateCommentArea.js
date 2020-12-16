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
        // 页面初始化，填入所有数据
        initDatas() {
            this.$axios.get('http://127.0.0.1:8000/commentarea/get_create_comment_area_request')
                .then(
                    (res) => {
                        res = res.data
                        if (res.code != 200) {
                            console.log('failed to initialize')
                            return
                        }
                        res.data.createRequestList.forEach((element) => {
                            this.$axios.get('http://127.0.0.1:8000/commentarea/get_paper?paperId=' + element.paper)
                                .then(
                                    (response) => {
                                        console.log(response)
                                        response = response.data
                                        if (response.code != 200) {
                                            console.log('failed to initialize')
                                            return
                                        }
                                        response = response.data
                                        this.createRequestList.push({
                                            requestId: element.id,
                                            title: response.paper.title,
                                            path: response.paper.path,
                                        })
                                    }
                                )
                        })
                    }
                )
            if (this.createRequestList.length > 0)
                this.paperDir = this.createRequestList[0].path
        },
        // 搜索框事件处理
        //! 尚未完成
        handleSearch() {
            if (this.searchInput.length > 0) {
                var searchContent = btoa(encodeURI(this.searchInput))
                window.location.href = 'searchResultPage.html?searchContent=' + searchContent
            }
        },
        // 选中申请事件处理
        handleClick(count) {
            this.paperDir = this.createRequestList[count - 1].path
        },
        // 通过申请事件处理
        handleAccept(count) {
            this.$axios.get('http://127.0.0.1:8000/commentarea/approve_create_comment_area_request?requestId=' + this.createRequestList[count - 1].requestId)
                .then(
                    (res) => {
                        res = res.data
                        if (res.code === 200) {
                            this.createRequestList.splice(count - 1, 1);
                            this.$message("操作成功")
                        }
                        else
                            this.$message("操作失败")
                    }
                )
        },
        // 拒绝申请事件处理
        handleRefuse(count) {
            //! 待修改，应当有拒绝批准的选项
            this.$axios.get('http://127.0.0.1:8000/commentarea/approve_create_comment_area_request?requestId=' + this.createRequestList[count - 1].requestId)
                .then(
                    (res) => {
                        res = res.data
                        if (res.code === 200) {
                            this.createRequestList.splice(count - 1, 1);
                            this.$message("操作成功")
                        }
                        else
                            this.$message("操作失败")
                    }
                )
        },
    }
})