/* ========================================================================
 * B-JUI: bjui-plugins.js  V1.31
 * @author K'naan
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-plugins.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

layui.define('BJUIextends', function(exports){
    "use strict";
    var $ = layui.jquery,BJUI=layui.BJUIcore;


    $(document).on(BJUI.eventType.initUI, function(e) {
        var $box = $(e.target)


        /* i-check */
        if ($.fn.iCheck) {
            var $icheck = $box.find('input[data-toggle="icheck"]')

            $icheck.each(function (i) {
                var $element = $(this),
                    id = $element.attr('id'),
                    name = $element.attr('name'),
                    label = $element.data('label')

                if (label) $element.after('<label for="' + id + '" class="ilabel">' + label + '</label>')

                $element
                    .on('ifCreated', function (e) {
                        /* Fixed validate msgbox position */
                        var $parent = $(this).closest('div'),
                            $ilabel = $parent.next('[for="' + id + '"]')

                        $parent.attr('data-icheck', name)
                        $ilabel.attr('data-icheck', name)
                    })
                    .iCheck({
                        checkboxClass: 'icheckbox_minimal-purple datagrid-icheck',
                        radioClass: 'iradio_minimal-purple',
                        increaseArea: '20%' // optional
                    })
                    .on('ifChanged', function () {
                        $.fn.validator && $(this).trigger('validate')
                    })

                if ($element.prop('disabled')) $element.iCheck('disable')
            })
            /* i-check check all */
            $icheck.filter('.checkboxCtrl').on('ifChanged', function (e) {
                var checked = e.target.checked == true ? 'check' : 'uncheck'
                var group = $(this).data('group')

                $box.find(':checkbox[name="' + group + '"]').iCheck(checked)
            })
        }

        /* fixed ui style */
        $box.find('button').each(function () {
            var $element = $(this), icon = $element.attr('data-icon')
            $element.addClass('btn')
            if (icon && !$element.find('> i').length) {
                icon = '&#x' + icon
                if (!$element.data('bjui.icon')) {
                    $element.html('<i class="layui-icon">'+icon+'</i> ' + $element.html()).data('bjui.icon', true)
                }
            }
        })

        $box.find('input:text, input:password').each(function () {
            var $element = $(this).addClass('form-control').removeAttr('lay-verify'), size = $element.attr('size') || 0, width = size * 10
            if($element.parents('th').length>0){
                $element = $(this).addClass('zjoin-filter')
            }
            if($(this).hasClass('layui-btn-input')) $(this).css({'height':'30px'})
            width && $element.css('width', width)
        })

        $box.find('textarea').each(function () {
            var $element = $(this).addClass('form-control'), cols = $element.attr('cols') || 0, width = cols * 10, toggle = $element.attr('data-toggle')

            width && $element.css('width', width)

            if (toggle && toggle == 'autoheight' && $.fn.autosize)
                $element.addClass('autosize').autosize()
        })

        $box.find('a.btn').each(function () {
            var $element = $(this), icon = $element.data('icon')

            if (icon && !$element.find('> i').length) {
                icon = 'fa-' + icon.replace('fa-', '')

                if (!$element.data('bjui.icon')) {
                    $element.html('<i class="fa ' + icon + '"></i> ' + $element.html()).data('bjui.icon', true)
                }
            }
        })

        $box.find('.zjoin-filter').bind('focus',function(){
            var $this = $(this);
            if($this.attr('readonly')) return
            if(!$this.attr('filter-op')) $this.attr('filter-op','like')

            if( $this.parent('th').find('div').length>0){
                $this.parent('th').find('div').removeClass('layui-hide');
            }else{
                var zindex =3;
                var w = $this.width()+3,t = $this.offset().top+$this.height()+4,l=$this.offset().left;
                if(layer.zIndex) {
                    zindex=layer.zIndex+1;
                    var $l = layer.current()
                    if($l.length>0){
                        /*l = l -(window.innerWidth-$l.width())/2
                        t = t- (window.innerHeight -$l.height()-42-45)/2*/
                        l = l - $l.offset().left
                        t = t - $l.offset().top + 45
                    }
                }
                var $div = $('<div class="zjoin-filter-box" style="width:'+w+'px;top:'+t+'px;left: '+l+'px;z-index:'+zindex+';height: auto;"></div>');
                var $ul = $('<ul class="filter-ul"></ul>')
                $('<li filter-data = "like" class="selected">包含</li>').appendTo($ul);
                $('<li filter-data = "=">等于</li>').appendTo($ul);
                $('<li filter-data = ">">大于</li>').appendTo($ul);
                $('<li filter-data = "<">小于</li>').appendTo($ul);
                $ul.appendTo($div);
                $ul.find('li').bind('click',function () {
                    $ul.find('li').removeClass('selected')
                    $(this).addClass('selected');
                    $(this).parents('th').find('.zjoin-filter').attr('filter-op',$(this).attr('filter-data'))
                    $(this).parents('th').find('.zjoin-filter').change();
                })
                $this.after($div);
            }
        }).bind('blur',function () {
            var $this = $(this);
            setTimeout(function () {
                $this.parent('th').find('div').addClass('layui-hide');
            },150)
        });


        /* bootstrap - select */
        if ($.fn.selectpicker) {
            var $selectpicker = $box.find('select[data-toggle="selectpicker"]')
            var bjui_select_linkage = function ($obj, $next) {
                if (!$next || !$next.length) return

                var refurl = $obj.data('refurl')
                var _setEmpty = function ($select) {
                    var $_nextselect = $($select.data('nextselect'))

                    if ($_nextselect && $_nextselect.length) {
                        var emptytxt = $_nextselect.data('emptytxt') || '&nbsp;'

                        $_nextselect.html('<option>' + emptytxt + '</option>').selectpicker('refresh')
                        _setEmpty($_nextselect)
                    }
                }

                if (($next && $next.length) && refurl) {
                    var val = $obj.data('val'), nextVal = $next.data('val'), keys = $obj.data('keys')

                    if (keys && typeof keys === 'string')
                        keys = keys.toObj()
                    if (!keys)
                        keys = {}

                    if (typeof val === 'undefined') val = $obj.val()
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: refurl.replace('{value}', encodeURIComponent(val)),
                        cache: false,
                        data: {},
                        success: function (json) {
                            if (!json) return

                            var html = '', selected = ''

                            $.each(json, function (i) {
                                var value, label

                                if (json[i] && json[i].length) {
                                    value = json[i][0]
                                    label = json[i][1]
                                } else {
                                    value = json[i][keys.value || 'value']
                                    label = json[i][keys.label || 'label']
                                }
                                if (typeof nextVal !== 'undefined') selected = value == nextVal ? ' selected' : ''
                                html += '<option value="' + value + '"' + selected + '>' + label + '</option>'
                            })

                            $obj.removeAttr('data-val').removeData('val')
                            $next.removeAttr('data-val').removeData('val')

                            if (!html) {
                                html = $next.data('emptytxt') || '&nbsp;'
                                html = '<option>' + html + '</option>'
                            }

                            $next.html(html).selectpicker('refresh')
                            _setEmpty($next)
                        },
                        error: BJUI.ajaxError
                    })
                }
            }

            $selectpicker.each(function () {
                var $element = $(this)
                var options = $element.data()
                var $next = $(options.nextselect)

                $element.addClass('show-tick')
                if (!options.style) $element.data('style', 'btn-default')
                if (!options.width) $element.data('width', 'auto')
                if (!options.container) $element.data('container', 'body')
                else if (options.container == true) $element.attr('data-container', 'false').data('container', false)

                $element.selectpicker()

                if ($next && $next.length && (typeof $next.data('val') != 'undefined'))
                    bjui_select_linkage($element, $next)
            })

            /* bootstrap - select - linkage && Trigger validation */
            $selectpicker.change(function () {
                var $element = $(this)
                var $nextselect = $($element.data('nextselect'))

                bjui_select_linkage($element, $nextselect)

                /* Trigger validation */
                if ($element.attr('aria-required')) {
                    $.fn.validator && $element.trigger('validate')
                }
            })
        }
        if ($.fn.zTree) {
            /* zTree - plugin */
            $box.find('[data-toggle="ztree"]').each(function () {
                var $this = $(this),
                    op = $this.data(),
                    options = op.options, _setting;

                if (options && typeof options === 'string') options = options.toObj()
                if (options) $.extend(op, typeof options === 'object' && options)

                _setting = op.setting

                if (!op.nodes) {
                    op.nodes = []
                    $this.find('> li').each(function () {
                        var $li = $(this)
                        var node = $li.data()

                        if (node.pid) node.pId = node.pid
                        node.name = $li.html()
                        op.nodes.push(node)
                    })
                    $this.empty()
                } else {
                    if (typeof op.nodes === 'string') {
                        if (op.nodes.trim().startsWith('[') || op.nodes.trim().startsWith('{')) {
                            op.nodes = op.nodes.toObj()
                        }else {
                            op.nodes = op.nodes.toFunc()
                        }
                    }
                    if (typeof op.nodes === 'function') {
                        op.nodes = op.nodes.call(this)
                    }

                    $this.removeAttr('data-nodes')
                }

                if (!op.showRemoveBtn) op.showRemoveBtn = false
                if (!op.showRenameBtn) op.showRenameBtn = false
                if (op.addHoverDom && typeof op.addHoverDom !== 'function')       op.addHoverDom = (op.addHoverDom === 'edit') ? _addHoverDom : op.addHoverDom.toFunc()
                if (op.removeHoverDom && typeof op.removeHoverDom !== 'function') op.removeHoverDom = (op.removeHoverDom === 'edit') ? _removeHoverDom : op.removeHoverDom.toFunc()
                if (!op.maxAddLevel)   op.maxAddLevel = 2

                var setting = {
                    view: {
                        addHoverDom: op.addHoverDom || null,
                        removeHoverDom: op.removeHoverDom || null,
                        addDiyDom: op.addDiyDom ? op.addDiyDom.toFunc() : null
                    },
                    edit: {
                        enable: op.editEnable,
                        showRemoveBtn: op.showRemoveBtn,
                        showRenameBtn: op.showRenameBtn
                    },
                    check: {
                        enable: op.checkEnable,
                        chkStyle: op.chkStyle,
                        radioType: op.radioType
                    },
                    callback: {
                        onClick: op.onClick ? op.onClick.toFunc() : null,
                        beforeDrag: op.beforeDrag ? op.beforeDrag.toFunc() : _beforeDrag,
                        beforeDrop: op.beforeDrop ? op.beforeDrop.toFunc() : _beforeDrop,
                        onDrop: op.onDrop ? op.onDrop.toFunc() : null,
                        onCheck: op.onCheck ? op.onCheck.toFunc() : null,
                        beforeRemove: op.beforeRemove ? op.beforeRemove.toFunc() : null,
                        onRemove: op.onRemove ? op.onRemove.toFunc() : null,
                        onNodeCreated: _onNodeCreated,
                        onCollapse: _onCollapse,
                        onExpand: _onExpand
                    },
                    data: {
                        simpleData: {
                            enable: op.simpleData || true
                        },
                        key: {
                            title: op.title || ''
                        }
                    }
                }

                if (_setting && typeof _setting === 'string') _setting = _setting.toObj()
                if (_setting) $.extend(true, setting, typeof _setting === 'object' && _setting)

                $.fn.zTree.init($this, setting, op.nodes)

                var IDMark_A = '_a'
                var zTree = $.fn.zTree.getZTreeObj($this.attr('id'))

                if (op.expandAll) zTree.expandAll(true)

                // onCreated
                function _onNodeCreated(event, treeId, treeNode) {
                    if (treeNode.faicon) {
                        var $a = $('#' + treeNode.tId + '_a')

                        if (!$a.data('faicon')) {
                            $a.data('faicon', true)
                                .addClass('faicon')
                                .find('> span.button').append('<i class="fa fa-' + treeNode.faicon + '"></i>')
                        }
                    }
                    if (op.onNodeCreated) {
                        op.onNodeCreated.toFunc().call(this, event, treeId, treeNode)
                    }
                }

                // onCollapse
                function _onCollapse(event, treeId, treeNode) {
                    if (treeNode.faiconClose) {
                        $('#' + treeNode.tId + '_ico').find('> i').attr('class', 'fa fa-' + treeNode.faiconClose)
                    }

                    if (op.onCollapse) {
                        op.onCollapse.toFunc().call(this, event, treeId, treeNode)
                    }
                }

                // onExpand
                function _onExpand(event, treeId, treeNode) {
                    if (treeNode.faicon && treeNode.faiconClose) {
                        $('#' + treeNode.tId + '_ico').find('> i').attr('class', 'fa fa-' + treeNode.faicon)
                    }
                    if (op.onExpand) {
                        op.onExpand.toFunc().call(this, event, treeId, treeNode)
                    }
                }

                // add button, del button
                function _addHoverDom(treeId, treeNode) {
                    var level = treeNode.level
                    var $obj = $('#' + treeNode.tId + IDMark_A)
                    var $add = $('#diyBtn_add_' + treeNode.id)
                    var $del = $('#diyBtn_del_' + treeNode.id)

                    if (!$add.length) {
                        if (level < op.maxAddLevel) {
                            $add = $('<span class="tree_add" id="diyBtn_add_' + treeNode.id + '" title="添加"></span>')
                            $add.appendTo($obj);
                            $add.on('click', function () {
                                zTree.addNodes(treeNode, {name: '新增Item'})
                            })
                        }
                    }

                    if (!$del.length) {
                        return
                        var $del = $('<span class="tree_del" id="diyBtn_del_' + treeNode.id + '" title="删除"></span>')

                        $del
                            .appendTo($obj)
                            .on('click', function (event) {
                                    var delFn = function () {
                                        $del.alertmsg('confirm', '确认要删除 ' + treeNode.name + ' 吗？', {
                                            okCall: function () {
                                                zTree.removeNode(treeNode)
                                                if (op.onRemove) {
                                                    var fn = op.onRemove.toFunc()

                                                    if (fn) fn.call(this, event, treeId, treeNode)
                                                }
                                            },
                                            cancelCall: function () {
                                                return
                                            }
                                        })
                                    }

                                    if (op.beforeRemove) {
                                        var fn = op.beforeRemove.toFunc()

                                        if (fn) {
                                            var isdel = fn.call(fn, treeId, treeNode)

                                            if (isdel && isdel == true) delFn()
                                        }
                                    } else {
                                        delFn()
                                    }
                                }
                            )
                    }
                }

                // remove add button && del button
                function _removeHoverDom(treeId, treeNode) {
                    var $add = $('#diyBtn_add_' + treeNode.id)
                    var $del = $('#diyBtn_del_' + treeNode.id)

                    if ($add && $add.length) {
                        $add.off('click').remove()
                    }

                    if ($del && $del.length) {
                        $del.off('click').remove()
                    }
                }

                // Drag
                function _beforeDrag(treeId, treeNodes) {
                    for (var i = 0; i < treeNodes.length; i++) {
                        if (treeNodes[i].drag === false) {
                            return false
                        }
                    }
                    return true
                }

                function _beforeDrop(treeId, treeNodes, targetNode, moveType) {
                    return targetNode ? targetNode.drop !== false : true
                }
            })

            /* zTree - drop-down selector */

            var $selectzTree = $box.find('[data-toggle="selectztree"]')

            $selectzTree.each(function () {
                var $this = $(this)
                var options = $this.data(),
                    $tree = $(options.tree),
                    w = parseFloat($this.css('width')),
                    h = $this.outerHeight()

                options.width = options.width || $this.outerWidth()
                options.height = options.height || 'auto'

                if (!$tree || !$tree.length) return

                var treeid = $tree.attr('id')
                var $box = $('#' + treeid + '_select_box')
                var setPosition = function ($box) {
                    var top = $this.offset().top,
                        left = $this.offset().left,
                        $clone = $tree.clone().appendTo($('body')),
                        treeHeight = $clone.outerHeight()

                    $clone.remove()

                    var offsetBot = $(window).height() - treeHeight - top - h,
                        maxHeight = $(window).height() - top - h

                    if (options.height == 'auto' && offsetBot < 0) maxHeight = maxHeight + offsetBot
                    $box.css({top: (top + h), left: left, 'max-height': maxHeight})
                }

                $this.click(function () {
                    if ($box && $box.length) {
                        setPosition($box)
                        $box.show()
                        return
                    }

                    var zindex = 2
                    var dialog = $.CurrentDialog
                    if (dialog && dialog.length) {
                        zindex = dialog.css('zIndex') + 1
                    }
                    zindex= layer.zIndex+1
                    $box = $('<div id="' + treeid + '_select_box" class="tree-box"></div>')
                        .css({
                            position: 'absolute',
                            'zIndex': zindex,
                            'min-width': options.width,
                            height: options.height,
                            overflow: 'auto',
                            background: '#FAFAFA',
                            border: '1px #EEE solid'
                        })
                        .hide()
                        .appendTo($('body'))

                    $tree.appendTo($box).css('width', '100%').data('fromObj', $this).removeClass('hide').show()
                    setPosition($box)
                    $box.show()
                })

                $('body').on('mousedown', function (e) {
                    var $target = $(e.target)

                    if (!($this[0] == e.target || ($box && $box.length > 0 && $target.closest('.tree-box').length > 0))) {
                        $box.hide()
                    }
                })

                var $scroll = $this.closest('.bjui-pageContent')

                if ($scroll && $scroll.length) {
                    $scroll.scroll(function () {
                        if ($box && $box.length) {
                            setPosition($box)
                        }
                    })
                }

                //destroy selectzTree
                $this.on('destroy.bjui.selectztree', function () {
                    $box.remove()
                })
            })
        }


        /* tooltip */
        $box.find('[data-toggle="tooltip"]').each(function () {
            $(this).tooltip()
        })

        $box.find('[data-toggle="popover"]').each(function () {
            var $element = $(this), target = $element.data('target')

            if (target && $(target).length) {
                $element.attr('data-content', $(target).html())
            }

            $element.popover()
        })


        /* fixed dropdown-menu width */
        $box.find('[data-toggle="dropdown"]').parent().on('show.bs.dropdown', function (e) {
            var $this = $(this), width = $this.outerWidth(), $menu = $this.find('> .dropdown-menu'), menuWidth = $menu.outerWidth()

            if (width > menuWidth) {
                $menu.css('min-width', width)
            }
        })


    });
    exports('BJUIplugins');
});