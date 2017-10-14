/**

 @Name：layui.element 常用元素操作
 @Author：贤心
 @License：MIT

 */

layui.define(['jquery', 'context'], function (exports) {
    "use strict";

    var $ = layui.$
        , hint = layui.hint()
        , device = layui.device()
        , context = layui.context
        , MOD_NAME = 'element', THIS = 'layui-this', SHOW = 'layui-show'

        , Element = function () {
        this.config = {};
    };

    //全局设置
    Element.prototype.set = function (options) {
        var that = this;
        $.extend(true, that.config, options);
        return that;
    };

    //表单事件监听
    Element.prototype.on = function (events, callback) {
        return layui.onevent.call(this, MOD_NAME, events, callback);
    };

    //外部Tab新增
    Element.prototype.tabAdd = function (filter, options) {
        var TITLE = '.layui-tab-title'
            , tabElem = $('.layui-tab[lay-filter=' + filter + ']')
            , titElem = tabElem.children(TITLE)
            , contElem = tabElem.children('.layui-tab-content');
        titElem.append('<li lay-id="' + (options.id || '') + '">' + (options.title || 'unnaming') + '</li>');
        contElem.append('<div class="layui-tab-item">' + (options.content || '') + '</div>');
        call.hideTabMore(true);
        call.tabAuto();
        return this;
    };

    //外部Tab新增
    Element.prototype.tabAdd2 = function (filter, options) {
        var TITLE = '.layui-tab-title'
            , tabElem = $('.layui-tab[lay-filter=' + filter + ']')
            , titElem = tabElem.children(TITLE)
            , contElem = tabElem.siblings('.layui-tab-content');
        titElem.append('<li class="layui-context" lay-id="' + (options.id || '') + '">' + (options.title || 'unnaming') + '</li>');
        contElem.append('<div class="layui-tab-item" id="c_' + (options.id || '') + '"></div>');
        $('#c_' + options.id).load(options.content);
        call.hideTabMore(true);
        call.tabAuto();

        return this;
    };

    //外部Tab删除
    Element.prototype.tabDelete = function (filter, layid) {
        var TITLE = '.layui-tab-title'
            , tabElem = $('.layui-tab[lay-filter=' + filter + ']')
            , titElem = tabElem.children(TITLE)
            , liElem = titElem.find('>li[lay-id="' + layid + '"]');
        call.tabDelete(null, liElem);
        return this;
    };

    //外部Tab切换
    Element.prototype.tabChange = function (filter, layid) {
        var TITLE = '.layui-tab-title'
            , tabElem = $('.layui-tab[lay-filter=' + filter + ']')
            , titElem = tabElem.children(TITLE)
            , liElem = titElem.find('>li[lay-id="' + layid + '"]');
        call.tabClick(null, null, liElem);
        return this;
    };

    //动态改变进度条
    Element.prototype.progress = function (filter, percent) {
        var ELEM = 'layui-progress'
            , elem = $('.' + ELEM + '[lay-filter=' + filter + ']')
            , elemBar = elem.find('.' + ELEM + '-bar')
            , text = elemBar.find('.' + ELEM + '-text');
        elemBar.css('width', percent);
        text.text(percent);
        return this;
    };

    var NAV_ELEM = '.layui-nav', NAV_ITEM = 'layui-nav-item', NAV_BAR = 'layui-nav-bar'
        , NAV_TREE = 'layui-nav-tree', NAV_CHILD = 'layui-nav-child', NAV_MORE = 'layui-nav-more'
        , NAV_ANIM = 'layui-anim layui-anim-upbit'

        //基础事件体
        , call = {
            //Tab点击
            tabClick: function (e, index, liElem) {
                var othis = liElem || $(this)
                    , index = index || othis.parent().children('li').index(othis)
                    , parents = othis.parents('.layui-tab').eq(0)
                    , item = parents.children('.layui-tab-content').children('.layui-tab-item').length > 0 ? parents.children('.layui-tab-content').children('.layui-tab-item') : parents.siblings('.layui-tab-content').children('.layui-tab-item')
                    , elemA = othis.find('a')
                    , filter = parents.attr('lay-filter');

                if (!(elemA.attr('href') !== 'javascript:;' && elemA.attr('target') === '_blank')) {
                    othis.addClass(THIS).addClass("admin-this").siblings().removeClass(THIS).removeClass("admin-this");
                    item.eq(index).addClass(SHOW).siblings().removeClass(SHOW);
                }
                if(othis.parent('ul').hasClass('admin-tab-title')) {
                    var tw = 0;
                    othis.parent('ul').children('.layui-context').each(function () {
                        tw += $(this).width() + 30;//左右padding有15px
                    })
                    var titlewidth = othis.parents('div').eq(0).width()
                    if (tw > titlewidth) {
                        /**
                         * 第几个 * 平均宽度 - 一半的宽度 = 偏移量
                         */
                        var lo = titlewidth/2 - ((index+1)*(tw/othis.parent('ul').children('.layui-context').length)-($(this).width() + 30)/2)
                        lo = lo >0 ? 0:lo
                        lo = lo < titlewidth - tw ? titlewidth - tw : lo
                        othis.parent('ul').css('left', lo + 'px')
                    }
                }


                layui.event.call(this, MOD_NAME, 'tab(' + filter + ')', {
                    elem: parents
                    , index: index
                });
            }

            //Tab删除
            , tabDelete: function (e, othis) {
                var li = othis || $(this).parent(), index = li.index();
                var parents = li.parents('.layui-tab').eq(0);
                var item = parents.siblings('.layui-tab-content').children('.layui-tab-item')

                if (li.hasClass(THIS)) {
                    if (li.next()[0]) {
                        call.tabClick.call(li.next()[0], null, index + 1);
                    } else if (li.prev()[0]) {
                        call.tabClick.call(li.prev()[0], null, index - 1);
                    }
                }

                li.remove();
                item.eq(index).remove();
                setTimeout(function () {
                    call.tabAuto();
                }, 50);
            }

            //Tab自适应
            , tabAuto: function () {
                var  BAR = 'layui-tab-bar' , CLOSE = 'layui-tab-close', that = this;

                $('.layui-tab').each(function () {
                    var othis = $(this)
                        , title = othis.children('.layui-tab-title')
                        , menuHeader = title.parent('div')
                        , item = othis.children('.layui-tab-content').children('.layui-tab-item')
                        , span1 = $('<div class="layui-unselect layui-tab-bar layui-tab-bar1 skin-backcolor layui-hide"><i class="layui-icon skin-color">&#xe603;</i></div>')
                        , span2 = $('<div class="layui-unselect layui-tab-bar layui-tab-bar2 skin-backcolor layui-hide"><i class="layui-icon skin-color">&#xe602;</i></div>');

                    if (that === window && device.ie != 8) {
                        call.hideTabMore(true)
                    }

                    //允许关闭
                    if (othis.attr('lay-allowClose')) {
                        title.find('li').each(function () {
                            var li = $(this);
                            if (li.attr('lay-id') > 0) {
                                if (!li.find('.' + CLOSE)[0]) {
                                    var close = $('<i class="layui-icon layui-unselect ' + CLOSE + '">&#x1006;</i>');
                                    close.on('click', call.tabDelete);
                                    li.append(close);
                                }
                            }
                        });
                    }

                    if(title.hasClass('admin-tab-title')) {
                        //计算tab菜单总宽度
                        var tw = 0,index=0, i=0;
                        title.children('.layui-context').each(function () {
                            tw += $(this).width() + 30;
                            i++;
                            if($(this).hasClass('layui-this')) index = i;
                        })

                        //响应式
                        var titlewidth = menuHeader.width()
                        if (tw > titlewidth) {
                            if (menuHeader.find('.' + BAR).length > 0) menuHeader.find('.' + BAR).remove();
                            title.before(span1)
                            title.after(span2);
                            othis.attr('overflow', '');
                            span2.on('click', function () {
                                var lo = Number(title.css('left').replace('px', ''));
                                lo -= tw / title.children('.layui-context').length;
                                if (lo < titlewidth - tw) lo = titlewidth - tw
                                title.css('left', lo + 'px')
                            });
                            span1.on('click', function () {
                                var lo = Number(title.css('left').replace('px', ''));
                                lo += tw / title.children('.layui-context').length;
                                lo  = lo > 0 ? 0:lo;
                                title.css('left', lo + 'px')
                            });
                            menuHeader.on('mouseenter',function () {
                                $(this).find('.layui-tab-bar').removeClass('layui-hide')
                            }).on('mouseleave',function () {
                                $(this).find('.layui-tab-bar').addClass('layui-hide')
                            });

                            var lw = titlewidth/2 - ((index+1)*(tw/title.children('.layui-context').length)-(title.children('.layui-context').eq(index).width() + 30)/2)
                            lw = lw >0 ? 0:lw
                            lw = lw < titlewidth - tw ? titlewidth - tw : lw
                            title.css('left', lw + 'px')

                        } else {
                            menuHeader.find('.' + BAR).remove();
                            othis.removeAttr('overflow');
                            title.css('left', '0px')//重置定位
                        }
                    }
                });
            }
            //隐藏更多Tab
            , hideTabMore: function (e) {
                var tsbTitle = $('.layui-tab-title');
                if (e === true || $(e.target).attr('lay-stope') !== 'tabmore') {
                    tsbTitle.removeClass('layui-tab-more');
                    tsbTitle.find('.layui-tab-bar').attr('title', '');
                }
            }

            //点击选中
            , clickThis: function () {
                var othis = $(this), parents = othis.parents(NAV_ELEM)
                    , filter = parents.attr('lay-filter')
                    , elemA = othis.find('a');

                if (othis.find('.' + NAV_CHILD)[0]) return;

                if (!(elemA.attr('href') !== 'javascript:;' && elemA.attr('target') === '_blank')) {
                    parents.find('.' + THIS).removeClass(THIS);
                    othis.addClass(THIS);
                }

                layui.event.call(this, MOD_NAME, 'nav(' + filter + ')', othis);
            }
            //点击子菜单选中
            , clickChild: function () {
                var othis = $(this), parents = othis.parents(NAV_ELEM)
                    , filter = parents.attr('lay-filter');
                parents.find('.' + THIS).removeClass(THIS);
                othis.addClass(THIS);
                layui.event.call(this, MOD_NAME, 'nav(' + filter + ')', othis);
            }
            //展开二级菜单
            , showChild: function () {
                var othis = $(this), parents = othis.parents(NAV_ELEM);
                var parent = othis.parent(), child = othis.siblings('.' + NAV_CHILD);
                if (parents.hasClass(NAV_TREE)) {
                    child.removeClass(NAV_ANIM);
                    parent[child.css('display') === 'none' ? 'addClass' : 'removeClass'](NAV_ITEM + 'ed');
                }
            }

            //折叠面板
            , collapse: function () {
                var othis = $(this), icon = othis.find('.layui-colla-icon')
                    , elemCont = othis.siblings('.layui-colla-content')
                    , parents = othis.parents('.layui-collapse').eq(0)
                    , filter = parents.attr('lay-filter')
                    , isNone = elemCont.css('display') === 'none';
                //是否手风琴
                if (typeof parents.attr('lay-accordion') === 'string') {
                    var show = parents.children('.layui-colla-item').children('.' + SHOW);
                    show.siblings('.layui-colla-title').children('.layui-colla-icon').html('&#xe602;');
                    show.removeClass(SHOW);
                }
                elemCont[isNone ? 'addClass' : 'removeClass'](SHOW);
                icon.html(isNone ? '&#xe61a;' : '&#xe602;');

                layui.event.call(this, MOD_NAME, 'collapse(' + filter + ')', {
                    title: othis
                    , content: elemCont
                    , show: isNone
                });
            }
        };

    //初始化元素操作
    Element.prototype.init = function (type) {
        var that = this, items = {

            //Tab选项卡
            tab: function () {
                call.tabAuto.call({});
            }

            //导航菜单
            , nav: function () {
                var TIME = 200, timer = {}, timerMore = {}, timeEnd = {}, follow = function (bar, nav, index) {
                    var othis = $(this), child = othis.find('.' + NAV_CHILD);

                    if (nav.hasClass(NAV_TREE)) {
                        bar.css({
                            top: othis.position().top
                            , height: othis.children('a').height()
                            , opacity: 1
                        });
                    } else {
                        child.addClass(NAV_ANIM);
                        bar.css({
                            left: othis.position().left + parseFloat(othis.css('marginLeft'))
                            , top: othis.position().top + othis.height() - 5
                        });

                        timer[index] = setTimeout(function () {
                            bar.css({
                                width: othis.width()
                                , opacity: 1
                            });
                        }, device.ie && device.ie < 10 ? 0 : TIME);

                        clearTimeout(timeEnd[index]);
                        if (child.css('display') === 'block') {
                            clearTimeout(timerMore[index]);
                        }
                        timerMore[index] = setTimeout(function () {
                            child.addClass(SHOW)
                            othis.find('.' + NAV_MORE).addClass(NAV_MORE + 'd');
                        }, 300);
                    }
                }

                $(NAV_ELEM).each(function (index) {
                    var othis = $(this)
                        , bar = $('<span class="' + NAV_BAR + '"></span>')
                        , itemElem = othis.find('.' + NAV_ITEM);

                    //Hover滑动效果
                    if (!othis.find('.' + NAV_BAR)[0]) {
                        othis.append(bar);
                        itemElem.on('mouseenter', function () {
                            follow.call(this, bar, othis, index);
                        }).on('mouseleave', function () {
                            if (!othis.hasClass(NAV_TREE)) {
                                clearTimeout(timerMore[index]);
                                timerMore[index] = setTimeout(function () {
                                    othis.find('.' + NAV_CHILD).removeClass(SHOW);
                                    othis.find('.' + NAV_MORE).removeClass(NAV_MORE + 'd');
                                }, 300);
                            }
                        });
                        othis.on('mouseleave', function () {
                            clearTimeout(timer[index])
                            timeEnd[index] = setTimeout(function () {
                                if (othis.hasClass(NAV_TREE)) {
                                    bar.css({
                                        height: 0
                                        , top: bar.position().top + bar.height() / 2
                                        , opacity: 0
                                    });
                                } else {
                                    bar.css({
                                        width: 0
                                        , left: bar.position().left + bar.width() / 2
                                        , opacity: 0
                                    });
                                }
                            }, TIME);
                        });
                    }

                    itemElem.each(function () {
                        var oitem = $(this), child = oitem.find('.' + NAV_CHILD);

                        //二级菜单
                        if (child[0] && !oitem.find('.' + NAV_MORE)[0]) {
                            var one = oitem.children('a');
                            one.append('<span class="' + NAV_MORE + '"></span>');
                        }

                        oitem.off('click', call.clickThis).on('click', call.clickThis); //点击选中
                        oitem.children('a').off('click', call.showChild).on('click', call.showChild); //展开二级菜单
                        child.children('dd').off('click', call.clickChild).on('click', call.clickChild); //点击子菜单选中
                    });
                });
            }

            //面包屑
            , breadcrumb: function () {
                var ELEM = '.layui-breadcrumb';

                $(ELEM).each(function () {
                    var othis = $(this)
                        , separator = othis.attr('lay-separator') || '>'
                        , aNode = othis.find('a');
                    if (aNode.find('.layui-box')[0]) return;
                    aNode.each(function (index) {
                        if (index === aNode.length - 1) return;
                        $(this).append('<span class="layui-box">' + separator + '</span>');
                    });
                    othis.css('visibility', 'visible');
                });
            }

            //进度条
            , progress: function () {
                var ELEM = 'layui-progress';

                $('.' + ELEM).each(function () {
                    var othis = $(this)
                        , elemBar = othis.find('.layui-progress-bar')
                        , width = elemBar.attr('lay-percent');
                    elemBar.css('width', width);
                    if (othis.attr('lay-showPercent')) {
                        setTimeout(function () {
                            var percent = Math.round(elemBar.width() / othis.width() * 100);
                            if (percent > 100) percent = 100;
                            elemBar.html('<span class="' + ELEM + '-text">' + percent + '%</span>');
                        }, 350);
                    }
                });
            }

            //折叠面板
            , collapse: function () {
                var ELEM = 'layui-collapse';

                $('.' + ELEM).each(function () {
                    var elemItem = $(this).find('.layui-colla-item')
                    elemItem.each(function () {
                        var othis = $(this)
                            , elemTitle = othis.find('.layui-colla-title')
                            , elemCont = othis.find('.layui-colla-content')
                            , isNone = elemCont.css('display') === 'none';

                        //初始状态
                        elemTitle.find('.layui-colla-icon').remove();
                        elemTitle.append('<i class="layui-icon layui-colla-icon">' + (isNone ? '&#xe602;' : '&#xe61a;') + '</i>');

                        //点击标题
                        elemTitle.off('click', call.collapse).on('click', call.collapse);
                    });

                });
            }
        };

        return layui.each(items, function (index, item) {
            item();
        });
    };

    var element = new Element(), dom = $(document);
    element.init();
    context.init({preventDoubleContext: false});
    context.attach('.layui-context', [

        {
            text: '<i class="layui-icon">&#xe5d5;</i>&nbsp;刷新当前菜单', action: function (e) {
            var $li = $(".dropdown-menu").data().currentLayMenu;
            $('#c_' + $li.attr('lay-id')).load($('li[data-id=' + $li.attr("lay-id") + ']').attr('data-url'));
        }
        },
        {
            text: '<i class="layui-icon">&#xe5c9;</i>&nbsp;关闭当前菜单', action: function (e) {
            var $li = $(".dropdown-menu").data().currentLayMenu;
            if ($li.attr('lay-id') > 0) element.tabDelete($li.parents('.layui-tab').attr('lay-filter'), $li.attr('lay-id'));
        }
        },
        {
            text: '<i class="layui-icon">&#xe5cd;</i>&nbsp;关闭所有菜单', action: function (e) {
            var $li = $(".dropdown-menu").data().currentLayMenu;
            $li.parents('.layui-tab').find('li').each(function () {
                if ($(this).attr('lay-id') > 0)  element.tabDelete($(this).parents('.layui-tab').attr('lay-filter'), $(this).attr('lay-id'));
            });
        }
        },
        {
            text: '<i class="layui-icon">&#xea37;</i>&nbsp;关闭其他菜单', action: function (e) {
            var $li = $(".dropdown-menu").data().currentLayMenu;
            for (var i = 0; i < 100; i++) {
                if ($li.prev()) {
                    if ($li.prev().attr('lay-id') > 0) element.tabDelete($li.parents('.layui-tab').attr('lay-filter'), $li.prev().attr('lay-id'));
                }
                else i = 100;
            }
            for (var i = 0; i < 100; i++) {
                if ($li.next())element.tabDelete($li.parents('.layui-tab').attr('lay-filter'), $li.next().attr('lay-id'));
                else i = 100;
            }
        }
        }

    ]);


    var TITLE = '.layui-tab-title li';
    dom.on('click', TITLE, call.tabClick); //Tab切换
    dom.on('click', call.hideTabMore); //隐藏展开的Tab
    $(window).on('resize', call.tabAuto); //自适应
    element.call =call
    exports(MOD_NAME, element);
});

