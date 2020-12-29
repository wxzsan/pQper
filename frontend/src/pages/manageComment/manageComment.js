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
        searchInput: "",
        longCommentList: new Array(),
        longComment: {
            id: 1,
            poster: "",
            title: "",
            post_time: "",
            content: "",
            star_number: 0,
            has_star: true,
        },
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
            this.$axios.get('http://127.0.0.1:8000/commentarea/get_star_long_comment_list')
                .then(
                    (res) => {
                        res = res.data
                        if (res.code != 200) {
                            console.log('failed to initialize')
                            return
                        }
                        res = res.data
                        res.longCommentList.forEach((longCommentId) => {
                            this.$axios.get('http://127.0.0.1:8000/commentarea/get_long_comment?inCommentArea=0&longCommentId=' + longCommentId.id)
                                .then(
                                    (response) => {
                                        response = response.data
                                        if (response.code != 200) {
                                            console.log('failed to initialize')
                                            return
                                        }
                                        response = response.data
                                        this.$axios.get('http://127.0.0.1:8000/commentarea/get_username?userId=' + response.comment.poster)
                                            .then(
                                                (resp) => {
                                                    resp = resp.data
                                                    if (resp.code != 200) {
                                                        console.log('failed to get name')
                                                        return
                                                    }
                                                    this.longCommentList.push({
                                                        id: response.comment.id,
                                                        poster: resp.data.username,
                                                        post_time: response.comment.post_time.slice(0, 10),
                                                        title: response.comment.title,
                                                        content: response.comment.content,
                                                        star_number: response.comment.star_number,
                                                        has_star: response.comment.star,
                                                        is_owner: response.comment.create,
                                                    })
                                                    this.longComment = this.longCommentList[0]
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
        // 选中长评处理
        handleClick(count) {
            this.longComment = this.longCommentList[count - 1]
        },
        // 收藏/取消收藏长评处理
        handleStar(count) {
            if (!this.longCommentList[count - 1].has_star) {
                this.$axios.get('http://127.0.0.1:8000/commentarea/star_comment?longCommentId=' + this.longCommentList[count - 1].id)
                    .then(
                        (res) => {
                            res = res.data
                            if (res.code === 200) {
                                this.longCommentList[count - 1].has_star = true
                                this.longCommentList[count - 1].star_number += 1
                                this.$message("收藏成功")
                            }
                            else
                                this.$message("收藏失败")
                        }
                    )
            }
            else {
                this.$axios.get('http://127.0.0.1:8000/commentarea/cancel_star_comment?longCommentId=' + this.longCommentList[count - 1].id)
                    .then(
                        (res) => {
                            res = res.data
                            if (res.code === 200) {
                                this.longCommentList[count - 1].has_star = false
                                this.longCommentList[count - 1].star_number -= 1
                                this.$message("取消收藏成功")
                            }
                            else
                                this.$message("取消收藏失败")
                        }
                    )
            }
        },
        handleDelete(count) {
            if (this.longCommentList[count - 1].is_owner) {
                this.$axios.get('http://127.0.0.1:8000/commentarea/delete_long_comment?longCommentId=' + this.longCommentList[count - 1].id)
                    .then(
                        (res) => {
                            res = res.data
                            if (res.code === 200) {
                                this.longCommentList.splice(count - 1, 1);
                                this.$message("删除成功")
                            }
                            else
                                this.$message("删除失败")
                        }
                    )
            }
        },
        getStarButtonType(count) {
            if (this.longCommentList[count - 1].has_star)
                return "info"
            else
                return "primary"
        },
        getDeleteButtonType(count) {
            if (this.longCommentList[count - 1].is_owner)
                return "warning"
            else
                return "info"
        },
    }
})