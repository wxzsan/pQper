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
  el: '#main_div',
  data: function () {
    return {
      email: '',
      password: '',
      message: '请输入以上信息'
    }
  },
  methods: {
    try_login: function () {
      this.check()
      if (this.message !== '') {
        return
      }
      let data = {
        "email": this.email,
        "password": this.password
      }
      let config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
      }
      this.$axios.post('http://39.105.19.68:8000/user/login', JSON.stringify(data), config)
        .then(
          (res) => {
            res = res.data

            if (res.code === 200) {
              window.location.href = 'http://39.105.19.68:8000/home.html'
            } else {
              alert("登录失败")
            }
          }
        )
    },
    to_register: function () {
      window.location.href = "http://39.105.19.68:8000/user/register.html";
    },
    check_email: function () {
      if (this.email.length === 0 || this.email.indexOf("@") === -1) {
        return false
      }
      return true
    },
    check_password: function () {
      if (this.password.length <= 5) {
        return false
      }
      return true
    },
    check: function () {
      if (!this.check_email()) {
        this.message = '邮箱格式错误'
        return
      }
      if (!this.check_password()) {
        this.message = '密码格式错误'
        return
      }
      this.message = ''
    }
  }
})
