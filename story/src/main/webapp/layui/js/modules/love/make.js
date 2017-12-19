layui.define(['layer', 'form', 'zjoin','layedit','cookie','util'], function (exports) {
    var $ = layui.jquery,
        form = layui.form,
        layer = layui.layer,zjoin=layui.zjoin,layedit = layui.layedit,util=layui.util;
    zjoin.set({image: $("#cover-image"), input: $("#cover")});
    var edit = layedit.build("content");

    form.verify({
        content: function(value){
            layedit.sync(edit);
        }
    });
    form.on('submit(love)',function (d) {
        $.ajax({
            url:'/love/add',
            type:'post',
            data:d.field,
            success:function (data) {
                if(data.code==0){
                    layer.ok("提交审核中，请耐心等待～")
                }else {
                    layer.warn(data.msg);
                }
            }
        })
        return false;
    });
    util.fixbar({
        bar1: '&#xe15e;',
        bgcolor:'#ffffff'
        ,click: function(type){
            if(type === 'bar1'){
                window.location.href="love.html"
            }
        }
    });
    $.ajax({
        url: '/story/user',
        type: 'get',
        success: function (data) {
            if (data.code == 0) {
                $.cookie("nickname", data.data.nickname);
                var $li = '<li class="layui-nav-item" id="personalli"> <img src="'+data.data.picture+'" class="layui-nav-img"></li>';
                var $li2 = '<li class="layui-nav-item" id="logoutli"> 退出</li>'
                $("#loginli").parent('ul').empty().append($li).append($li2);
            }
        }
    });
    form.on('select(love-type)', function(data){
        var src="";
        switch (Number(data.value)){
            case 1:
                 src = 'http://image.story521.cn/FshSaKKJBG0NTrblaEDGWIVjFmju';
                break;
            case 2:
                 src = 'http://image.story521.cn/FjowsRrFHKnPsVsQuAdbHkfcGf7w';
                break;
            case 3:
                src = 'http://image.story521.cn/FuyrNQyUREbfmcDqN96DgSGqBK_R';
                break;
            case 4:
                src = 'http://image.story521.cn/FtYOa5bdYstDCMuiriRXGI-4fuc1';
                break;
            case 5:
                src = 'http://image.story521.cn/Fp4TpY9ePh8nnuT33tJqDpYVnH5O';
                break;
        }
        $("#cover-image").attr("src",src);
        $("#cover").val(src);
    });
    exports('make',{})
});