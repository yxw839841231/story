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
                //for (var d of data.data) {
                    $("#carousel-item1").append('<div class="carousel-item"><img src="' + d.picture + '"></div>');
                });
                carousel.render({
                    elem: '#test1'
                    , width: '100%' //设置容器宽度
                    , arrow: 'hover' //始终显示箭头
                    , anim: 'fade' //切换动画方式
                });
            }
        }
    });
    flow.load({
        elem: '#story-newest-article' //指定列表容器
        ,done: function(page, next){ //到达临界点（默认滚动触发），触发下一页
            var lis = [];
            //以jQuery的Ajax请求为例，请求下一页数据（注意：page是从2开始返回）
            $.get('/story/article/newest?pageNum='+page, function(res){
                //假设你的列表返回在data集合中
                layui.each(res.data.list, function(index, d){
                    var html = '';
                    html += '<li style="cursor:pointer;border-bottom: 1px dotted #f0f0f0" class="testli" dd="'+d.id+'"><a href="http://www.story521.cn/html/story/article/detail.html?id='+d.id+'" target="_blank">';
                    html += '    <h3 style="">' + d.title + '</h3>';
                    html += '    <div style="width: 15%;height: 110px;line-height: 110px;float: left">';
                    html += '        <img style="max-height: 100%;max-width: 100%;" lay-src="' + d.cover + '">';
                    html += '    </div>';
                    html += '    <div style="width:85%;height: 110px;float: right;">';
                    html += '       <div style="width:100%;height: 75px;line-height: 25px;padding:0 5px;overflow: hidden">'+ d.describle +'</div>';
                    html += '    <div style="width:100%;height: 35px;padding:0 5px;">';
                    html += '       <i class="layui-icon" style="color: #bec0ac">&#xe8f4;</i>' + d.browse;
                    html += '       <div style="display: inline-block;float: right;padding:0 5px;">时间：'+zjoin.timetrans(d.createtime)+'</div>';
                    html += '   </div>';
                    html += '</a> </li>';
                    lis.push(html);
                });
                next(lis.join(''), page < res.data.pages);
                flow.lazyimg();
            });
        }
    });
    $.get('/story/maxCommentArticle',function (data) {
        if(data.code ==0){
            $("#newestComment").empty();
            layui.each(data.data, function(index, dd){
            //for(var dd of data.data){
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
                var $li = $('<li><a href="/html/story/article/detail.html?id='+dd.id+'" target="_blank">&nbsp;'+dd.title+'</a></li>');
                $("#newestArticle").append($li);
            });
        }
    });
    $.get('/story/maxDzArticle',function (data) {
        if(data.code ==0){
            $("#newestTalk").empty();
            layui.each(data.data, function(index, dd){
            //for(var dd of data.data){
                var $li ='<li><p><a href="http://www.story521.cn/html/story/article/detail.html?id='+dd.id+'" target="_blank">'+dd.title+'</a></p>' +
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
                window.location.href="http://www.story521.cnstory/index.html";
            }
        }
    });
    exports('story', {});
});

