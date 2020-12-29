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
        chatGroupInfoList: new Array(),
        chatGroupPaperList: new Array(),
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
            let data = {
                "id": 1,
            }
            this.$axios.post('http://127.0.0.1:8000/chatgroup/getMyChatGroupList', JSON.stringify(data))
                .then(
                    (res) => {
                        res = res.data
                        if (res.code != 200) {
                            console.log('failed to initialize')
                            return
                        }
                        res = res.data
                        res.MyChatGroupList.forEach((chatGroupId) => {
                            let paperdata = {
                                "chatGroupId": chatGroupId.id,
                            }
                            this.$axios.post('http://127.0.0.1:8000/chatgroup/getChatGroupPapers', JSON.stringify(paperdata))
                                .then(
                                    (response) => {
                                        response = response.data
                                        if (response.code != 200) {
                                            console.log('failed to initialize')
                                            return
                                        }
                                        response = response.data
                                        this.chatGroupPaperList.length = 0
                                        response.paperList.forEach((paperId) => {
                                            this.chatGroupPaperList.push({
                                                id: paperId.id,
                                                title: paperId.title,
                                                path: paperId.path,
                                            })
                                        })
                                        this.chatGroupInfoList.push({
                                            id: chatGroupId.id,
                                            title: chatGroupId.name,
                                            paperList: this.chatGroupPaperList,
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
        // 跳转待修改
        handleJump(count){
            window.location.href = 'http://127.0.0.1:8000/chatgroup/singleChatGroup.html?id=' + this.chatGroupInfoList[count - 1].paperList.id
        },
    }
})
