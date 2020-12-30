/* eslint-disable */

import Vue from 'vue'
// import App from './App'
// import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import showdown from 'showdown'

Vue.use(ElementUI)
Vue.prototype.$axios = axios

var vm = new Vue({
    el: '#app',
    created: function () {
        this.initDatas()
    },
    data: {
        shortCommentList: new Array(),
        longComment: {
            id: 1,
            poster: "",
            title: "",
            post_time: "",
            content: "",
            star_number: 0,
            has_star: false,
        },
        selectedTab: "first",
        searchInput: "",
        shortCommentInput: "",
        shortCommentButtonType: "info",
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
            this.longComment.id = parseInt(this.getParams("id"))
            this.$axios.get('http://127.0.0.1:8000/commentarea/get_long_comment?inCommentArea=0&longCommentId=' + this.longComment.id)
                .then(
                    (res) => {
                        res = res.data
                        if (res.code != 200) {
                            console.log('failed to initialize')
                            return
                        }
                        res = res.data
                        this.$axios.get('http://127.0.0.1:8000/commentarea/get_username?userId=' + res.comment.poster)
                            .then(
                                (resp) => {
                                    resp = resp.data
                                    if (resp.code != 200) {
                                        console.log('failed to initialize')
                                        return
                                    }
                                    this.longComment.poster = resp.data.username
                                    this.longComment.post_time = res.comment.post_time.slice(0, 10)
                                    this.longComment.title = res.comment.title
                                    this.longComment.star_number = res.comment.star_number
                                    this.longComment.content = res.comment.content
                                    this.longComment.has_star = res.comment.star
                                    this.displayMarkdown()
                                }
                            )
                        res.comment.short_comment_list.forEach((shortCommentId) => {
                            this.$axios.get('http://127.0.0.1:8000/commentarea/get_short_comment?shortCommentId=' + shortCommentId)
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
                                                        console.log('failed to initialize')
                                                        return
                                                    }
                                                    this.shortCommentList.push({
                                                        id: response.comment.id,
                                                        poster: resp.data.username,
                                                        post_time: response.comment.post_time.slice(0, 10),
                                                        content: response.comment.content,
                                                        rose_number: response.comment.rose_number,
                                                        egg_number: response.comment.egg_number,
                                                        has_rose: response.comment.rose,
                                                        has_egg: response.comment.egg,
                                                    })
                                                }
                                            )
                                    }
                                )
                        })
                    }
                )
        },
        // 设置显示markdown
        displayMarkdown() {
            let converter = new showdown.Converter();
            let html = converter.makeHtml(this.longComment.content)
            document.getElementById('comment_md').innerHTML = html
        },
        // 搜索框事件处理
        handleSearch() {
            if (this.searchInput.length > 0) {
                var searchContent = btoa(encodeURI(this.searchInput))
                window.location.href = 'http://127.0.0.1:8000/SearchAndResults/SearchResultPage.html?searchContent=' + searchContent
            }
        },
        handleRose(count) {
            if (!this.shortCommentList[count - 1].has_egg) {
                if (!this.shortCommentList[count - 1].has_rose) {
                    this.$axios.get('http://127.0.0.1:8000/commentarea/rose_comment?shortCommentId=' + this.shortCommentList[count - 1].id)
                        .then(
                            (res) => {
                                res = res.data
                                if (res.code === 200) {
                                    this.shortCommentList[count - 1].has_rose = true
                                    this.shortCommentList[count - 1].rose_number += 1
                                    this.$message({
                                        type: "success",
                                        message: "点赞成功",
                                    })
                                }
                                else {
                                    this.$message({
                                        type: "error",
                                        message: "点赞失败",
                                    })
                                }
                            }
                        )
                }
                else {
                    this.$axios.get('http://127.0.0.1:8000/commentarea/cancel_rose_comment?shortCommentId=' + this.shortCommentList[count - 1].id)
                        .then(
                            (res) => {
                                res = res.data
                                if (res.code === 200) {
                                    this.shortCommentList[count - 1].has_rose = false
                                    this.shortCommentList[count - 1].rose_number -= 1
                                    this.$message({
                                        type: "success",
                                        message: "取消点赞成功",
                                    })
                                }
                                else {
                                    this.$message({
                                        type: "error",
                                        message: "取消点赞失败",
                                    })
                                }
                            }
                        )
                }
            }
        },
        // 点踩短评事件处理
        handleEgg(count) {
            if (!this.shortCommentList[count - 1].has_rose) {
                if (!this.shortCommentList[count - 1].has_egg) {
                    this.$axios.get('http://127.0.0.1:8000/commentarea/egg_comment?shortCommentId=' + this.shortCommentList[count - 1].id)
                        .then(
                            (res) => {
                                res = res.data
                                if (res.code === 200) {
                                    this.shortCommentList[count - 1].has_egg = true
                                    this.shortCommentList[count - 1].egg_number += 1
                                    this.$message({
                                        type: "success",
                                        message: "点踩成功",
                                    })
                                }
                                else {
                                    this.$message({
                                        type: "error",
                                        message: "点踩失败",
                                    })
                                }
                            }
                        )
                }
                else {
                    this.$axios.get('http://127.0.0.1:8000/commentarea/cancel_egg_comment?shortCommentId=' + this.shortCommentList[count - 1].id)
                        .then(
                            (res) => {
                                res = res.data
                                if (res.code === 200) {
                                    this.shortCommentList[count - 1].has_egg = false
                                    this.shortCommentList[count - 1].egg_number -= 1
                                    this.$message({
                                        type: "success",
                                        message: "取消点踩成功",
                                    })
                                }
                                else {
                                    this.$message({
                                        type: "error",
                                        message: "取消点踩失败",
                                    })
                                }
                            }
                        )
                }
            }
        },
        // 收藏长评事件处理
        handleStar() {
            if (!this.longComment.has_star) {
                this.$axios.get('http://127.0.0.1:8000/commentarea/star_comment?longCommentId=' + this.longComment.id)
                    .then(
                        (res) => {
                            res = res.data
                            if (res.code === 200) {
                                this.longComment.has_star = true
                                this.longComment.star_number += 1
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
                this.$axios.get('http://127.0.0.1:8000/commentarea/cancel_star_comment?longCommentId=' + this.longComment.id)
                    .then(
                        (res) => {
                            res = res.data
                            if (res.code === 200) {
                                this.longComment.has_star = false
                                this.longComment.star_number -= 1
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
        // 发送短评事件处理
        handlePostShortComment() {
            if (this.shortCommentInput.length > 0) {
                let data = {
                    "longCommentId": this.longComment.id,
                    "shortComment": this.shortCommentInput,
                }
                let config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                }
                this.$axios.post('http://127.0.0.1:8000/commentarea/post_short_comment_for_long_comment', JSON.stringify(data), config)
                    .then(
                        (res) => {
                            res = res.data
                            if (res.code === 200) {
                                this.$axios.get('http://127.0.0.1:8000/commentarea/get_short_comment?shortCommentId=' + res.id)
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
                                                            console.log('failed to initialize')
                                                            return
                                                        }
                                                        this.shortCommentList.push({
                                                            id: response.comment.id,
                                                            poster: resp.data.username,
                                                            post_time: response.comment.post_time.slice(0, 10),
                                                            content: response.comment.content,
                                                            rose_number: response.comment.rose_number,
                                                            egg_number: response.comment.egg_number,
                                                            has_rose: response.comment.rose,
                                                            has_egg: response.comment.egg,
                                                        })
                                                        this.shortCommentInput = ""
                                                        this.$message({
                                                            type: "success",
                                                            message: "发送成功",
                                                        })
                                                    }
                                                )
                                        }
                                    )
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
        getRoseButtonType(count) {
            if (this.shortCommentList[count - 1].has_rose)
                return "info"
            else
                return "success"
        },
        getEggButtonType(count) {
            if (this.shortCommentList[count - 1].has_egg)
                return "info"
            else
                return "warning"
        },
        getStarButtonType() {
            if (this.longComment.has_star)
                return "info"
            else
                return "primary"
        },
    }
})