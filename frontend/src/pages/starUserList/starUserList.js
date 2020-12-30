/* eslint-disable */
/* maintained by Harris */

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
        starUserInfoList: new Array(),
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
        // 页面初始化，填入所有用户数据
        initDatas() {
            this.$axios.post('http://127.0.0.1:8000/user/get_user_information')
                .then(
                    (res) => {
                        res = res.data
                        console.log(res)
                        if (res.code != 200) {
                            console.log('failed to initialize')
                            return
                        }
                        this.userAvatar = res.data.information.user_photo
                    }
                )
            let data = {
                "id": 1,
            }
            this.$axios.post('http://127.0.0.1:8000/user/get_star_user_list', JSON.stringify(data))
                .then(
                    (res) => {
                        res = res.data
                        if (res.code != 200) {
                            console.log('failed to initialize')
                            return
                        }
                        res = res.data.star_user_list
                        res.star_user_list.forEach((UserId) => {
                            let userdata = {
                                "id": UserId,
                            }
                            this.$axios.post('http://127.0.0.1:8000/user/get_user_information', JSON.stringify(userdata))
                                .then(
                                    (response) => {
                                        response = response.data
                                        if (response.code != 200) {
                                            console.log('failed to initialize')
                                            return
                                        }
                                        response = response.data.information
                                        this.starUserInfoList.push({
                                            name: response.user_name,
                                            email: response.user_email,
                                            userAvatar: response.user_photo,
                                            id: UserId,
                                            //star_number: 100,
                                            //has_star: true,
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

        handleDetail(id){
          window.location.href='http://127.0.0.1:8000/SearchAndResults/UserProfilePage.html?userid='+id
        },
        // 关注用户事件处理
        handleStar(count) {
            let userdata = {
                "id": this.starUserInfoList[count - 1].id,
            }
            if (!this.starUserInfoList[count - 1].has_star) {
                this.$axios.post('http://127.0.0.1:8000/user/add_star_user', JSON.stringify(userdata))
                    .then(
                        (res) => {
                            res = res.data
                            if (res.code === 200) {
                                this.starUserInfoList[count - 1].has_star = true
                                // this.starUserInfoList[count - 1].star_number += 1
                                this.$message({
                                    type: "success",
                                    message: "收藏成功",
                                })
                            }
                            else
                                this.$message({
                                    type: "error",
                                    message: "收藏失败",
                                })
                        }
                    )
            }
            else {
                this.$axios.post('http://127.0.0.1:8000/user/remove_star_user', JSON.stringify(userdata))
                    .then(
                        (res) => {
                            res = res.data
                            if (res.code === 200) {
                                this.starUserInfoList[count - 1].has_star = false
                                // this.starUserInfoList[count - 1].star_number -= 1
                                this.$message({
                                    type: "success",
                                    message: "取消收藏成功",
                                })
                            }
                            else
                                this.$message({
                                    type: "success",
                                    message: "取消收藏失败",
                                })
                        }
                    )
            }
        },
        getStarButtonType(count) {
            if (this.starUserInfoList[count - 1].has_star)
                return "info"
            else
                return "primary"
        },
    }
})
