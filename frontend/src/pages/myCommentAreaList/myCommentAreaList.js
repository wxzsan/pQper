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
        commentAreaInfoList: new Array(),
        searchInput: "",
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
        // 页面初始化，填入所有评论数据
        initDatas() {
            this.$axios.get('http://127.0.0.1:8000/commentarea/get_star_comment_area_list')
                .then(
                    (res) => {
                        res = res.data
                        if (res.code != 200) {
                            console.log('failed to initialize')
                            return
                        }
                        res = res.data
                        res.commentAreaList.forEach((commentAreaId) => {
                            this.$axios.get('http://127.0.0.1:8000/commentarea/get_comment_area?commentAreaId=' + commentAreaId.id)
                                .then(
                                    (response) => {
                                        response = response.data
                                        if (response.code != 200) {
                                            console.log('failed to initialize')
                                            return
                                        }
                                        response = response.data
                                        this.commentAreaInfoList.push({
                                            id: response.comment_area.id,
                                            title: response.comment_area.name,
                                            area_star_number: response.comment_area.star_number,
                                            area_has_star: true,
                                        })
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
        handleStarArea(count) {
            if (!this.commentAreaInfoList[count - 1].area_has_star) {
                this.$axios.get('http://127.0.0.1:8000/commentarea/star_comment_area?commentAreaId=' + this.commentAreaInfoList[count - 1].id)
                    .then(
                        (res) => {
                            res = res.data
                            if (res.code === 200) {
                                this.commentAreaInfoList[count - 1].area_has_star = true
                                this.commentAreaInfoList[count - 1].area_star_number += 1
                                this.$message({
                                    type: "success",
                                    message: "收藏成功",
                                })
                            }
                            else {
                                this.$message({
                                    type: "error",
                                    message: "收藏失败",
                                })
                            }
                        }
                    )
            }
            else {
                this.$axios.get('http://127.0.0.1:8000/commentarea/cancel_star_comment_area?commentAreaId=' + this.commentAreaInfoList[count - 1].id)
                    .then(
                        (res) => {
                            res = res.data
                            if (res.code === 200) {
                                this.commentAreaInfoList[count - 1].area_has_star = false
                                this.commentAreaInfoList[count - 1].area_star_number -= 1
                                this.$message({
                                    type: "success",
                                    message: "取消收藏成功",
                                })
                            }
                            else {
                                this.$message({
                                    type: "error",
                                    message: "取消收藏失败",
                                })
                            }
                        }
                    )
            }
        },
        handleJump(count) {
            window.location.href = 'commentArea.html?id=' + this.commentAreaInfoList[count - 1].id
        },
        getStarAreaButtonType(count) {
            if (this.commentAreaInfoList[count - 1].area_has_star)
                return "info"
            else
                return "primary"
        },
    }
})