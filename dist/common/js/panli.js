
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
/*
* 判断是否是pc
* */
var _HostUrlUed = 'http://sf.panli.com/Ued';

function is_pc(){
    var os = new Array("Android","iPhone","Windows Phone","iPod","BlackBerry","MeeGo","SymbianOS");  // 其他类型的移动操作系统类型，自行添加
    var info = navigator.userAgent;
    var len = os.length;
    for (var i = 0; i < len; i++) {
        if (info.indexOf(os[i]) > 0){
            return false;
        }
    }
    return true;
};
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}

function setCookie(name,value,time)
{
    var strsec = getsec(time);
    var exp = new Date();
    exp.setTime(exp.getTime() + strsec*1);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
function getsec(str)
{

    var str1=str.substring(1,str.length)*1;
    var str2=str.substring(0,1);
    if (str2=="s")
    {
        return str1*1000;
    }
    else if (str2=="h")
    {
        return str1*60*60*1000;
    }
    else if (str2=="d")
    {
        return str1*24*60*60*1000;
    }
}
//这是有设定过期时间的使用示例：
//s20是代表20秒
//s20是代表20秒
//h是指小时，如12小时则是：h12
//d是天数，30天则：d30




//var username=document.cookie.split(";")[0].split("=")[1];
////JS操作cookies方法!
////写cookies
//function setCookie(name,value)
//{
//    var Days = 30;
//    var exp = new Date();
//    exp.setTime(exp.getTime() + Days*24*60*60*1000);
//    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
//}
/*  myDate.getYear();        //获取当前年份(2位)
 myDate.getFullYear();    //获取完整的年份(4位,1970-????)
 myDate.getMonth();       //获取当前月份(0-11,0代表1月)
 myDate.getDate();        //获取当前日(1-31)
 myDate.getDay();         //获取当前星期X(0-6,0代表星期天)
 myDate.getTime();        //获取当前时间(从1970.1.1开始的毫秒数)
 myDate.getHours();       //获取当前小时数(0-23)
 myDate.getMinutes();     //获取当前分钟数(0-59)
 myDate.getSeconds();     //获取当前秒数(0-59)
 myDate.getMilliseconds();    //获取当前毫秒数(0-999)
 myDate.toLocaleDateString();     //获取当前日期
 var mytime=myDate.toLocaleTimeString();     //获取当前时间
 myDate.toLocaleString( );        //获取日期与时间*/

function removeEle(removeObj) {
    removeObj.parentNode.removeChild(removeObj);
}

/**
 * Created by Administrator on 2015/9/11.
 */
/*
* 2015年9月14日15:29:04
* 首页弹出框
* */
;(function(jQuery){


    var PanBoxDoing = function(){
        var self = this;

        this.myDate = new Date();
        this._month = this.myDate.getMonth()+1;
        this._date = this.myDate.getDate();
        this._year = this.myDate.getFullYear();

        this.DoingDateStart = 2015917;
        this.DoingDateEnd = 2015922;
        this._tayDate = parseInt(this._year.toString()+this._month.toString()+this._date.toString());

        this.ifAlter();


    };

    PanBoxDoing.prototype = {
        ifAlter:function(){

            if(this._tayDate >= this.DoingDateStart && this._tayDate <= this.DoingDateEnd){

                this.bodyNode = $(document.body);
                //创建遮罩和弹出框
                this._mask = $('<div id="panDoing_mask" class="panDoing_mask">');
                this._wrap  = $('<div id="panDoing_wrap" class="panDoing_wrap">');

                var indexAlter = getCookie('indexAlter');
                console.log(indexAlter);
                if(indexAlter = null || indexAlter != this._tayDate){
                    this.renderDOM();
                    console.log("活动时间内1次");
                }

            }
        },
        closeAlter:function () {
            this._mask.fadeOut();
            this._wrap.fadeOut();
        },
        renderDOM:function(){
            var loadNum = 0;
            // 渲染DOM
            var imgInfo = [{w:663,h:524,src:_HostUrlUed+'/images/20150927/doing_001.png',a:'http://www.panli.com/Special/shippingsale_201509.html'},
                {w:494,h:664,src:_HostUrlUed+'/images/20150927/doing_002.png',a:'http://www.panli.com/Special/shippingsale_201509.html'},
                {w:480,h:689,src:_HostUrlUed+'/images/20150927/doing_003.png',a:'http://www.panli.com/Special/shippingsale_201509.html'}
            ];

            var _boxTop = imgInfo[loadNum].h/2,
             _boxRight = imgInfo[loadNum].w/2,
             _boxA = imgInfo[loadNum].a,
             _boxImg = imgInfo[loadNum].src;

            var boxHtml =   '<span class="closePanDoing" title="残忍的关闭"></span>'+
            '<img src="'+ _boxImg +'" alt=""/>' +
                '<a href="'+ _boxA +'" target="_blank" >'+
                '</a>';
            this._wrap.html(boxHtml);
            this.bodyNode.append(this._mask,this._wrap);
            this._wrap.css({marginTop:-_boxTop,marginRight:-_boxRight});
            this._mask.fadeIn('50');
            this._wrap.fadeIn('50');

            setCookie("indexAlter",this._tayDate,"d30");

            this.bodyNode.on('click','.closePanDoing,a',function(){
               $("#panDoing_mask").fadeOut('50');
               $("#panDoing_wrap").fadeOut('50');
            });

        }
    }

    window['PanBoxDoing'] = PanBoxDoing;
})(jQuery);