/**
 项目JS主入口
 以依赖Layui的layer和form模块为例
 **/
layui.define(['layer', 'form','element','table'], function(exports){
    var element = layui.element
        ,$ = layui.jquery
        ,table = layui.table
        ,layer = layui.layer
        ,form = layui.form;
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

    element.on('nav(admin)', function(elem){
        var id = elem.attr('data-id');
        if ( $(".layui-tab-title li[lay-id="+id+"]").length > 0 ) {
            element.tabChange('admin-tab',id);
        }else {
            active['tabAdd'].call(elem, elem);
            element.tabChange('admin-tab',id);
        }
    });
    $(".admin-left-nav").eq(0).click();
    exports('admin', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});

