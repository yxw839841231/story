layui.define(['layer', 'jquery','cookie','zjoin','flow'], function (exports) {
    var $ = layui.jquery,zjoin = layui.zjoin,flow=layui.flow;
    var id = getUrlParam("id");
    $.get("/story/article/detail?id=" + id, function (data) {
        document.title = data.data.title;
        var keywords = data.data.keywords.trim();
        keywords= keywords.replace(/ |,/g,",");
        document.querySelector('meta[name="keywords"]').setAttribute('content', keywords)
        document.querySelector('meta[name="description"]').setAttribute('content', data.data.describle.trim())
        $("#detail_title").html(data.data.title)
        $("#detail_content").html(data.data.content);
        $("#detail_author").html(data.data.author);
        $("#detail_time").html(zjoin.timetrans(data.data.createtime));
        $("#detail_browse").html(data.data.browse)
        $.get("/story/article/similar?catalog=" + data.data.catalog, function (data2) {
            layui.each(data2.data, function(index, dd){
            //for (var dd of data2.data) {
                var $li = ' <li>' +
                    '                            <p><a href='+dd.id+'"http://www.story521.cn/html/story/article/detail.html?id=" target="_blank">' + dd.title + '</a></p>' +
                    '                            <div>' +
                    '                                <span><i class="layui-icon browse">&#xe91d;</i>&nbsp;'+dd.browse+'</span>&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '                                <span><i class="layui-icon author">&#xe7fd;</i>&nbsp;'+dd.author+'</span>&nbsp;&nbsp;' +
                    '                            </div>' +
                    '                        </li>';
                $("#newestComment").append($li);
            });
        });
    });



    flow.load({
        elem: '#comment_list' //指定列表容器
        ,done: function(page, next){ //到达临界点（默认滚动触发），触发下一页
            var lis = [];
            //以jQuery的Ajax请求为例，请求下一页数据（注意：page是从2开始返回）
            $.get('/story/comment/list?pageCurrent='+page+'&articleid='+id+'&type=1', function(res){
                //假设你的列表返回在data集合中
                layui.each(res.data, function(index, dd){
                    var $li = '';
                    $li +='<li class="comment-li" >' +
                        '                                    <div class="comment-li-user">' +
                        '                                        <a class="" href="javascript:void(0)">' +
                        '                                            <img style=""src="'+dd.picture+'" />' +
                        '                                        </a>' +
                        '                                        <div class="comment-li-user-name" >' +
                        '                                            <a href="javascript:void(0)"> '+dd.nickname+'</a>' +
                        '                                        </div>' +
                        '                                        <div class="comment-li-user-time">' +
                        '                                            <span>'+zjoin.timeago(dd.createtime)+'</span>' +
                        '                                        </div>' +
                        '                                    </div>' +
                        '                                    <div class="comment-li-content">'+dd.content+'</div>' +
                        '                                    <div class="comment-li-foot">' +
                        '                                        <span class="good" data-id="'+dd.id+'"><i class="layui-icon">&#xe8dc;</i> <em class="dz">'+dd.dz+'</em> </span>' +
                        '                                        <span class="reply"> <i class="layui-icon">&#xeac9;</i> 回复 </span>' +
                        '                                    </div>' +
                        '                                </li>';
                    lis.push($li)
                });

                //执行下一页渲染，第二参数为：满足“加载更多”的条件，即后面仍有分页
                //pages为Ajax返回的总页数，只有当前页小于总页数的情况下，才会继续出现加载更多
                next(lis.join(''), page < res.pages);
            });
        }
    });

    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }

    $("#claer_comment").click(function () {
        $("#comment_edit").val('');
    });
    $("#submit_comment").click(function () {
        var comment = $("#comment_edit").val();
        var pat = new RegExp("[[^@#$%\\^&*()]+", "i");
        if (pat.test(comment) == true) {
            layer.msg("评论中含有非法字符！");
            return;

        } else if (comment == '') {
            return;
        }

        $.post("/story/comment/add", {articleid: id, content: comment,type:1}, function (data) {
            if (data.code == 0) {
                var $li = '';
                $li +='<li class="comment-li" >' +
                    '                                    <div class="comment-li-user">' +
                    '                                        <a class="" href="javascript:void(0)">' +
                    '                                            <img style=""src="'+$.cookie('picture')+'" />' +
                    '                                        </a>' +
                    '                                        <div class="comment-li-user-name" >' +
                    '                                            <a href="javascript:void(0)"> '+$.cookie('nickname')+'</a>' +
                    '                                        </div>' +
                    '                                        <div class="comment-li-user-time">' +
                    '                                            <span>刚刚</span>' +
                    '                                        </div>' +
                    '                                    </div>' +
                    '                                    <div class="comment-li-content">'+comment+'</div>' +
                    '                                    <div class="comment-li-foot">' +
                    '                                        <span class="good" ><i class="layui-icon">&#xe8dc;</i> <em >0</em> </span>' +
                    '                                        <span class="reply"> <i class="layui-icon">&#xeac9;</i> 回复 </span>' +
                    '                                    </div>' +
                    '                                </li>';
                $("#comment_list").append($li);
                $("#comment_edit").val('');
            }else {
                layer.err(data.msg)
            }
        })


    });
    $('body').delegate(".good", 'click', function () {
        var dz = $(this).find(".dz");
        $.ajax({
            url: '/story/comment/dz',
            dataType: 'json',
            type: 'POST',
            data: {
                id: $(this).attr("data-id")
            },
            success: function (d) {
                if (d.code == 0) {
                    dz.html(Number(dz.html())+1)
                    layer.ok("点赞成功！");
                }
            }
        });
    });
    exports('detail_article',{})
});