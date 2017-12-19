layui.define(['layer','cookie'], function (exports) {
    var $ = layui.jquery;

    $.ajaxSetup({
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        complete: function (XMLHttpRequest, textStatus) {
            //通过XMLHttpRequest取得响应结果
            var res = XMLHttpRequest.responseText;
            try {
                var jsonData = JSON.parse(res);
                if (jsonData.code == -10000) {
                    //自定页
                    layer.open({
                        title: '请重新登录',
                        type: 5,
                        closeBtn: 1, //不显示关闭按钮
                        area: ['390px', '240px'],
                        anim: 5,
                        shadeClose: true, //开启遮罩关闭
                        content: '/html/logind.html'
                        , btn: ['登录', '取消']
                        , yes: function (index, layero) {
                            //按钮【按钮一】的回调
                        }
                    });
                }
            } catch (e) {
            }
        }
    });
    $.ajax({
        url: '/story/user',
        type: 'get',
        success: function (data) {
            if (data.code == 0) {
                $.cookie("nickname", data.data.nickname);
                $.cookie("picture", data.data.picture);
                var $li = '<li class="layui-nav-item" id="personalli"><a href="/html/me.html" target="_blank"><img src="'+data.data.picture+'" class="layui-nav-img"></a></li>';
                var $li2 = '<li class="layui-nav-item" id="logoutli"> 退出</li>'
                $("#loginli").parent('ul').empty().append($li).append($li2);
            }
        }
    });

    $('body').delegate("#loginli", 'click', function () {
        //自定页
        layer.open({
            title: '请登录',
            type: 5,
            closeBtn: 1, //不显示关闭按钮
            area: ['390px', '240px'],
            anim: 5,
            shadeClose: true, //开启遮罩关闭
            content: '/html/logind.html'
            , btn: ['登录', '取消']
            , yes: function (index, layero) {
                //按钮【按钮一】的回调
            }
        });
    }).delegate("#logoutli", 'click', function () {
        $.ajax({
            url: '/story/user/logout',
            type: 'get',
            success: function (data) {
                if (data.code == 0) {
                    $.cookie("nickname", '',{expire:-1});
                    $("#logoutli").parent('ul').empty().append('<li class="layui-nav-item" id="loginli">登录</li>').append('<li class="layui-nav-item">&nbsp;|&nbsp;</li>').append('<li class="layui-nav-item" id = "registli">注册</li>')
                }
            }
        });
    }).delegate("#registli", 'click', function () {
        //自定页
        layer.open({
            title: '注册',
            type: 5,
            closeBtn: 1, //不显示关闭按钮
            area: ['450px', '400px'],
            anim: 5,
            shadeClose: true, //开启遮罩关闭
            content: '/html/regist.html'

        });
    });
    exports("common",{});
});
