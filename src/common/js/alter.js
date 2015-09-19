
;!function(window){
    "use strict";
    var _HostUrlUed = 'http://sf.panli.com/Ued';
    var doc = document, query = 'querySelectorAll',
        claname = 'getElementsByClassName',
        S = function(s){
            return doc[query](s);
        };

    var path = ''; //所在路径，如果非模块加载不用配置
    path = path ? path : doc.scripts[doc.scripts.length-1].src.match(/[\s\S]*\//)[0];

    var head = doc.head;

    var metaHtml = '' +
        '<meta content="yes" name="apple-mobile-web-app-capable" /> '+
        '<meta content="black" name="apple-mobile-web-app-status-bar-style" /> '+
        '<meta content="telephone=no" name="format-detection" /> '+
        '<meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0, user-scalable=0" />' ;

    head.innerHTML += metaHtml;


     /* 插入 公共组件  css */
    doc.head.appendChild((function(){
        var link = doc.createElement('link');
        link.href = _HostUrlUed+'/dist/common/css/panli.min.css';
        link.type = 'text/css';
        link.rel = 'styleSheet'
        link.id = 'panlimcss';

        console.log(link);
        return link;
    }()));

    /* 默认配置 */
    var config = {
        type : 2,
        shade :true,
        shadeCloss:true,
        fixed:true,
        anim:true
    };

    window.ready = {
        extend:function(obj){
            var newObj = JSON.parse(JSON.stringify(config));
            for(var i in obj){
                newObj[i] = obj[i];
            }
            return newObj;
        },
        timer:{},
        end:{}
    };

    /* 点击事件 */
    ready.touch =function(elem,func){
        var move;
        elem.addEventListener('touchmove',function(){
            move= true;
        },false);
        elem.addEventListener('touchend',function(e){
            e.preventDefault();
            move || func.call(this,e);
            move = false;
        },false);
    };

    var index = 0,
        classs = ['panAltermbox'],
        Pan = function(options){
            var that = this;
            that.config = ready.extend(options);
            that.view();
        };

    Pan.prototype.view = function () {
        var that = this,
            config = that.config,
            panBox = doc.createElement('div');

        that.id = panBox.id = classs[0] + index;
        panBox.setAttribute('class', classs[0] + ' ' + classs[0]+(config.type || 0));
        panBox.setAttribute('index', index);

        var title = (function(){
            var titype = typeof config.title === 'object';
            return config.title
                ? '<h3 style="'+ (titype ? config.title[1] : '') +'">'+ (titype ? config.title[0] : config.title)  +'</h3><button class="panAltermend"></button>'
                : '';
        }());

        var button = (function(){
            var btns = (config.btn || []).length, btndom;
            if(btns === 0 || !config.btn){
                return '';
            }
            btndom = '<span type="1">'+ config.btn[0] +'</span>'
            if(btns === 2){
                btndom = '<span type="0">'+ config.btn[1] +'</span>' + btndom;
            }
            return '<div class="panAltermbtn">'+ btndom + '</div>';
        }());

        if(!config.fixed){
            config.top = config.hasOwnProperty('top') ?  config.top : 100;
            config.style = config.style || '';
            config.style += ' top:'+ ( doc.body.scrollTop + config.top) + 'px';
        }

        if(config.type === 2){
            config.content = '<i></i><i class="laymloadtwo"></i><i></i><div>' + (config.content||'') + '</div>';
        }

        panBox.innerHTML = (config.shade ? '<div '+ (typeof config.shade === 'string' ? 'style="'+ config.shade +'"' : '') +' class="panAltermshade"></div>' : '')
            +'<div class="panAltermmain" '+ (!config.fixed ? 'style="position:static;"' : '') +'>'
            +'<div class="section">'
            +'<div class="panAltermchild '+ (config.className ? config.className : '') +' '+ ((!config.type && !config.shade) ? 'panAltermborder ' : '') + (config.anim ? 'panAltermanim' : '') +'" ' + ( config.style ? 'style="'+config.style+'"' : '' ) +'>'
            + title
            +'<div class="panAltermcont">'+ config.content +'</div>'
            + button
            +'</div>'
            +'</div>'
            +'</div>';

        if(!config.type || config.type === 2){
            var dialogs = doc[claname](classs[0] + config.type), dialen = dialogs.length;
            if(dialen >= 1){
                pan.close(dialogs[0].getAttribute('index'))
            }
        }

        document.body.appendChild(panBox);
        var elem = that.elem = S('#'+that.id)[0];
        config.success && config.success(elem);

        that.index = index++;
        that.action(config, elem);
    };

    Pan.prototype.action = function(config,elem){
        var that = this;

        //自动关闭
        if(config.time){
            ready.timer[that.index] = setTimeout(function(){
                pan.close(that.index);
            }, config.time*1000);
        }

        //关闭按钮
        if(config.title){
            var end = elem[claname]('panAltermend')[0], endfn = function(){
                config.cancel && config.cancel();
                pan.close(that.index);
            };
            ready.touch(end, endfn);
            end.onclick = endfn;
        }

        //确认取消
        var btn = function(){
            var type = this.getAttribute('type');
            if(type == 0){
                config.no && config.no();
                pan.close(that.index);
            } else {
                config.yes ? config.yes(that.index) : pan.close(that.index);
            }
        };


        if(config.btn){
            var btns = elem[claname]('panAltermbtn')[0].children, btnlen = btns.length;
            for(var ii = 0; ii < btnlen; ii++){
                ready.touch(btns[ii], btn);
                btns[ii].onclick = btn;
            }
        }

        //点遮罩关闭
        if(config.shade && config.shadeClose){
            var shade = elem[claname]('panAltermshade')[0];
            ready.touch(shade, function(){
                pan.close(that.index, config.end);
            });
            shade.onclick = function(){
                pan.close(that.index, config.end);
            };
        }

        config.end && (ready.end[that.index] = config.end);

    };

    var panV = {
        v : 'panli.com 组件库 0.0.1',
        index:index,
        author:'zan',
        /*主要方法*/
        open:function(options){
            var i = new Pan(options || {});
            return i
        },
        close:function(index){
            var ibox = S('#'+classs[0]+index)[0];
            if(!ibox) return;
            ibox.innerHTML = '';
            doc.body.removeChild(ibox);
            clearTimeout(ready.timer[index]);
            delete ready.timer[index];
            typeof ready.end[index] === 'function' && ready.end[index]();
            delete ready.end[index];
        },
        /* 关闭所有窗口 */
        closeAll: function(){
            var boxs = doc[claname](classs[0]);
            for(var i = 0, len = boxs.length; i < len; i++){
                pan.close((boxs[0].getAttribute('index')|0));
            }
        },
        /* 谷歌统计代码 */
        googleCount:function(){
            (function (i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
                        (i[r].q = i[r].q || []).push(arguments)
                    }, i[r].l = 1 * new Date(); a = s.createElement(o),
                    m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
            })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

            ga('create', 'UA-436090-2', 'auto');ga('require', 'displayfeatures');
            ga('send', 'pageview');
        },
        /* rem 字体转换 */
        remFontSize:function(){
            var fontsize = function () {
                var W = document.body.getBoundingClientRect().width, defaultW = 720, defaultSize = 40;
                W = W > defaultW ? defaultW : W < 320 ? 320 : W;
                window.W = W; document.documentElement.style.fontSize = (W / defaultW * defaultSize).toFixed(2) + 'px';
            };
            var fontset = setTimeout(fontsize, 300);
            window.addEventListener('resize', function () { clearTimeout(fontset); fontset = setTimeout(fontsize, 300) });
            window.addEventListener("DOMContentLoaded", fontsize);
            setTimeout(fontsize, 300);

        }
    }



    'function' === typeof define ? define(function() {
        return pan;
    }) : window.pan = panV;

    //panV.googleCount();
    if(!is_pc){
        panV.remFontSize();
        console.log('NOpc')
    }


}(window);