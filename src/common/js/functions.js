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