/**
 项目JS主入口
 以依赖Layui的layer和form模块为例
 **/
layui.define(['layer', 'carousel','zjoin','util','cookie'], function (exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        util = layui.util,
        carousel = layui.carousel;
    //建造实例
    $.ajax({
        url: '/story/carousel',
        type: 'post',
        success: function (data) {
            if (data.code == 0) {
                for (var d of data.data) {
                    $("#love-carousel-item").append('<div class="carousel-item"><img src="' + d.picture + '"></div>');
                }
                carousel.render({
                    elem: '#love-carousel'
                    , width: '100%' //设置容器宽度
                    , arrow: 'hover' //始终显示箭头
                    , anim: 'fade' //切换动画方式
                });
            }
        }
    });
    $('body').delegate("#shareLove", 'click', function () {

        $.ajax({
            url: "/love/share?id="+$(this).attr("data-id"),
            type: 'get',
            success: function (data) {
                if(data.code==0){
                    //$('#img').attr('src', 'data:image/jpg;base64,' + data.data);
                    var $div = '<div style="padding: 5px;background: #ffffff"><img src="data:image/jpg;base64,' + data.data+'"></div>';
                    //$($div).append()
                    //layer.open({content:$div})
                    layer.open({
                        title:'分享二维码',
                        type: 1,
                        closeBtn: 0, //不显示关闭按钮
                        anim: 2,
                        shadeClose: true, //开启遮罩关闭
                        content: $div
                    });
                }

            }
        });
    });

    exports('show', {});
});

