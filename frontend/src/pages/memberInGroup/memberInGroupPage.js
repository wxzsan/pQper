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
    created: function(){
        this.initDatas()
    },
    data: {
        myName: "",
        myAvatar: "",
        myId: 0,

        chatGroupId: 0,
        chatGroupName: "",

        groupMemberList: [],

        searchInput: "",
    },
    methods: {
        // 正则表达式匹配，从上个界面的url得到searchInput
        getParams(key){
            var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)")
            var r = window.location.search.substr(1).match(reg)
            if (r != null) {
                return unescape(r[2])
            }
            return null
        },
        // 页面初始化，填入数据
        initDatas(){
            //获取chatGroupId
            this.chatGroupId = Number(this.getParams("id"))
            this.$axios.post('http://127.0.0.1:8000/user/get_user_information')
                .then(
                    (res) => {
                        res = res.data
                        if(res.code != 200){
                            console.log('failed to initialize')
                            return
                        }
                        this.myId = res.data.information.id
                        this.myName = res.data.information.user_name
                        this.myAvatar = res.data.information.user_photo
                    }
                )


            //获取完chatGroupId后开始获取chatGroupName和成员列表
            let data = {
              "chatGroupId": this.chatGroupId,
            }
            /*let config = {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
              },
            }*/
            this.$axios.get('http://127.0.0.1:8000/chatgroup/getChatGroupName', {params: data})
                .then(
                    (res) => {
                        res = res.data
                        if (res.code != 200) {
                            console.log('failed to initialize')
                            return
                        }
                        this.chatGroupName = res.data.name
                    }
                )

            this.$axios.get('http://127.0.0.1:8000/chatgroup/getChatGroupMembers', {params: data})
              .then(
                (res) => {
                  res = res.data
                  if (res.code != 200) {
                      console.log('failed to initialize')
                      return
                  }
                  res = res.data
                  res.userlist.forEach(
                    (key)=>{
                      this.groupMemberList.push(
                        {
                          userId: key.id,
                          userName: key.user_name,
                          userAvatar: "/media/"+key.user_photo,
                        }
                      )
                    }
                  )
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

        //页面跳转处理
        handleBack(){
          window.location.href = "http://127.0.0.1:8000/chatgroup/singleGroupPage.html?id="+this.chatGroupId
        },

        handleUserDetail(id){
          window.location.href = "http://127.0.0.1:8000/SearchAndResults/UserProfilePage.html?userid="+id
        },
    }
})