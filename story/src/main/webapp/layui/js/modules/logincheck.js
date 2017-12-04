/**
 项目JS主入口
 以依赖Layui的layer和form模块为例
 **/
layui.define(['layer', 'carousel','zjoin','util'], function (exports) {
    var $ = layui.jquery,
        layer = layui.layer;
    //建造实例
        layer.msg("sdfsdf")
    $.ajaxSetup({
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        complete: function (XMLHttpRequest, textStatus) {
            //通过XMLHttpRequest取得响应结果
            var res = XMLHttpRequest.responseText;
            try {
                var jsonData = JSON.parse(res);
                console.log(jsonData.code == -10000)
                if (jsonData.code == -10000) {
                    //自定页
                    layer.open({
                        title:'用户登录',
                        type: 5,
                        closeBtn: 1, //不显示关闭按钮
                        area: ['500px', '300px'],
                        anim: 5,
                        shadeClose: true, //开启遮罩关闭
                        content:'/html/logind.html'
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

    var id = getUrlParam("id");
    $.get("/story/article/detail?id="+id, function (data) {
        console.log(data)
        document.title = data.data.title;
        $("#detail_title").html(data.data.title)
        $("#detail_content").html(data.data.content);

        $.get("/story/article/similar?catalog="+data.data.catalog, function (data2) {
            for(var dd of data2.data){
                var $li = ' <li>\n' +
                    '                            <p>' + dd.title + '</p>\n' +
                    '                            <div>\n' +
                    '                                <span><i class="layui-icon browse">&#xe91d;</i>&nbsp;33</span>&nbsp;&nbsp;&nbsp;&nbsp;\n' +
                    '                                <span><i class="layui-icon comment">&#xe998;</i>&nbsp;12</span>&nbsp;&nbsp;&nbsp;&nbsp;\n' +
                    '                                <span><i class="layui-icon author">&#xe7fd;</i>&nbsp;佚名</span>&nbsp;&nbsp;\n' +
                    '                            </div>\n' +
                    '                        </li>';
                $("#newestComment").append($li);
            }

        });



    });
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }
    //layedit.build("comment_edit");
    $("#claer_comment").click(function () {
        $("#comment_edit").val('');
    });
    $("#submit_comment").click(function () {
        var comment = $("#comment_edit").val();
        var pat=new RegExp("[[^?!@#$%\\^&*()]+","i");
        if(pat.test(comment)==true) {
            layer.msg("评论中含有非法字符！");
            //return false;
        }else if(comment==''){
            return;
        }
        console.log($.cookie("nickname"))
        if(!$.cookie("nickname")) {
            layer.open({
                type: 5,
                title: '登录',
                area: ['400px', '230px'],
                content: '/html/logind.html',
                btn: ['登录', '取消'],
                btnAlign: 'r',
                moveType: 1,//拖拽模式，0或者1
                yes:function(){
                }
            });
        }
        $.post("/story/comment/add",{articleid:id,content:comment},function (data) {
            $("#comment_edit").val('');
        })
    });
    $('body').delegate(".layui-layer-btn0",'click',function () {
        $.ajax({
            url: '/story/user/login',
            dataType: 'json',
            type: 'POST',
            data:{
                loginname:$("#loginname").val(),
                loginpass:$("#loginpass").val()
            },
            success: function(d){
                if(d.code == 0) {
                    $.cookie("nickname",d.data.nickname);
                    layer.closeCurrent();
                }

            }
        });
    });
    exports('login', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});

