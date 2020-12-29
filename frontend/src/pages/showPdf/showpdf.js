/* eslint-disable */
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import $ from 'jquery'
/*
import pdfvuer from 'pdfvuer'
import 'pdfvuer/dist/pdfvuer.css'
import * as test from 'pdfjs-dist/webpack'
import pdfAnnotate from 'pdf-annotate-vue'
import "pdf-annotate-vue/src/css/toolbar.css";
import "pdf-annotate-vue/src/css/pdf_viewer.css";
*/


Vue.use(ElementUI)
Vue.prototype.$axios = axios
var PDFJS = require('pdfjs-dist')
PDFJS.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.min')
PDFJS.imageResourcesPath = '/user/'
console.log(PDFJS)

var vm = new Vue({
    el: '#app',
    created: function () {
        this.initDatas()
        this.showPDF(this.pdf_src)
    },
    data: {
        paperId: 0,
        pdf_src: '',
        __PDF_DOC: undefined,
        __CURRENT_PAGE: 0,
        TOTAL_PAGES: 0,
        __PAGE_RENDERING_IN_PROGRESS: 0,
        __CANVAS: undefined,
        __CANVAS_CTX: undefined,
        pdf_div_width: '',
        pdf_x: 0,
        pdf_y: 0,
    },
    methods: {
        getParams(key) {
            var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)")
            var r = window.location.search.substr(1).match(reg)
            if (r != null) {
                return unescape(r[2])
            }
            return null
        },
        initDatas() {
            this.paperId = parseInt(this.getParams("id"))
            this.pdf_src = 'http://127.0.0.1:8000/commentarea/get_paper?paperId=' + this.paperId
        },
        handle_click: function (event) {
            var div = document.getElementById('the-canvas1')
            event = event || window.event;
            //2.获取鼠标在整个页面的位置  
            var pagex = event.pageX || scroll().left + event.clientX
            var pagey = event.pageY || scroll().top + event.clientY
            //3.获取盒子在整个页面的位置  
            var xx = div.offsetLeft
            var yy = div.offsetTop
            //4.用鼠标的位置减去盒子的位置赋值给盒子的内容。  
            var targetx = pagex - xx
            var targety = pagey - yy
            window.parent.postMessage({
                data: [
                    targetx / this.pdf_x,
                    (targety % this.pdf_y) / this.pdf_y,
                    Math.floor(targety / this.pdf_y)
                ]
            }, '*')
        },
        showPage: function (page_no) {
            var that = this
            that.__PAGE_RENDERING_IN_PROGRESS = 1
            that.__CURRENT_PAGE = page_no
            that.__CANVAS = $('#the-canvas' + page_no).get(0)
            that.__CANVAS_CTX = that.__CANVAS.getContext('2d')
            // Fetch the page
            that.__PDF_DOC.getPage(page_no)
                .then(function (page) {
                    let canvas = that.__CANVAS
                    let ctx = that.__CANVAS_CTX
                    let dpr = window.devicePixelRatio || 1
                    let bsr = ctx.webkitBackingStorePixelRatio ||
                        ctx.mozBackingStorePixelRatio ||
                        ctx.msBackingStorePixelRatio ||
                        ctx.oBackingStorePixelRatio ||
                        ctx.backingStorePixelRatio || 1
                    //let ratio = dpr / bsr
                    let viewport = page.getViewport({
                        scale: 1.5,
                        rotation: page.rotate,
                        dontFlip: false
                    })
                    //viewport.width = viewport.width * ratio
                    //viewport.height = viewport.height * ratio
                    canvas.width = viewport.width
                    canvas.height = viewport.height
                    canvas.style.width = viewport.width + 'px'
                    that.pdf_div_width = viewport.width + 'px'
                    canvas.style.height = viewport.height + 'px'
                    that.pdf_x = viewport.width
                    that.pdf_y = viewport.height + 5    // 抵消页之间的距离
                    //ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
                    let renderContext = {
                        canvasContext: ctx,
                        viewport: viewport
                    }
                    // Render the page contents in the canvas
                    page.render(renderContext)
                        .then(function () {
                            that.__PAGE_RENDERING_IN_PROGRESS = 0;
                            // Return annotation data of the page after the pdf has been rendered in the canvas
                            return page.getAnnotations();
                        }).then(function (annotationData) {
                            // Get canvas offset
                            var canvas_offset = $("#the-canvas" + page_no).offset()
                            // Assign the CSS created to the annotation-layer element
                            $("#annotation-layer" + page_no).css({
                                left: canvas_offset.left + 'px',
                                top: canvas_offset.top + 'px',
                                height: that.__CANVAS.height + 'px',
                                width: that.__CANVAS.width + 'px'
                            });
                            PDFJS.AnnotationLayer.render({
                                viewport: viewport.clone({ dontFlip: true }),
                                div: $("#annotation-layer" + page_no).get(0),
                                annotations: annotationData,
                                page: page
                            });
                            console.log(document.getElementById("annotation-layer" + page_no).childNodes)
                            if (page_no < that.TOTAL_PAGES) {
                                that.showPage(page_no + 1)
                            }
                        });
                });
        },
        showPDF: function (pdf_url) {
            var that = this
            PDFJS.getDocument({ url: pdf_url })
                .then(function (pdf_doc) {
                    that.__PDF_DOC = pdf_doc
                    that.TOTAL_PAGES = that.__PDF_DOC.numPages
                    // Show the first page
                    that.$nextTick(() => {
                        that.showPage(1)
                    })
                })
        }
    }
})

/*function Annotation_fromData(data) {
  var subtype = data.subtype;
  var fieldType = data.fieldType;
  var Constructor = PDFAnnotations.getConstructor(subtype, fieldType);
  if (Constructor) {
    return new Constructor({ data: data });
  }
}
*/