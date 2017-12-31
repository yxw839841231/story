/**
 项目JS主入口
 以依赖Layui的layer和form模块为例
 **/
layui.define(['layer', 'zjoin', 'cookie', 'flow'], function (exports) {
    var $ = layui.jquery, flow = layui.flow;
    function loadData() {
        flow.load({
            elem: '#study_ul' //指定列表容器
            , done: function (page, next) { //到达临界点（默认滚动触发），触发下一页
                var lis = [];
                $.get('/story/study/newest?pageNum=' + page+"&catalog="+$(".study_label_this").attr("value"), function (res) {
                    //假设你的列表返回在data集合中
                    lis.push('<hr>');
                    layui.each(res.data.list, function (index, d) {
                        var html =
                            '<li><div style="width: 98%;padding: 10px 8px;">' +
                            '                                <p style="line-height: 40px;">' +
                            '                                    <a>' +
                            '                                        <img src="http://image.story521.cn/Frt9ieq0d-AISpl9aNErgyxSTL12"' +
                            '                                             style="max-width: 30px;max-height: 30px;border-radius: 50%;border: none"/>' +
                            '                                    </a>' +
                            '&nbsp;&nbsp;&nbsp;&nbsp;' + d.author +
                            '                                    <span style="color: #999">发表于 ' + zjoin.timetrans(d.createtime) + '</span>' +
                            '                                    <span style="float: right;color: #999"><i class="layui-icon">&#xe8dc;</i></span>' +
                            '                                </p>' +
                            '                                <h1><a href="http://www.story521.cn/html/story/study/detail_study.html?id='+d.id+'" target="_blank">' + d.title + '</a></h1>' +
                            '                                <p style="line-height: 25px;padding: 5px 3px;color: #999">' + d.describle + '</p>' +
                            '                                <p style="color: #999">' +
                            '                                    <span style="line-height: 30px;text-align:center;border-radius: 5px;color: #f96f85;border: 1px solid #f96f85;">&nbsp;原创&nbsp;</span>' +
                            '                                    &nbsp;&nbsp;' +
                            '                                    <i class="layui-icon" style="font-size: 8px">&#xe061;</i>' +
                            '                                    <span style="line-height: 30px;">阅读<span style="font-size: 12px">（' + d.browse + '）</span>&nbsp;&nbsp;</span>' +
                            '                                    <i class="layui-icon" style="font-size: 8px">&#xe061;</i>' +
                            '                                    <span style="line-height: 30px;">评论<span style="font-size: 12px">（' + d.pl + '）</span>&nbsp;&nbsp;</span>' +
                            '                                    <i class="layui-icon" style="font-size: 8px">&#xe061;</i>' +
                            '                                    <span style="line-height: 30px;">收藏<span style="font-size: 12px">（' + d.enshrine + '）</span></span>' +
                            '                                </p>' +
                            '                            </div>' +
                            '                            </li>';
                        lis.push(html);
                    });
                    next(lis.join(''), page < res.data.pages);
                });
            }
        });
    }

    loadData();

    $.ajax({
        url:'/story/study/top',
        type:'get',
        success:function(res){
            if(res.code==0){
                layui.each(res.data, function(index, d){
                    var html = '<a href="http://www.story521.cn/html/story/study/detail_study.html?id='+d.id+'" target="_blank">&nbsp;&nbsp;&nbsp;&nbsp;<li><i class="layui-icon" style="font-size: 3px;color: #9c9c9c">&#xe061;</i>&nbsp;&nbsp;'+d.title+'</li></a>';
                    $("#study_top").append(html);
                });
            }
        }
    });

    $(".study_label").click(function(){
        $(".study_label").removeClass("study_label_this");
        $(this).addClass("study_label_this");
        $("#study_ul").empty();
        loadData();
    });
    exports('study', {});
});

