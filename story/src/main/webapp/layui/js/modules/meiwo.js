/**
 项目JS主入口
 以依赖Layui的layer和form模块为例
 **/
layui.define(['layer','element','table','ZJOINdropdown','ZJOINselect','ZJOINboxrefresh','ZJOINwidget','ZJOINsidebar','ZJOINlayout','ZJOINpushmenu','ZJOINtodoList','ZJOINtree','ZJOINtheme'], function(exports){
    var element = layui.element ,$ = layui.jquery;
    var active = {
        tabAdd: function(elem){
            //新增一个Tab项
            element.tabAdd2('admin-tab', {
                title: elem.text()
                ,content: elem.attr('data-url')
                ,id: elem.attr('data-id') //实际使用一般是规定好的id，这里以时间戳模拟下
            })
        }
    };
    $(".sidebar-menuli").click(function(){
        var id = $(this).attr('data-id');
        if ( $(".layui-tab-title li[lay-id="+id+"]").length > 0 ) {
            element.tabChange('admin-tab',id);
        }else {
            active['tabAdd'].call($(this), $(this));
            element.tabChange('admin-tab',id);
        }
    });
    var h = window.innerHeight;
    h = h-31-41-50
   $(".layui-tab-content").css("height",h+'px');
    exports('meiwo', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});

