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
        area_star_number: 0,
        area_has_star: false,
        commentAreaId: 0,
        selectedTab: "first",
        paperInfo: {
            title: "",
            authors: "",
            field: "",
        },
        shortCommentList: new Array(),
        longCommentList: new Array(),
        searchInput: "",
        shortCommentInput: "",
        longCommentInput: {
            title: "",
            content: "",
        },
        shortCommentButtonType: "info",
        longCommentButtonType: "info",
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
            this.commentAreaId = parseInt(this.getParams("id"))
            this.$axios.get('http://127.0.0.1:8000/commentarea/get_comment_area?commentAreaId=' + this.commentAreaId)
                .then(
                    (res) => {
                        res = res.data
                        if (res.code != 200) {
                            console.log('failed to initialize')
                            return
                        }
                        res = res.data
                        this.paperInfo.title = res.comment_area.name
                        this.area_star_number = res.comment_area.star_number
                        this.area_has_star = res.comment_area.star
                        this.paperDir = 'http://127.0.0.1:8000/commentarea/get_paper?paperId=' + res.comment_area.paper
                        res.comment_area.short_comment_list.forEach((shortCommentId) => {
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
                        res.comment_area.long_comment_list.forEach((longCommentId) => {
                            this.$axios.get('http://127.0.0.1:8000/commentarea/get_long_comment?inCommentArea=1&longCommentId=' + longCommentId)
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
                                                    this.longCommentList.push({
                                                        id: response.comment.id,
                                                        poster: resp.data.username,
                                                        post_time: response.comment.post_time.slice(0, 10),
                                                        title: response.comment.title,
                                                        content: response.comment.content,
                                                        star_number: response.comment.star_number,
                                                        has_star: response.comment.star,
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
        // 点赞短评事件处理
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
                                    this.$message("点赞成功")
                                }
                                else
                                    this.$message("点赞失败")
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
                                    this.$message("取消点赞成功")
                                }
                                else
                                    this.$message("取消点赞失败")
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
                                    this.$message("点踩成功")
                                }
                                else
                                    this.$message("点踩失败")
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
                                    this.$message("取消点踩成功")
                                }
                                else
                                    this.$message("取消点踩失败")
                            }
                        )
                }
            }
        },
        // 收藏长评事件处理
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
        // 发送短评事件处理
        handlePostShortComment() {
            if (this.shortCommentInput.length > 0) {
                let data = {
                    "commentAreaId": this.commentAreaId,
                    "content": this.shortCommentInput,
                }
                let config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                }
                this.$axios.post('http://127.0.0.1:8000/commentarea/post_short_comment', JSON.stringify(data), config)
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
                                                    this.$message("发送成功")
                                                }
                                            )
                                    }
                                )
                            }
                            else
                                this.$message("发送失败")
                        }
                    )
            }
        },
        // 发送长评事件处理
        handlePostLongComment() {
            if (this.longCommentInput.title.length > 0 && this.longCommentInput.content.length > 0) {
                let data = {
                    "commentAreaId": this.commentAreaId,
                    "content": this.longCommentInput.content,
                    "title": this.longCommentInput.title,
                }
                let config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                }
                this.$axios.post('http://127.0.0.1:8000/commentarea/post_long_comment', JSON.stringify(data), config)
                    .then(
                        (res) => {
                            res = res.data
                            if (res.code === 200) {
                                this.$axios.get('http://127.0.0.1:8000/commentarea/get_long_comment?inCommentArea=1&longCommentId=' + res.id)
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
                                                    this.longCommentList.push({
                                                        id: response.comment.id,
                                                        poster: resp.data.username,
                                                        post_time: response.comment.post_time.slice(0, 10),
                                                        title: response.comment.title,
                                                        content: response.comment.content,
                                                        star_number: response.comment.star_number,
                                                        has_star: response.comment.star,
                                                    })
                                                    this.longCommentInput.title = ""
                                                    this.longCommentInput.content = ""
                                                    this.$message("发送成功")
                                                }
                                            )
                                    }
                                )
                            }
                            else
                                this.$message("发送失败")
                        }
                    )
            }
        },
        handleStarArea() {
            if (!this.area_has_star) {
                this.$axios.get('http://127.0.0.1:8000/commentarea/star_comment_area?commentAreaId=' + this.commentAreaId)
                    .then(
                        (res) => {
                            res = res.data
                            if (res.code === 200) {
                                this.area_has_star = true
                                this.area_star_number += 1
                                this.$message("收藏成功")
                            }
                            else
                                this.$message("收藏失败")
                        }
                    )
            }
            else {
                //！！！需要修改，等待API
                this.$axios.get('http://127.0.0.1:8000/commentarea/star_comment_area?commentAreaId=' + this.commentAreaId)
                    .then(
                        (res) => {
                            res = res.data
                            if (res.code === 200) {
                                this.area_has_star = false
                                this.area_star_number -= 1
                                this.$message("取消收藏成功")
                            }
                            else
                                this.$message("取消收藏失败")
                        }
                    )
            }
        },
        handleOpenLongComment(count) {
            window.location.href = 'longComment.html?id=' + this.longCommentList[count - 1].id
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
        getStarButtonType(count) {
            if (this.longCommentList[count - 1].has_star)
                return "info"
            else
                return "primary"
        },
        getStarAreaButtonType() {
            if (this.area_has_star)
                return "info"
            else
                return "primary"
        },
    }
})