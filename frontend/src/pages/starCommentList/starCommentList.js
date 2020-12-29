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
                        res.longCommentList.forEach((starCommentId) => {
                            this.$axios.get('http://127.0.0.1:8000/commentarea/get_long_comment?inCommentArea=1&longCommentId=' + starCommentId.id)
                                .then(
                                    (response) => {
                                        response = response.data
                                        if (response.code != 200) {
                                            console.log('failed to initialize')
                                            return
                                        }
                                        response = response.data
                                        this.$axios.get('http://127.0.0.1:8000/commentarea/get_username?userId=' + res.comment.poster)
                                            .then(
                                                (resp) => {
                                                    resp = resp.data
                                                    if (resp.code != 200) {
                                                        console.log('failed to initialize')
                                                        return
                                                    }
                                                    this.starCommentInfoList.push({
                                                        id: res.longCommentList.id,
                                                        title: response.comment.title,
                                                        poster: resp.data.username,
                                                        post_time: response.comment.post_time.slice(0, 10),
                                                        star_number: response.comment.star_number,
                                                        content: response.comment.content,
                                                        has_star: true,
                                                    })
                                                }
                                            )
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
        // 收藏评论事件处理
        handleStar(count) {
            if (!this.starCommentInfoList[count - 1].has_star) {
                this.$axios.get('http://127.0.0.1:8000/commentarea/star_comment?longCommentId=' + this.starCommentInfoList[count - 1].id)
                    .then(
                        (res) => {
                            res = res.data
                            if (res.code === 200) {
                                this.starCommentInfoList[count - 1].has_star = true
                                this.starCommentInfoList[count - 1].star_number += 1
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
                this.$axios.get('http://127.0.0.1:8000/commentarea/cancel_star_comment?longCommentId=' + this.starCommentInfoList[count - 1].id)
                    .then(
                        (res) => {
                            res = res.data
                            if (res.code === 200) {
                                this.starCommentInfoList[count - 1].has_star = false
                                this.starCommentInfoList[count - 1].star_number -= 1
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
        handleOpenStarComment(count) {
            window.location.href = 'longComment.html?id=' + this.starCommentInfoList[count - 1].id
        },
        getStarButtonType(count) {
            if (this.starCommentInfoList[count - 1].has_star)
                return "info"
            else
                return "primary"
        },
    }
})
