/**
 项目JS主入口
 以依赖Layui的layer和form模块为例
 **/
layui.define(['layer', 'carousel','zjoin','util','flow'], function (exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        util = layui.util,
        carousel = layui.carousel,flow = layui.flow;
    //建造实例

    carousel.render({
        elem: '#test2'
        , width: '100%' //设置容器宽度
        , arrow: 'always' //始终显示箭头
        , anim: 'fade' //切换动画方式
    });

    $.ajax({
        url: '/story/carousel',
        type: 'post',
        data:{catalog:2},
        success: function (data) {
            if (data.code == 0) {
                layui.each(data.data, function(index, d){
                    $("#love-carousel-item").append('<div class="carousel-item" style="text-align: center"><img alt="'+d.title+'"src="' + d.picture + '"></div>');
                });
                carousel.render({
                    elem: '#love-carousel'
                    , width: '100%' //设置容器宽度
                    , arrow: 'hover' //始终显示箭头
                    , anim: 'fade' //切换动画方式
                });
            }
        }
    });
    flow.load({
        elem: '#love-topest' //指定列表容器
        ,done: function(page, next){ //到达临界点（默认滚动触发），触发下一页
            var lis = [];
            //以jQuery的Ajax请求为例，请求下一页数据（注意：page是从2开始返回）
            $.get('/love/top?pageNum='+page, function(res){
                //假设你的列表返回在data集合中
                layui.each(res.rows, function(index, item){
                    var $li = '<li>' +
                        '   <img alt="'+item.title+'" lay-src="'+item.cover+'">' +
                        '   <div style="position: relative;top:-200px;line-height: 50px;height: 200px">' +
                        '       <div class="layui-elip" style="line-height: 40px;float: left;width: 100%;background: #b2b2b2;opacity: 0.5;color: #ffffff;">'+
                        (item.isprivate ? '<i class="layui-icon" style="color: #000000">&#xe8f5;</i>' :'<i class="layui-icon" style="color: #ffffff">&#xe8f4;</i>')+'&nbsp;'+
                                 '<a href="http://www.story521.cn/html/love/show.html?id='+item.id+'" target="_blank">'+item.title+'</a>'+
                                '</div>' +
                        '       <div style="line-height: 40px;float: right;color: #ffffff;">'+
                                '</div>' +
                        '       <div class="shareAndGood" style="position:relative;bottom:-110px;margin-left:10px;float: left;width: 40px;height: 40px;line-height: 40px;text-align: center;border-radius: 20px;background: #b2b2b2;opacity: 0.5;color: #fefefe;display: none"><i class="layui-icon" style="color: #FF00FF;cursor: pointer;font-size: 25px;">&#xe87e;</i></div>' +
                        (item.isprivate ? '':'<div class="shareAndGood" id="shareLove" data-id="'+item.id+'" style="position:relative;bottom:-110px;margin-right:10px;float: right;width: 40px;height: 40px;line-height: 40px;text-align: center;border-radius: 20px;background: #b2b2b2;opacity: 0.5;color: #fefefe;display: none"><i class="layui-icon" style="color: #ffffff;cursor: pointer;font-size: 25px;">&#xe992;</i></div>') +
                        '   </div>' +
                        '</li>';
                    lis.push($li);
                });
                next(lis.join(''), page < res.pages);
                flow.lazyimg();
            });
        }
    });

    $("body").delegate("#love-topest li",'click',function () {
        $(".shareAndGood").hide();
        if($(this).find(".shareAndGood").hasClass("show")){
            $(this).find(".shareAndGood").hide();
            $(this).find(".shareAndGood").removeClass("show")
        }else {
            $(this).find(".shareAndGood").show()
            $(this).find(".shareAndGood").addClass("show")
        }

    });


    $('body').delegate("#shareLove", 'click', function (e) {
        e.stopPropagation();
        e.preventDefault();
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
                        title:false,
                        type: 1,
                        closeBtn: 0, //不显示关闭按钮
                        anim: 2,
                        shadeClose: true, //开启遮罩关闭
                        anim: 5,
                        content: $div
                    });
                }

            }
        });
        return;
    });
    util.fixbar({
        bar1: '&#xe650;',
        bgcolor:'#fefefe'
        ,click: function(type){
            if(type === 'bar1'){
                window.location.href="make.html"
            }
        }
    });

    exports('love', {});
});

