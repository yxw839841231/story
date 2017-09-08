/**
 项目JS主入口
 以依赖Layui的layer和form模块为例
 **/
layui.define(['layer', 'form','carousel','jquery','util'], function(exports){
    var layer = layui.layer
        ,carousel = layui.carousel
        ,form = layui.form
        ,$=layui.jquery
        ,util = layui.util;

    //建造实例
    carousel.render({
        elem: '#test1'
        ,width: '100%' //设置容器宽度
        ,arrow: 'always' //始终显示箭头
        //,anim: 'updown' //切换动画方式
    });

    util.fixbar({
        bar1: '&#xe62f;'
        ,bar2: '&#xe6b2;'
        ,css: {right: 50, bottom: 100}
        ,bgcolor: '#393D49'
        ,click: function(type){
            if(type === 'bar1'){
                layer.msg('icon是可以随便换的')
            } else if(type === 'bar2') {
                if($("#username").text().length>0){//已登录
                    window.open("/story/article");
                }else{
                    login();
                }
            }
        }
    });


    function login() {
        layer.open({
            type: 5,
            title:'登录',
            scrollbar: false,
            area: ['400px', '200px'], //宽高
            content: '/html/login.html'
        });
    }

    $("#login").click(function () {
        login();
    });
    $("#regist").click(function () {
        layer.open({
            type: 5,
            title:'注册',
            scrollbar: false,
            area: ['600px', '300px'], //宽高
            content: '/html/regist.html'
        });
    });

    $("#logout").click(function () {
        $.ajax({
            url: '/story/user/logout',
            type: 'post',
            success: function () {
                window.location.reload()
            }
        });
    });
    form.on('submit(login)', function (data) {
        layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        $.ajax({
            url: '/story/user/login',
            type: 'post',
            data: data.field,
            success: function () {
                layer.closeAll();
                window.location.reload()
            }
        });
        //
        return false;
    });
    form.on('submit(user-regist)', function (data) {
        layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        $.ajax({
            url: '/story/user/regist',
            type: 'post',
            data: data.field,
            success: function () {
                layer.closeAll();
                layer.open({
                    type: 5,
                    title:'登录',
                    scrollbar: false,
                    area: ['400px', '200px'], //宽高
                    content: '/html/login.html'
                });
            }
        });
        return false;
    });

    $.ajax({
        url: '/story/user',
        type: 'post',
        success: function (data) {
            if(data.code==0){
                $(".logining").remove();
                $("#username").html('<i class="layui-icon" id="u-head">&#xe612;</i>'+data.data.nickname)
            }else {
                $(".logined").remove();
            }
        }
    });

    $.ajax({
        url: '/story/article/list/1',
        type: 'get',
        success: function (data) {
            if(data.code==0){
                $("#articleUl").empty()
                var d = data.data;
               for(var i = 0;i<d.length;i++){
                   var li ='';
                   li +='<li class="story-article-li">'
                       +'<div class="layui-row">'
                       +'<div class=" layui-col-md3">'
                       +'<a href="#"><img src="'+d[i].cover+'" class="story-article-img"></a></div>'
                       +' <div class=" layui-col-md9 story-right-word">'
                       +'<a href="#"><span style="font-size: 20px;">'+d[i].title+'</span></a><br><br><p>'
                       +' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+d[i].describle
                       +' </p><br><div style="position: relative;bottom: 0px;font-size: 15px" >'
                       +'<div class="layui-row">'
                       +'<div class="layui-col-md4 story-article-foot">'
                       +'<i class="layui-icon story-icon"> &#xe6c6;</i>(0)</div>'
                       +'<div class="layui-col-md4 story-article-foot">'
                       +'<i class="layui-icon story-icon"> &#xe63a;</i>(0)</div>'
                       +'<div class="layui-col-md4 story-article-foot">'
                       +'<i class="layui-icon story-icon">&#xe612;</i>：<b>'+d[i].author+'</b>'
                       +'</div></div></div></div></div><hr></li>'
                   $("#articleUl").append(li);
               }
            }
        }
    });
    $.ajax({
        url: '/story/article/list/2',
        type: 'get',
        success: function (data) {
            if(data.code==0){
                $("#articleUl2").empty();
                var d = data.data;
                for(var i = 0;i<d.length;i++){
                    var li ='<li class="story-right-article-li">'+d[i].title+'</li>'
                    $("#articleUl2").append(li);
                }
            }
        }
    });
    $.ajax({
        url: '/story/article/list/4',
        type: 'get',
        success: function (data) {
            if(data.code==0){
                $("#articleUl4").empty();
                var d = data.data;
                for(var i = 0;i<d.length;i++){
                    var li ='<li class="story-right-article-li">'+d[i].title+'</li>'
                    $("#articleUl4").append(li);
                }
            }
        }
    });

    $.ajax({
        url: '/story/article/list/3',
        type: 'get',
        success: function (data) {
            if(data.code==0){
                $("#articleUl23").empty();
                var d = data.data;
                for(var i = 0;i<d.length;i++){
                    var li ='<li class="story-right-article-li">'+d[i].title+'</li>'
                    $("#articleUl3").append(li);
                }
            }
        }
    });
    exports('index', {});
});
