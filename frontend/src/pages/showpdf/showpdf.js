/* eslint-disable */
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'


Vue.use(ElementUI)
Vue.prototype.$axios = axios
  //let PDFJS = require('pdfjs-dist')

let PDFJS = require('pdfjs-dist')
console.log(PDFJS)

var vm = new Vue({
  el: '#app',
  data: function () {
    return {
      pdf_src: '/static/A_Mathematical_Theory_of_Communication.pdf',
      pdf_scale: 1.0, //pdf放大系数
      pdf_pages: [],
      pdf_div_width: ''
    }
  },
  methods: {
    handle_click: function (event) {
      var div = document.getElementById('pdf')
      event = event || window.event;
      //2.获取鼠标在整个页面的位置  
      var pagex = event.pageX || scroll().left + event.clientX;
      var pagey = event.pageY || scroll().top + event.clientY;
      //3.获取盒子在整个页面的位置  
      var xx = div.offsetLeft;
      var yy = div.offsetTop
        //4.用鼠标的位置减去盒子的位置赋值给盒子的内容。  
      var targetx = pagex - xx;
      var targety = pagey - yy;
      console.log('目标x：' + targetx)
      console.log('目标y：' + targety)
    },
    _loadFile(url) { //初始化pdf
      let loadingTask = PDFJS.getDocument(url)
      loadingTask.promise
        .then((pdf) => {
          this.pdfDoc = pdf
          this.pdf_pages = this.pdfDoc.numPages
          this.$nextTick(() => {
            this._renderPage(1)
          })
        })
    },
    _renderPage(num) { //渲染pdf页
      const that = this
      this.pdfDoc.getPage(num)
        .then((page) => {
          let canvas = document.getElementById('the-canvas' + num)
          let ctx = canvas.getContext('2d')
          let dpr = window.devicePixelRatio || 1
          let bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1
          let ratio = dpr / bsr
          let viewport = page.getViewport({ scale: this.pdf_scale })

          canvas.width = viewport.width * ratio
          canvas.height = viewport.height * ratio

          canvas.style.width = viewport.width + 'px'

          that.pdf_div_width = viewport.width + 'px'

          canvas.style.height = viewport.height + 'px'

          ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
          let renderContext = {
            canvasContext: ctx,
            viewport: viewport
          }
          page.render(renderContext)
          if (this.pdf_pages > num) {
            this._renderPage(num + 1)
          }
        })
    }
  }
})
vm._loadFile(vm.pdf_src)
