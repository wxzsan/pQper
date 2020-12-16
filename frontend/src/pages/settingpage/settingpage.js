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
      password: '',
      repeat_password: '',
      message: '',
      search_content: ''
    }
  },
  methods: {
    check: function () {
      if (this.password === this.repeat_password) {
        this.message = ''
      } else {
        this.message = '密码不一致'
      }
    },
    change: function () {
      this.check()
      if (this.message !== '')
        return
      let data = {
        "name": this.name,
        "password": this.password
      }
      let config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
      }
      this.$axios.post('http://39.105.19.68:8000/user/change_user_information', JSON.stringify(data), config)
        .then((res) => {
          res = res.data
          if (res.data.msg === 'cookie out of date') {
            alert('登录超时')
            window.location.href = 'http://39.105.19.68:8000/user/login.html'
          } else if (res.code === 200) {
            if (this.password !== '')
              window.location.href = 'http://39.105.19.68:8000/user/login.html'
            else
              window.location.href = 'http://39.105.19.68:8000/user/myprofile.html'
          } else {
            alert('用户不存在')
          }
        })
    },
    handle_avatar_success: function (res, file) {
      this.photo = URL.createObjectURL(file.raw)
    },
    before_avatar_upload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLt2M) {
        alert('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    to_home_page: function () {
      window.location.href = 'http://39.105.19.68:8000/home.html'
    },
    to_my_profile_page: function () {
      window.location.href = 'http://39.105.19.68:8000/user/myprofile.html'
    },
    quit: function () {
      this.$axios.post('http://39.105.19.68:8000/user/logout')
        .then((res) => {
          window.location.href = 'http://39.105.19.68:8000/user/login.html'
        })
    },
    handle_command: function (command) {
      if (command === 'a') this.to_home_page()
      else if (command === 'b') this.to_my_profile_page()
      else if (command === 'c') this.quit()
    },
    get_user_information: function () {
      this.$axios.post('http://39.105.19.68:8000/user/get_user_information')
        .then((res) => {
          res = res.data
          if (res.data.msg === 'cookie out of date') {
            alert('登录超时')
            window.location.href = 'http://39.105.19.68:8000/user/login.html'
          } else if (res.code === 200) {
            this.name = res.data.information.user_name
            this.email = res.data.information.user_email
            if (res.data.information.user_photo !== '')
              this.photo = res.data.information.user_photo
            else
              this.photo = ''
          } else {
            alert('用户不存在')
          }
        })
    },
    search: function () {
      window.location.href = 'http://39.105.19.68:8000/SearchAndResults/searchResultPage.html?searchContent=' + this.search_content
    }
  }
})
vm.get_user_information()
