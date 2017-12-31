/**
 项目JS主入口
 以依赖Layui的layer和form模块为例
 **/
layui.define(['layer', 'carousel','zjoin','util','cookie','flow'], function (exports) {
    var $ = layui.jquery,
        util = layui.util,
        carousel = layui.carousel,flow=layui.flow;

    //建造实例
    $.ajax({
        url: '/story/carousel',
        type: 'post',
        data:{catalog:1},
        success: function (data) {
            if (data.code == 0) {
                layui.each(data.data, function(index, d){
                    $("#carousel-item1").append('<div class="carousel-item" style="background: #fff"><img src="' + d.picture + '"></div>');
                });
                carousel.render({
                    elem: '#carousel-index'
                    , width: '99%' //设置容器宽度
                    , arrow: 'hover' //始终显示箭头
                    , anim: 'fade' //切换动画方式
                });
            }
        }
    });
    $.ajax({
        url: '/story/article/newest',
        type: 'get',
        success: function (data) {
            if (data.code == 0) {
                var head =
                    '<div style="height: 40px;line-height: 40px;width: 99%;background: #f2f2f2;margin-bottom: 5px">' +
                    '<div style="padding:0 15px;float:left;border: 1px solid #77abd0;line-height: 38px;border-radius: 4px;background: #77abd0;color: #fefefe">记忆尽头的故事</div>' +
                    '<div style="padding:0 5px;float: right"><a href="http://www.story521.cn/html/story.html">更多</a></div>' +
                    '</div>';
                $("#story-newest-article").append(head);
                layui.each(data.data.list, function(index, d){
                    var html = '';
                    html += '<li style="background:#ffffff;width:49%;margin:2px 1% 2px 0;display:inline-block;border-bottom: 1px dotted #f0f0f0"><div style="padding:2px 5px;">';
                    html += '    <h3 class="layui-elip"><a href="http://www.story521.cn/html/story/article/detail.html?id='+d.id+'" target="_blank" title="' + d.title + '">' + d.title + '</a></h3>';
                    html += '    <div style="width: 20%;height: 110px;line-height: 110px;float: left">';
                    html += '        <a title="'+d.title+'" href="http://www.story521.cn/html/story/article/detail.html?id='+d.id+'" target="_blank"><img style="max-height: 100%;max-width: 100%;" src="' + d.cover + '"></a>';
                    html += '    </div>';
                    html += '    <div style="width:80%;height: 110px;float: right;">';
                    html += '       <div style="width: 100%;padding: 0 4px;">';
                    html += '       <div style="height: 75px;line-height: 25px;padding:0 4px;overflow: hidden">'+ d.describle +'</div>';
                    html += '       <div style="height: 35px;line-height: 35px;padding:0 0px;">';
                    html += '           &nbsp;&nbsp;<i class="layui-icon" style="color: #bec0ac">&#xe8f4;</i>' + d.browse;
                    html += '           <div style="display: inline-block;float: right;padding:0 5px;"><a href="http://www.story521.cn/html/story/article/detail.html?id='+d.id+'" target="_blank" style="color: #4fa4c1">阅读全文</a></div>';
                    html += '       </div>';
                    html += '       </div>';
                    html += '   </div>';
                    html += '</div></li>';
                     $("#story-newest-article").append(html);
                });
            }
        }
    });
    /*$.get('/love/top?pageNum=1', function(res){
        var head =
            '<div style="height: 40px;line-height: 40px;width: 99%;background: #f2f2f2;margin-top: 5px">' +
            '<div style="padding:0 15px;float:left;border: 1px solid #ff4456;line-height: 38px;border-radius: 4px;background: #ff4456;color: #fefefe">灵魂深处的告白</div>' +
            '<div style="padding:0 5px;float: right"><a>更多</a></div>' +
            '</div>';
        $("#story-newest-article2").append(head);
        layui.each(res.rows, function(index, item){
            var $li = '<li>' +
                '   <img alt="'+item.title+'" src="'+item.cover+'">' +
                '   <div style="position: relative;top:-200px;line-height: 50px;height: 200px">' +
                '       <div class="layui-elip" style="line-height: 40px;float: left;width: 100%;background: #b2b2b2;opacity: 0.5;color: #ffffff;">'+
                (item.isprivate ? '<i class="layui-icon" style="color: #000000">&#xe8f5;</i>' :'<i class="layui-icon" style="color: #ffffff">&#xe8f4;</i>')+'&nbsp;'+
                '<a href="/html/love/show.html?id='+item.id+'" target="_blank">'+item.title+'</a>'+
                '</div>' +
                '       <div style="line-height: 40px;float: right;color: #ffffff;">'+
                '</div>' +
                '       <div class="shareAndGood" style="position:relative;bottom:-110px;margin-left:10px;float: left;width: 40px;height: 40px;line-height: 40px;text-align: center;border-radius: 20px;background: #b2b2b2;opacity: 0.5;color: #fefefe;display: none"><i class="layui-icon" style="color: #FF00FF;cursor: pointer;font-size: 25px;">&#xe87e;</i></div>' +
                (item.isprivate ? '':'<div class="shareAndGood" id="shareLove" data-id="'+item.id+'" style="position:relative;bottom:-110px;margin-right:10px;float: right;width: 40px;height: 40px;line-height: 40px;text-align: center;border-radius: 20px;background: #b2b2b2;opacity: 0.5;color: #fefefe;display: none"><i class="layui-icon" style="color: #ffffff;cursor: pointer;font-size: 25px;">&#xe992;</i></div>') +
                '   </div>' +
                '</li>';
            $("#story-newest-article2").append($li);
        });
    });*/

    $.get('/story/study/newest?pageNum=1&pageSize=6&catalog=0', function (res) {
        //假设你的列表返回在data集合中
        var head =
            '<div style="height: 40px;line-height: 40px;width: 99%;background: #f2f2f2;margin-top: 5px">' +
            '<div style="padding:0 15px;float:left;border: 1px solid #4285f4;line-height: 38px;border-radius: 4px;background: #4285f4;color: #fefefe">学而时习之</div>' +
            '<div style="padding:0 5px;float: right"><a href="http://www.story521.cn/html/study.html">更多</a></div>' +
            '</div>';
        $("#story-newest-article3").append(head);
        layui.each(res.data.list, function (index, d) {
            var html =
                '<li><div style="width: 99%;padding: 5px 0px 5px 0px;margin-bottom: 2px;background: #f7f7f8"><div style="background: #ffffff;padding: 0 0 0 5px;">' +
                '                                <p style="line-height: 40px;">' +
                '                                    <a>' +
                '                                        <img src="http://image.story521.cn/Frt9ieq0d-AISpl9aNErgyxSTL12"' +
                '                                             style="max-width: 30px;max-height: 30px;border-radius: 50%;border: none"/>' +
                '                                    </a>' +
                '&nbsp;&nbsp;&nbsp;&nbsp;' + d.author +
                '                                    <span style="color: #999">发表于 ' + zjoin.timetrans(d.createtime) + '</span>' +
                '                                    <span style="float: right;color: #999;padding: 0 5px;"><i class="layui-icon">&#xe8dc;</i></span>' +
                '                                </p>' +
                '                                <h1><a href="http://www.story521.cn/html/story/study/detail_study.html?id='+d.id+'" target="_blank">' + d.title + '</a></h1>' +
                '                                <p style="line-height: 25px;padding: 5px 3px;color: #999">' + d.describle + '</p>' +
                '                                <p style="color: #999；">' +
                '                                    <span style="line-height: 30px;text-align:center;border-radius: 5px;color: #f96f85;border: 1px solid #f96f85;">&nbsp;原创&nbsp;</span>' +
                '                                    &nbsp;&nbsp;' +
                '                                    <i class="layui-icon" style="font-size: 8px">&#xe061;</i>' +
                '                                    <span style="line-height: 30px;">阅读<span style="font-size: 12px">（' + d.browse + '）</span>&nbsp;&nbsp;</span>' +
                '                                    <i class="layui-icon" style="font-size: 8px">&#xe061;</i>' +
                '                                    <span style="line-height: 30px;">评论<span style="font-size: 12px">（' + d.pl + '）</span>&nbsp;&nbsp;</span>' +
                '                                    <i class="layui-icon" style="font-size: 8px">&#xe061;</i>' +
                '                                    <span style="line-height: 30px;">收藏<span style="font-size: 12px">（' + d.enshrine + '）</span></span>' +
                '                                </p>' +
                '                            </div></div>' +
                '                            </li>';
            $("#story-newest-article3").append(html);
        });
    });
    $.get('/story/maxCommentArticle',function (data) {
        if(data.code ==0){
            $("#newestComment").empty();
            layui.each(data.data, function(index, dd){
                var $li ='<li class="layui-elip">' +
                    '                            <p><a href="http://www.story521.cn/html/story/article/detail.html?id='+dd.id+'" target="_blank">'+dd.title+'</a></p>' +
                    '                            <div>' +
                    '                            <span><i class="layui-icon browse">&#xe91d;</i>&nbsp;'+dd.browse+'</span>&nbsp;&nbsp;&nbsp;' +
                    '                            <span><i class="layui-icon comment">&#xe998;</i>&nbsp;'+dd.totals+'</span>&nbsp;&nbsp;&nbsp;' +
                    '                            <span><i class="layui-icon author">&#xe7fd;</i>&nbsp;'+dd.author+'</span>&nbsp;&nbsp;' +
                    '                             </div>' +
                    '                        </li>';
                $("#newestComment").append($li);
            });
        }
    });
    $.get('/story/topBrowse',function (data) {
        if(data.code ==0){
            $("#newestArticle").empty();
            layui.each(data.data, function(index, dd){
            //for(var dd of data.data){
                var $li = $('<li><a href="http://www.story521.cn/html/story/article/detail.html?id='+dd.id+'" target="_blank">&nbsp;'+dd.title+'</a></li>');
                $("#newestArticle").append($li);
            });
        }
    });
    $.get('/story/maxDzArticle',function (data) {
        if(data.code ==0){
            $("#newestTalk").empty();
            layui.each(data.data, function(index, dd){
            //for(var dd of data.data){
                var $li ='<li>' +
                    '                            <p><a href="http://www.story521.cn/html/story/article/detail.html?id='+dd.id+'" target="_blank">'+dd.title+'</a></p>' +
                    '                            <div>' +
                    '                                <span><i class="layui-icon author">&#xe91f;</i>&nbsp;'+dd.author+'</span>&nbsp;&nbsp;&nbsp;' +
                    '                                <span><i class="layui-icon date">&#xe8b5;</i>&nbsp;'+zjoin.timeago(dd.createtime)+'</span>&nbsp;&nbsp;&nbsp;' +
                    '                                <span><i class="layui-icon good">&#xe87d;</i>&nbsp;'+dd.totals+'</span>&nbsp;&nbsp;' +
                    '                            </div>' +
                    '                        </li>';
                $("#newestTalk").append($li);
            });
        }
    });
    util.fixbar({
        bar1: true
        ,click: function(type){
            if(type === 'bar1'){

                window.location.href="http://www.story521.cn/html/story/index.html";
                // var nickname = $.cookie("nickname");
                /*if(nickname){

                }else {
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
                        }
                    });
                }*/

            }
        }
    });
    exports('index', {});
});

