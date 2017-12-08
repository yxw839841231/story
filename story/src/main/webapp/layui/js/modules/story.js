/**
 项目JS主入口
 以依赖Layui的layer和form模块为例
 **/
layui.define(['layer', 'element', 'table', 'zjoin', 'ZJOINdropdown', 'ZJOINselect', 'ZJOINsidebar', 'ZJOINpushmenu', 'ZJOINtodoList', 'ZJOINtree', 'ZJOINtheme', 'cookie','BJUIcore'], function (exports) {
    var element = layui.element,
        $ = layui.jquery,
        form = layui.form,
        layer = layui.layer;
    
    layer.config({
        extend: 'zjoin-skin/skin.css', //加载新皮肤
        skin: 'zjoin-skin' //一旦设定，所有弹层风格都采用此主题。
    })


    $.ajaxSetup({
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        complete: function (XMLHttpRequest, textStatus) {
            //通过XMLHttpRequest取得响应结果
            var res = XMLHttpRequest.responseText;
            try {
                var jsonData = JSON.parse(res);
                if (jsonData.code == -10000) {
                    //自定页
                    layer.open({
                        title:'用户登录',
                        type: 5,
                        closeBtn: 1, //不显示关闭按钮
                        area: ['500px', '300px'],
                        anim: 5,
                        shadeClose: true, //开启遮罩关闭
                        content:'/html/logina.html'
                        , btn: ['登录', '取消']
                        , yes: function (index, layero) {
                            //按钮【按钮一】的回调
                        }
                        , btn2: function (index, layero) {
                            window.location.href = '/html/login.html';
                            //return false 开启该代码可禁止点击该按钮关闭
                        }
                        , cancel: function () {
                            window.location.href = '/html/login.html';
                            //return false 开启该代码可禁止点击该按钮关闭
                        }
                    });
                }
            } catch (e) {
            }
        }
    });
    initrole();
    element.init();
    function initrole() {
        user_data = new Array();
        $.ajax({
            url: '/menu/list',
            type: 'get',
            success: function (d) {
                var $menuBar = $("#erp-menu");
                if (d.code == 0) {
                    //系统菜单
                    var $selectMenu = $("#top-erp-menu-bar");
                    var n = 0
                    for (var data of d.data.system) {
                        $.cookie(data.name, data.basepath, {path: '/'});
                        var html ='<div class="top-menu-bar '
                        if (n == 0){
                            html +=' zjoin-this" data-id='+data.id+'><i class="layui-icon">'+data.icon;
                        }else{
                            html +='" data-id='+data.id+'><i class="layui-icon">'+data.icon;
                        }
                        n ++
                        if(!layui.device().ios && !layui.device().android){
                            html +='</i><span class="menutitle">&nbsp;'+data.title+'</span></div>';
                        }else{
                            html +='</i></div>';
                        }
                        $selectMenu.append(html);

                    }
                    var treeviewData = [], treeviewMenuData = [], treeviewOpeData = [];
                    //菜单
                    for (var data of d.data.menu) {
                        if (data.type == 1) {
                            treeviewData.push(data);
                        }
                        if (data.type == 2) {
                            treeviewMenuData.push(data)
                        }
                        if (data.type == 3) {
                            treeviewOpeData.push(data)
                        }
                    }
                    window.user_data = treeviewOpeData;
                    $(".top-menu-bar").bind('click',function () {
                        $(".top-menu-bar").removeClass('zjoin-this');
                        $(this).addClass('zjoin-this');
                        var pid = $(this).attr('data-id');
                        $menuBar.find('.treeview').remove();
                        $menuBar.find('.sidebar-menuli').remove();
                        for (var data of treeviewData) {

                            if (data.systemid == pid) {
                                $menuBar.append('<li class="treeview treeview-' + data.systemid + '" ><a href="javascript:void(0)"><i class="layui-icon">'+data.icon+'</i>&nbsp;<span>' + data.name + '</span><span class="pull-right-container"></span> </a><ul class="treeview-menu" id="treeview-menu-' + data.id + '"> </ul></li>');
                            }
                        }
                        for (var data of treeviewMenuData) {
                            if (data.systemid == pid) {
                                $("#treeview-menu-" + data.pid).append('<li class="sidebar-menuli" data-url="' + data.uri + '" data-id="' + data.id + '"><a href="javascript:void(0)"><i class="layui-icon">'+data.icon+'</i>&nbsp;<span>' + data.name + '</span></a></li>');
                            }
                        }
                        $menuBar.find('.treeview :eq(0)').parent('li').addClass('menu-open active ').click();
                    });
                    $(".top-menu-bar:eq(0)").click();

                }

            }
        });
    }

    var active = {
        tabAdd: function (elem) {
            //新增一个Tab项
            element.tabAdd2('admin-tab', {
                title: elem.find('span').text()
                , content: elem.attr('data-url')
                , id: elem.attr('data-id') //实际使用一般是规定好的id，这里以时间戳模拟下
            })
        }
    };
    function addMainPage() {
        element.tabAdd2('admin-tab', {
            title: '主页'
            , content: '/html/admin/main.html'
            , id: -1 //实际使用一般是规定好的id，这里以时间戳模拟下
        })
        element.tabChange('admin-tab', -1);
    }
    addMainPage();

    $('body').delegate('.sidebar-menuli', 'click', function () {
        $('.treeview-menu li').removeClass('active')
        $('.sidebar-menuli').removeClass('active')
        $(this).addClass('active')
        $('.treeview').removeClass('active')
        $(this).parents('li').addClass('active')
        var id = $(this).attr('data-id');
        if ($(".layui-tab-title li[lay-id=" + id + "]").length > 0) {
            element.tabChange('admin-tab', id);
        } else {
            active['tabAdd'].call($(this), $(this));
            element.tabChange('admin-tab', id);
        }
    });
    fixWindow()
    function fixWindow() {
        var h = window.innerHeight,w = window.innerWidth;
        h = h - 40 - 50 - 41

        if($('body').hasClass('sidebar-collapse')) w = w-50
        else w = w-180
        $(".layui-tab-content").css({"height": h + 'px',"width":w+'px'});
        $(".admin-header.layui-tab").css({"width":w+'px'});
        $(".main-footer").css({"width":w+'px'});
        element.call.tabAuto()
    }
    $("#user-flowername").text($.cookie("flowerName"));
    $("#customer_timeout").click(function () {
        //退出登录
        $.ajax({
            url: '/story/user/logout',
            type: 'get',
            success: function (d) {
                if (d.code == 0) {
                    window.location.href = '/html/login.html';
                    localStorage.removeItem("timeNmu");
                } else {
                    layer.msg("退出失败", {icon: 5})
                }
            }
        });
    });
    var types = new Array();
    window.types = types;

    $(window).resize(function() {
        BJUI.initLayout()
        fixWindow()
        setTimeout(function() {$(this).trigger(BJUI.eventType.resizeGrid)}, 30)
    })

    exports('story', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});

