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


    exports('index', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});
