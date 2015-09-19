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