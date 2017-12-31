layui.define(['layer', 'jquery','cookie','zjoin','flow','code'], function (exports) {
    var $ = layui.jquery,zjoin = layui.zjoin,flow=layui.flow;
    layui.code({
            title: 'NotePad++的风格'
            ,skin: 'notepad' //如果要默认风格，不用设定该key。
            ,encode: true //是否转义html标签。默认不开启
         });
    var id = getUrlParam("id");
    $.get("/story/study/detail?id=" + id, function (data) {
        var detail = data.data.detail;
        document.title = detail.title;
        var keywords =detail.keywords.trim();
        keywords= keywords.replace(/ |,/g,",");
        document.querySelector('meta[name="keywords"]').setAttribute('content', keywords)
        document.querySelector('meta[name="description"]').setAttribute('content', detail.describle.trim())
        $("#detail_title2").html(detail.title)
        $("#detail_content").html(detail.content);
        $("#detail_author").html(detail.author);
        $("#detail_time").html(zjoin.timetrans(detail.createtime));
        $("#detail_browse").html(detail.browse);
        $("#detail_commen").html(detail.pl);
        var pn = data.data.pn;
        if(pn.prev){
            $("#study_prev").empty().append('<a href="http://www.story521.cn/story/study/detail?id='+pn.prev.id+'" target="_blank">'+pn.prev.title+'</a>');
        }
        if(pn.next){
            $("#study_next").empty().append('<a href="http://www.story521.cn/story/study/detail?id='+pn.next.id+'" target="_blank">'+pn.next.title+'</a>');
        }
        $.get("/story/study/similar?catalog=" + detail.catalog, function (data2) {
            layui.each(data2.data, function(index, dd){
            //for (var dd of data2.data) {
                var $li = ' <li><a href="http://www.story521.cn/html/story/study/detail_study.html?id=\'+d.id+\'" target="_blank"><i class="layui-icon" style="font-size: 3px;color: #9c9c9c">&#xe061;</i>'+dd.title+'</a></li>';
                $("#newestComment").append($li);
            });
        });

    });
    flow.load({
        elem: '#comment_list' //指定列表容器
        ,done: function(page, next){ //到达临界点（默认滚动触发），触发下一页
            var lis = [];
            //以jQuery的Ajax请求为例，请求下一页数据（注意：page是从2开始返回）
            $.get('/story/comment/list?pageCurrent='+page+'&articleid='+id+"&type=2", function(res){
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

        $.post("/story/comment/add", {articleid: id, content: comment,type:2}, function (data) {
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
    exports('detail_study',{})
});