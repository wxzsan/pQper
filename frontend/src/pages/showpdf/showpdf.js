/* eslint-disable */
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import $ from 'jquery'


Vue.use(ElementUI)
Vue.prototype.$axios = axios
    //let PDFJS = require('pdfjs-dist')

let PDFJS = require('pdfjs-dist')
PDFJS.workerSrc = require('pdfjs-dist/build/pdf.worker.entry')
PDFJS.imageResourcesPath = 'http://127.0.0.1:8080/static/'

var vm = new Vue({
    el: '#app',
    data: function() {
        return {
            pdf_src: '/static/A_Mathematical_Theory_of_Communication.pdf',
            pdf_scale: 1.0, //pdf放大系数
            pdf_pages: [],
            pdf_div_width: ''
        }
    },
    methods: {
        handle_click: function(event) {
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
        _loadFile: function(url) { //初始化pdf
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
        _renderPage: function(num) {
            this.pdfDoc.getPage(num)
                .then((page) => {
                    var scale = 1;
                    var viewport = page.getViewport(scale);
                    var $canvas = $('#the-canvas' + num);
                    var canvas = $canvas.get(0);
                    var context = canvas.getContext("2d");
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    var $pdfContainer = $("#pdf");
                    $pdfContainer.css("height", canvas.height + "px")
                        .css("width", canvas.width + "px");

                    var renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    page.render(renderContext);
                    this.setupAnnotations(page, viewport, canvas, $('#annotation_layer' + num));
                    if (num < this.pdf_pages) {
                        this._renderPage(num + 1)
                    }
                })
        },

        setupAnnotations: function(page, viewport, canvas, $annotationLayerDiv) {
            var canvasOffset = $(canvas).offset();
            var promise = page.getAnnotations().then(function(annotationsData) {
                viewport = viewport.clone({
                    dontFlip: true
                });

                for (var i = 0; i < annotationsData.length; i++) {
                    var data = annotationsData[i];
                    console.log(typeof data)
                    var annotation = PDFJS.Annotation.fromData(data);
                    if (!annotation || !annotation.hasHtml()) {
                        continue;
                    }

                    var element = annotation.getHtmlElement(page.commonObjs);
                    data = annotation.getData();
                    var rect = data.rect;
                    var view = page.view;
                    rect = PDFJS.Util.normalizeRect([
                        rect[0],
                        view[3] - rect[1] + view[1],
                        rect[2],
                        view[3] - rect[3] + view[1]
                    ]);
                    element.style.left = (canvasOffset.left + rect[0]) + 'px';
                    element.style.top = (canvasOffset.top + rect[1]) + 'px';
                    element.style.position = 'absolute';

                    var transform = viewport.transform;
                    var transformStr = 'matrix(' + transform.join(',') + ')';
                    CustomStyle.setProp('transform', element, transformStr);
                    var transformOriginStr = -rect[0] + 'px ' + -rect[1] + 'px';
                    CustomStyle.setProp('transformOrigin', element, transformOriginStr);

                    if (data.subtype === 'Link' && !data.url) {
                        // In this example,  I do not handle the `Link` annotations without url.
                        // If you want to handle those links, see `web/page_view.js`.
                        continue;
                    }
                    $annotationLayerDiv.append(element);
                }
            });
            return promise;
        }
    }
})
vm._loadFile(vm.pdf_src)