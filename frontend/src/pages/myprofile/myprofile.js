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
      photo: ''
    }
  },
  methods: {
    get_user_information: function () {
      this.$axios.post('http://127.0.0.1:8000/user/get_user_information')
        .then((res) => {
          res = res.data
<<<<<<< HEAD
          console.log(res)
=======
>>>>>>> branch_yyh
          if (res.data.msg === 'cookie out of date') {
            alert('登录超时')
            window.location.href = 'http://127.0.0.1:8000/user/login.html'
          } else if (res.code === 200) {
<<<<<<< HEAD
            this.name = res.data.name
            this.email = res.data.email
            console.log(this.name)
            if (res.data.photo !== '')
              this.photo = '/static' + res.data.photo
=======
            this.name = res.data.information.user_name
            this.email = res.data.information.user_email
            console.log(res.data.information)
            if (res.data.information.user_photo !== '')
              this.photo = res.data.information.user_photo
>>>>>>> branch_yyh
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
      window.location.href = 'http://127.0.0.1:8000/home.html'
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
    }
  }
})
vm.get_user_information()
