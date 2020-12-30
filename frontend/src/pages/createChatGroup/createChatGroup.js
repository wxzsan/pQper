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
      searchInput: '',
      user_data: [],
      group_name: '',
      multiple_selection: []
    }
  },
  methods: {
    get_user_information: function () {
      var that = this
      var promise = new Promise((resolve, reject) => {
        that.$axios.post('http://127.0.0.1:8000/user/get_user_information')
          .then((res) => {
            res = res.data
            if (res.data.msg === 'cookie out of date') {
              alert('登录超时')
              window.location.href = 'http://127.0.0.1:8000/user/login.html'
            } else if (res.code === 200) {
              that.name = res.data.information.user_name
              that.email = res.data.information.user_email
              that.id = res.data.information.id
              if (res.data.information.user_photo !== '')
                that.photo = res.data.information.user_photo
              else
                that.photo = ''
            } else {
              alert('用户不存在')
            }
            resolve(that.id)
          })
      })
      return promise
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
    handleSearch() {
      if (this.searchInput.length > 0) {
        var searchContent = btoa(encodeURI(this.searchInput))
        window.location.href = 'http://127.0.0.1:8000/SearchAndResults/SearchResultPage.html?searchContent=' + searchContent
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
      this.$axios.post('http://127.0.0.1:8000/chatgroup/getBothStarList', JSON.stringify(data), config)
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
      this.$axios.post('http://127.0.0.1:8000/chatgroup/createChatGroup', JSON.stringify(data), config)
        .then((res) => {
          res = res.data
          if (res.data.msg === 'cookie out of date') {
            alert('登录超时')
            window.location.href = 'http://127.0.0.1:8000/user/login.html'
          } else if (res.code === 200) {
            window.location.href = 'http://127.0.0.1:8000/chatgroup/singleGroupPage.html?id=' + res.data.groupId
          } else {
            alert('用户不存在')
          }
        })
    },
    init: function () {
      this.get_user_information()
        .then((id) => {
          this.get_both_star_list()
        })
    }
  }
})
vm.init()
