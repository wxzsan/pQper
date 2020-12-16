/* eslint-disable */

import Vue from 'vue'
// import App from './App'
// import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import CryptoJS from 'crypto-js'

Vue.use(ElementUI)
Vue.prototype.$axios = axios

var vm = new Vue({
  el: "#main_div",
  data: function () {
    return {
      name: "",
      email: "",
      password: "",
      password_repeat: "",
      message: "请输入以上信息"
    }
  },
  methods: {
    encrypt: function (data) {
      var passphrase = "passphrase"
      var encrypted = CryptoJS.AES.encrypt(data, passphrase).toString()
      return encrypted
    },
    try_register: function () {
      this.check();
      if (this.message !== "") {
        return;
      }
      let data = {
        "email": this.email,
        "password": this.encrypt(this.password),
        'name': this.name
      }
      let config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
      }
      this.$axios.post('http://39.105.19.68:8000/user/register', JSON.stringify(data), config)
        .then(
          (res) => {
            res = res.data
            if (res.code === 200) {
              window.location.href = "http://39.105.19.68:8000/user/login.html";
            } else {
              alert("注册失败")
            }
          }
        )
    },
    check_name: function () {
      if (this.name.length === 0 || this.name.length > 20) {
        return false;
      }
      return true;
    },
    check_email: function () {
      if (this.email.length === 0 || this.email.indexOf("@") === -1) {
        return false;
      }
      return true;
    },
    check_password: function () {
      if (this.password.length <= 5) {
        return false;
      }
      return true;
    },
    check_password_repeat: function () {
      if (this.password_repeat !== this.password) {
        return false;
      }
      return true;
    },
    check: function () {
      if (!this.check_name()) {
        this.message = "用户名格式错误";
        return;
      }
      if (!this.check_email()) {
        this.message = "邮箱格式错误";
        return;
      }
      if (!this.check_password()) {
        this.message = "密码格式错误";
        return;
      }
      if (!this.check_password_repeat()) {
        this.message = "密码不一致";
        return;
      }
      this.message = "";
    }
  }
})
