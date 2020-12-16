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
        starUserInfoList: new Array(),
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
        // 页面初始化，填入所有用户数据
        initDatas() {
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
                        res = res.data
                        res.starUserList.forEach((UserId) => {
                            let userdata = {
                                "id": UserId,
                            }
                            this.$axios.post('http://127.0.0.1:8000/user/get_user_imformation', JSON.stringify(userdata))
                                .then(
                                    (response) => {
                                        response = response.userdata
                                        if (response.code != 200) {
                                            console.log('failed to initialize')
                                            return
                                        }
                                        response = response.data
                                        this.starUserInfoList.push({
                                            id: response.star_user.id,
                                            title: response.star_user.name,
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
        //! 尚未完成
        handleSearch() {
            if (this.searchInput.length > 0) {
                var searchContent = btoa(encodeURI(this.searchInput))
                window.location.href = 'searchResultPage.html?searchContent=' + searchContent
            }
        },
        // 关注用户事件处理
        // handleStar(count) {
        //     if (!this.starUserInfoList[count - 1].has_star) {
        //         this.$axios.get('http://127.0.0.1:8000/user/star_user?starUserId=' + this.starUserInfoList[count - 1].id)
        //             .then(
        //                 (res) => {
        //                     if (res.code === 200) {
        //                         this.starUserInfoList[count - 1].has_star = true
        //                         this.starUserInfoList[count - 1].star_number += 1
        //                         this.$message("收藏成功")
        //                     }
        //                     else
        //                         this.$message("收藏失败")
        //                 }
        //             )
        //     }
        //     else {
        //         this.$axios.get('http://127.0.0.1:8000/user/cancel_star_user?starUserId=' + this.starUserInfoList[count - 1].id)
        //             .then(
        //                 (res) => {
        //                     if (res.code === 200) {
        //                         this.starUserInfoList[count - 1].has_star = false
        //                         this.starUserInfoList[count - 1].star_number -= 1
        //                         this.$message("取消收藏成功")
        //                     }
        //                     else
        //                         this.$message("取消收藏失败")
        //                 }
        //             )
        //     }
        // },
        // getStarButtonType(count) {
        //     if (this.starUserInfoList[count - 1].has_star)
        //         return "info"
        //     else
        //         return "primary"
        // },
    }
})
