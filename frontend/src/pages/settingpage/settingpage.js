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
      message: ''
    }
  },
  methods: {
    check: function () {
      if (this.password === this.repeat_password) {
        this.message = '密码不一致'
      } else {
        this.message = ''
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
      this.$axios.post('http://127.0.0.1:8000/user/change_user_information', JSON.stringify(data), config)
        .then((res) => {
          res = res.data
          if (res.data.msg === 'cookie out of date') {
            alert('登录超时')
            window.location.href = 'http://127.0.0.1:8000/user/login.html'
          } else if (res.code === 200) {
            if (this.password !== '')
              window.location.href = 'http://127.0.0.1:8000/user/login.html'
            else
              window.location.href = 'http://127.0.0.1:8000/user/myprofile.html'
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
    }
  }
})
vm.get_user_information()
