/* eslint-disable */

import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

Vue.use(ElementUI)
Vue.prototype.$axios = axios

var vm = new Vue({
  el: '#app',
  data: function () {
    return {
      email: '',
      name: '',
      photo: '',
      id: '',
      search_content: '',
      user_data: [{
        userName: 'fuckpps',
        userAvatar: '1.png',
        userId: 1
      }],
      group_name: '',
      multiple_selection: []
    }
  },
  methods: {
    get_user_information: function () {
      this.$axios.post('http://127.0.0.1:8000/user/get_user_information')
        .then((res) => {
          res = res.data
          if (res.data.msg === 'cookie out of date') {
            alert('登录超时')
            window.location.href = 'http://127.0.0.1:8000/user/login.html'
          } else if (res.code === 200) {
            this.name = res.data.information.user_name
            this.email = res.data.information.user_email
            this.id = res.data.information.user_id
            if (res.data.information.user_photo !== '')
              this.photo = res.data.information.user_photo
            else
              this.photo = ''
          } else {
            alert('用户不存在')
          }
        })
    },
    to_setting_page: function () {
      window.location.href = 'http://127.0.0.1:8000/user/settingpage.html'
    },
    to_home_page: function () {
      window.location.href = "http://127.0.0.1:8000/SearchAndResults/HomePage.html"
    },
    to_my_profile_page: function () {
      window.location.href = 'http://127.0.0.1:8000/user/myprofile.html'
    },
    quit: function () {
      this.$axios.post('http://127.0.0.1:8000/user/logout')
        .then((res) => {
          window.location.href = 'http://127.0.0.1:8000/user/login.html'
        })
    },
    handle_command: function (command) {
      if (command === 'a') this.to_home_page()
      else if (command === 'b') this.to_my_profile_page()
      else if (command === 'c') this.quit()
    },
    search: function () {
      if (this.search_content.length > 0) {
        var searchContent = btoa(encodeURI(this.search_content))
        window.location.href = 'searchResultPage.html?searchContent=' + searchContent
      }
    },
    get_both_star_list: function () {
      let data = {
        "userId": this.id
      }
      let config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
      }
      this.$axios.post('http://127.0.0.1:8000/get_both_star_list', JSON.stringify(data), config)
        .then((res) => {
          res = res.data
          if (res.data.msg === 'cookie out of date') {
            alert('登录超时')
            window.location.href = 'http://127.0.0.1:8000/user/login.html'
          } else if (res.code === 200) {
            this.user_data = res.data.userList
          } else {
            alert('用户不存在')
          }
        })
    },
    handle_selection_change: function (val) {
      this.multiple_selection = val
    },
    create_chat_group: function () {
      var userList = []
      var i
      for (i in this.multiple_selection) {
        userList.push(this.multiple_selection[i].userId)
      }
      let data = {
        "groupName": this.group_name,
        "userList": userList
      }
      let config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
      }
      this.$axios.post('http://127.0.0.1:8000/create_chat_group', JSON.stringify(data), config)
        .then((res) => {
          res = res.data
          if (res.data.msg === 'cookie out of date') {
            alert('登录超时')
            window.location.href = 'http://127.0.0.1:8000/user/login.html'
          } else if (res.code === 200) {
            window.location.href = 'http://127.0.0.1:8000/chatGroup/ChatGroupPage.html?GroupId=' + res.data.groupId
          } else {
            alert('用户不存在')
          }
        })
    }
  }
})
vm.get_user_information()
vm.get_both_star_list()
