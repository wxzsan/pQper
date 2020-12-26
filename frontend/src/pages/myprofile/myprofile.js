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
      searchInput: ''
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
    handleSearch() {
      if (this.searchInput.length > 0) {
        var searchContent = btoa(encodeURI(this.searchInput))
        window.location.href = 'http://127.0.0.1:8000/SearchAndResults/SearchResultPage.html?searchContent=' + searchContent
      }
    }
  }
})
vm.get_user_information()
