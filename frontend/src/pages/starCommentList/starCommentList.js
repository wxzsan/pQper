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
        starCommentInfoList: new Array(),
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
        // 页面初始化，填入所有评论数据
        initDatas() {
            this.$axios.get('http://127.0.0.1:8000/commentarea/get_star_long_comment_list')
                .then(
                    (res) => {
                        res = res.data
                        if (res.code != 200) {
                            console.log('failed to initialize')
                            return
                        }
                        res = res.data
                        res.starCommentList.forEach((starCommentId) => {
                            this.$axios.get('http://127.0.0.1:8000/user/get_star_long_comment?starCommentId=' + starCommentId)
                                .then(
                                    (response) => {
                                        if (response.code != 200) {
                                            console.log('failed to initialize')
                                            return
                                        }
                                        response = response.data
                                        this.starCommentInfoList.push({
                                            id: response.star_comment.id,
                                            title: response.star_comment.name,
                                            star_number: response.star_comment.star_number,
                                            has_star: true,
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
                window.location.href = '../SearchAndResults/SearchResultPage.html?searchContent=' + searchContent
            }
        },
        // 收藏评论事件处理
        handleStar(count) {
            if (!this.starCommentInfoList[count - 1].has_star) {
                this.$axios.get('http://127.0.0.1:8000/user/star_comment?starCommentId=' + this.starCommentInfoList[count - 1].id)
                    .then(
                        (res) => {
                            if (res.code === 200) {
                                this.starCommentInfoList[count - 1].has_star = true
                                this.starCommentInfoList[count - 1].star_number += 1
                                this.$message("收藏成功")
                            }
                            else
                                this.$message("收藏失败")
                        }
                    )
            }
            else {
                this.$axios.get('http://127.0.0.1:8000/user/cancel_star_comment?starCommentId=' + this.starCommentInfoList[count - 1].id)
                    .then(
                        (res) => {
                            if (res.code === 200) {
                                this.starCommentInfoList[count - 1].has_star = false
                                this.starCommentInfoList[count - 1].star_number -= 1
                                this.$message("取消收藏成功")
                            }
                            else
                                this.$message("取消收藏失败")
                        }
                    )
            }
        },
        handleOpenStarComment(count) {
            window.location.href = 'starComment.html?id=' + this.starCommentInfoList[count - 1].id
        },
        getStarButtonType(count) {
            if (this.starCommentInfoList[count - 1].has_star)
                return "info"
            else
                return "primary"
        },
    }
})
