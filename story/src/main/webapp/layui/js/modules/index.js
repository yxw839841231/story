/**
 项目JS主入口
 以依赖Layui的layer和form模块为例
 **/
layui.define(['layer', 'carousel','zjoin','util'], function (exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        util = layui.util,
        carousel = layui.carousel;
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
        success: function (data) {
            if (data.code == 0) {
                for (var d of data.data) {
                    $("#carousel-item1").append('<div><img src="' + d.picture + '"></div>');
                }
                carousel.render({
                    elem: '#test1'
                    , width: '100%' //设置容器宽度
                    , arrow: 'hover' //始终显示箭头
                    , anim: 'fade' //切换动画方式
                });
            }
        }
    })
    $.ajax({
        url: '/story/article/newest',
        success: function (data) {
            if (data.code == 0) {
                $("#story-newest-article").empty();
                $("#newestArticle").empty();
                for (var d of data.data) {
                    var html = '';
                    html += '<li style="cursor:pointer;" class="testli layui-elip" dd="'+d.id+'">'
                    html += '    <h1 style="font-weight: bold">' + d.title + '</h1>'
                    html += '    <div style="width: 110px;height: 110px;line-height: 110px;float: left">'
                    html += '        <img style="max-height: 100%;max-width: 100%;"'
                    html += '    src="' + d.cover + '">'
                    html += '        </div>'
                    html += '       <div style="width:85%;height: 110px;float: right;">'
                    html += '       <div style="width:100%;height: 75px;overflow: hidden">'
                    html += d.describle
                    html += '     </div>'
                    html += '    <div style="width:100%;height: 35px;">'
                    html += '       来源：' + d.author
                    html += '<div style="display: inline-block;float: right">时间：'+zjoin.timetrans(d.createtime)+'</div>'
                    html += ' </div>'
                    html += ' </div>'
                    html += ' <hr>'
                    html += ' </li>';
                    var $li = $('<li><p>&nbsp;'+d.title+'</p></li>');

                    $("#newestArticle").append($li);
                    $("#story-newest-article").append(html);

                }
                $("body").delegate('.testli','click',function () {
                    window.open("/html/story/article/detail.html?id="+$(this).attr("dd"));
                });
            }
        }
    });

    $.get('/story/maxCommentArticle',function (data) {
        if(data.code ==0){
            $("#newestComment").empty();
            for(var dd of data.data){
                var $li ='<li class="layui-elip">' +
                    '                            <p><a href="/html/story/article/detail.html?id='+dd.id+'" target="_blank">'+dd.title+'</a></p>' +
                    '                            <div>' +
                    '                            <span><i class="layui-icon browse">&#xe91d;</i>&nbsp;'+dd.browse+'</span>&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '                            <span><i class="layui-icon comment">&#xe998;</i>&nbsp;'+dd.totals+'</span>&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '                            <span><i class="layui-icon author">&#xe7fd;</i>&nbsp;'+dd.author+'</span>&nbsp;&nbsp;' +
                    '                             </div>' +
                    '                        </li>';
                $("#newestComment").append($li)
            }
        }
    });
    $.get('/story/maxDzArticle',function (data) {
        if(data.code ==0){
            $("#newestTalk").empty();
            for(var dd of data.data){
                var $li ='<li>' +
                    '                            <p><a href="/html/story/article/detail.html?id='+dd.id+'" target="_blank">'+dd.title+'</a></p>' +
                    '                            <div>' +
                    '                                <span><i class="layui-icon author">&#xe91f;</i>&nbsp;'+dd.author+'</span>&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '                                <span><i class="layui-icon date">&#xe8b5;</i>&nbsp;'+zjoin.timetrans(dd.createtime)+'</span>&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '                                <span><i class="layui-icon good">&#xe87d;</i>&nbsp;'+dd.totals+'</span>&nbsp;&nbsp;' +
                    '                            </div>' +
                    '                        </li>';
                $("#newestTalk").append($li)
            }
        }
    });
    util.fixbar({
        bar1: true
        ,click: function(type){
            console.log(type);
            if(type === 'bar1'){
                alert('点击了bar1')
            }
        }
    });
    exports('index', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});

