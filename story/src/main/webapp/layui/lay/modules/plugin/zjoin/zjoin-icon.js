layui.define(['layer'], function (exports) {
    var layer = layui.layer,
        $ = layui.jquery,

        ZjoinIcon = function (options) {
            var that = this;
            that.init();
            return that;
        };
    ZjoinIcon.prototype.init = function () {
        var $dom = $(".zjoin-icon-pick");
        $dom.each(function () {
            var $v = $(this).val()
            if($v.startsWith("&#x")){
                var $i = $('<i class="layui-icon skin-color">'+$(this).val()+'</i>');
                $i.css({
                    left: ($(this).offset().left + $(this).width() - 26) + 'px',
                    top: $(this).offset().top + 'px',
                    position: 'fixed',
                    width: '38px',
                    height: '38px',
                    lineHeight: '38px',
                    textAlign: 'center',
                    background: '#d2d2d2'
                })
                $(this).nextAll().remove()
                $(this).after($i)
            }
        })
    }
    var icon = function () {
        var w= window.innerWidth*0.8,h = window.innerHeight*0.8;
        layer.open({
            type: 5,
            title: '图标拾取',
            area: [w+'px', h+'px'],
            content: '/layui/lay/modules/plugin/zjoin/icons.html',
            // btn: ['保存', '取消'],
            btnAlign: 'r',
            moveType: 1//拖拽模式，0或者1

        });
    }
    var dom = $(document);
    dom.on('click', '.zjoin-icon-pick', icon);
    exports('ZJOINicon',new ZjoinIcon()); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});
