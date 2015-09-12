
;!function(window){
    "use strict";

    var path = ''; //所在路径，如果非模块加载不用配置
    path = path ? path : document.scripts[document.scripts.length-1].src.match(/[\s\S]*\//)[0];

    var doc = document, query = 'querySelectorAll',
        claname = 'getElementsByClassName',
        S = function(s){
            return doc[query](s);
        };

     /* 插入css */
    document.head.appendChild((function(){
        var link = doc.createElement('link');
        link.href = path + 'css/alter.css';
        link.type = 'text/css';
        link.rel = 'styleSheet'
        link.id = 'layermcss';
        return link;
    }()));

    /* 默认配置 */
    var config = {
        type : 0,
        shade :true,
        shadeCloss:true,
        fixed:true,
        anim:true
    };

    window.read = {
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
    read.touch =function(elem,func){
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
        classs = ['layermbox'],
        Pan = function(options){
            var that = this;
            that.config = read.extend(options);
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
                ? '<h3 style="'+ (titype ? config.title[1] : '') +'">'+ (titype ? config.title[0] : config.title)  +'</h3><button class="layermend"></button>'
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
            return '<div class="layermbtn">'+ btndom + '</div>';
        }());

        if(!config.fixed){
            config.top = config.hasOwnProperty('top') ?  config.top : 100;
            config.style = config.style || '';
            config.style += ' top:'+ ( doc.body.scrollTop + config.top) + 'px';
        }

        if(config.type === 2){
            config.content = '<i></i><i class="laymloadtwo"></i><i></i><div>' + (config.content||'') + '</div>';
        }

        panBox.innerHTML = (config.shade ? '<div '+ (typeof config.shade === 'string' ? 'style="'+ config.shade +'"' : '') +' class="laymshade"></div>' : '')
            +'<div class="layermmain" '+ (!config.fixed ? 'style="position:static;"' : '') +'>'
            +'<div class="section">'
            +'<div class="layermchild '+ (config.className ? config.className : '') +' '+ ((!config.type && !config.shade) ? 'layermborder ' : '') + (config.anim ? 'layermanim' : '') +'" ' + ( config.style ? 'style="'+config.style+'"' : '' ) +'>'
            + title
            +'<div class="layermcont">'+ config.content +'</div>'
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
            var end = elem[claname]('layermend')[0], endfn = function(){
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
            var btns = elem[claname]('layermbtn')[0].children, btnlen = btns.length;
            for(var ii = 0; ii < btnlen; ii++){
                ready.touch(btns[ii], btn);
                btns[ii].onclick = btn;
            }
        }

        //点遮罩关闭
        if(config.shade && config.shadeClose){
            var shade = elem[claname]('laymshade')[0];
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
        v : '0.0.1',
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
    }



    'function' === typeof define ? define(function() {
        return pan;
    }) : window.pan = panV;


}(window);
/**
 * Created by Administrator on 2015/9/11.
 */
