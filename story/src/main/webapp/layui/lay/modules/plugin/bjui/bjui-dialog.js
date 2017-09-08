

/* ========================================================================
 * B-JUI: bjui-dialog.js  V1.31
 * @author K'naan
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-dialog.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
    // DIALOG GLOBAL ELEMENTS
    // ======================
    
    var $resizable
    var $current, shadow, zindex
    
    $(function() {
        var INIT_DIALOG = function() {
            $resizable = $('#bjui-resizable')
            shadow     = 'dialogShadow'
            zindex     = Dialog.ZINDEX
            
            $('body').append('<!-- dialog resizable -->').append(FRAG.resizable)
        }
        
        INIT_DIALOG()
    })
    
    // DIALOG CLASS DEFINITION
    // ======================
    var Dialog = function(options) {
        this.$element = $('body')
        this.options  = options
        this.tools    = this.TOOLS()
    }
    
    Dialog.DEFAULTS = {
        id          : null,
        title       : 'New Dialog',
        url         : null,
        type        : 'GET',
        data        : {},
        loadingmask : true,
        width       : 500,
        height      : 300,
        minW        : 65,
        minH        : 40,
        max         : false,
        mask        : false,
        resizable   : true,
        drawable    : true,
        maxable     : true,
        minable     : true,
        fresh       : false,
        onLoad      : null,
        beforeClose : null,
        onClose     : null
    }
    
    Dialog.ZINDEX = 30
    
    Dialog.prototype.TOOLS = function() {
        var that  = this
        var tools = {
            getDefaults: function() {
                return Dialog.DEFAULTS
            },
            init: function($dialog) {
                var width  = that.options.width > that.options.minW ? that.options.width : that.options.minW
                var height = that.options.height > that.options.minH ? that.options.height : that.options.minH
                var wW     = $(window).width(),
                    wH     = $(window).height(),
                    iTop   = that.options.max ? 0 : ((wH - height) / 3)
                
                if (width > wW)  width  = wW
                if (height > wH) height = wH
                
                $dialog
                    .height(height)
                    .width(width)
                    .show()
                    .css({left:(wW - width) / 2, top:0, opacity:0.1})
                    .animate({top:iTop > 0 ? iTop : 0, opacity:1})
                    .addClass(shadow)
                    .find('> .dialogContent').height(height - $('> .dialogHeader', $dialog).outerHeight())
                
                $('body').find('> .bjui-dialog-container').not($dialog).removeClass(shadow)
            },
            reload: function($dialog, options) {
                var tools = this, $dialogContent = $dialog.find('> .dialogContent'), onLoad, data = options && options.data, html
                
                options = options || $dialog.data('options')
                onLoad  = options.onLoad ? options.onLoad.toFunc() : null
                
                $dialog.trigger(BJUI.eventType.beforeLoadDialog)
                
                if (options.url) {
                    if (data) {
                        if (typeof data === 'string') {
                            if (data.trim().startsWith('{')) {
                                data = data.toObj()
                            } else {
                                data = data.toFunc()
                            }
                        }
                        if (typeof data === 'function') {
                            data = data.apply()
                        }
                    }
                    $dialogContent.ajaxUrl({
                        type:options.type || 'GET', url:options.url, data:data || {}, loadingmask:options.loadingmask, callback:function(response) {
                            if (onLoad) onLoad.apply(that, [$dialog])
                            if (BJUI.ui.clientPaging && $dialog.data('bjui.clientPaging')) $dialog.pagination('setPagingAndOrderby', $dialog)
                            
                            tools.resizeBjuiRow($dialog)
                        }
                    })
                } else {
                    if (options.image) {
                        html = '<img src="'+ decodeURIComponent(options.image) +'" style="max-width:100%;">'
                    } else if (options.html) {
                        html = options.html
                        if (typeof html === 'string' && $.isFunction(html.toFunc()))
                            html = html.toFunc()
                    } else if (options.target) {
                        html = $(options.target).html() || $dialog.data('bjui.dialog.target')
                        $(options.target).empty()
                        $dialog.data('bjui.dialog.target', html)
                    }
                    
                    $dialogContent.trigger(BJUI.eventType.beforeAjaxLoad).html(html).initui()
                    
                    if (onLoad) onLoad.apply(that, [$dialog])
                    
                    this.resizeBjuiRow($dialog)
                }
            },
            resizeContent: function($dialog) {
                var $dialogContent = $dialog.find('> .dialogContent')
                
                $dialogContent
                    .css({height:($dialog.height() - $dialog.find('> .dialogHeader').outerHeight())}) 
                
                $(window).trigger(BJUI.eventType.resizeGrid)
            },
            resizeBjuiRow: function($dialog) {
                var width = $dialog.width(), colWidth = BJUI.formColWidth
                
                $dialog.find('.bjui-row').each(function() {
                    var $rows = $(this)
                    
                    if (($rows.attr('class')).indexOf('col-') === -1) {
                        $rows.addClass('col-none')
                    }
                    
                    $rows.filter('.col-4')
                        .toggleClass('col-3', (width < colWidth.L && width > colWidth.M))
                        .end()
                        .filter('.col-3, .col-4')
                        .toggleClass('col-2', (width < colWidth.M && width > colWidth.S))
                        .end()
                        .filter('.col-2, .col-3, .col-4')
                        .toggleClass('col-1', (width < colWidth.S && width > colWidth.SS))
                        .end()
                        .filter('.col-none, .col-1, .col-2, .col-3, .col-4')
                        .toggleClass('col-0', (width < colWidth.SS))
                })
            }
        }
        
        return tools
    }
    
    Dialog.prototype.open = function() {
        var that    = this,
            options = that.options,
            $body   = $('body'),
            datas   = $body.data('bjui.dialog'),
            data    = datas[options.id],
            $dialog = data && data.dialog
            
        if (!(options.target || $(options.target).length) && !(options.html || options.image)) {
            if (!options.url && options.href) options.url = options.href
            if (!options.url) {
                BJUI.debug('BJUI.Dialog: Error trying to open a dialog, url is undefined!')
                return
            } else {
                options.url = decodeURI(options.url).replacePlh()
                
                if (!options.url.isFinishedTm()) {
                    BJUI.alertmsg('error', (options.warn || BJUI.regional.plhmsg))
                    BJUI.debug('BJUI.Dialog: The new dialog\'s url is incorrect, url: '+ options.url)
                    return
                }
                
                options.url = encodeURI(options.url)
            }
        } else {
            options.url = undefined
        }
        if ($dialog) { //if the dialog id already exists
            var op = $dialog.data('options')
            
            this.switchDialog($dialog)
            
            if ($dialog.is(':hidden')) $dialog.show()
            if (options.fresh || options.url != op.url) {
                that.reload(options)
            }
        } else { //open a new dialog
            var dr     = BJUI.regional.dialog,
                dialog = FRAG.dialog
                    .replace('#close#', dr.close)
                    .replace('#maximize#', dr.maximize)
                    .replace('#restore#', dr.restore)
                    .replace('#minimize#', dr.minimize)
                    .replace('#title#', dr.title)
            
            $dialog = $(dialog)
                .data('options', $.extend({}, options))
                .css('z-index', (++ zindex))
                .hide()
                .appendTo($body)
            
            $dialog.find('> .dialogHeader > h1 > span.title').html(options.title)
            
            this.tools.init($dialog)
            
            if (options.maxable) $dialog.find('a.maximize').show()
            else $dialog.find('a.maximize').hide()
            if (options.minable) $dialog.find('a.minimize').show()
            else $dialog.find('a.minimize').hide()
            if (options.max) that.maxsize($dialog)
            if (options.mask) this.addMask($dialog)
            else if (options.minable && $.fn.taskbar) this.$element.taskbar({id:options.id, title:options.title})
            
            $dialog.on('click', function(e) {
                if (!$(e.target).data('bjui.dialog'))
                    if ($current && $current[0] != $dialog[0]) that.switchDialog($dialog)
            }).on('click', '.btn-close', function(e) {
                that.close($dialog)
                
                e.preventDefault()
            }).on('click', '.dialogHeader > a', function(e) {
                var $a = $(this)
                
                if ($a.hasClass('close')) that.close($dialog)
                if ($a.hasClass('minimize')) {
                    that.minimize($dialog)
                }
                if ($a.hasClass('maximize')) {
                    that.switchDialog($dialog)
                    that.maxsize($dialog)
                }
                if ($a.hasClass('restore')) that.restore($dialog)
                
                e.preventDefault()
                e.stopPropagation()
            }).on('dblclick', '.dialogHeader > h1', function(e) {
                if (options.maxable) {
                    if ($dialog.find('> .dialogHeader > a.restore').is(':hidden')) $dialog.find('a.maximize').trigger('click')
                    else $dialog.find('> .dialogHeader > a.restore').trigger('click')
                }
            }).on('mousedown.bjui.dialog.drag', '.dialogHeader > h1', function(e) {
                that.switchDialog($dialog)
                
                if (!options.drawable || $dialog.data('max')) return
                
                $dialog.data('bjui.dialog.task', true)
                setTimeout($.proxy(function () {
                    if ($dialog.data('bjui.dialog.task')) that.drag(e, $dialog)
                }, that), 150)
                
                e.preventDefault()
            }).on('mouseup.bjui.dialog.drag', '.dialogHeader > h1', function(e) {
                $dialog.data('bjui.dialog.task', false)
            }).on('mousedown.bjui.dialog.resize', 'div[class^="resizable"]', function(e) {
                if (!options.drawable || $dialog.data('max')) return false
                if (!options.resizable) return false
                
                var $bar = $(this)
                
                that.switchDialog($dialog)
                that.resizeInit(e, $('#bjui-resizable'), $dialog, $bar)
                $bar.show()
                
                e.preventDefault()
            }).on('mouseup.bjui.dialog.resize', 'div[class^="resizable"]', function(e) {
                e.preventDefault()
            })
            
            data.dialog = $dialog
            this.tools.reload($dialog, options)
        }
        
        $.CurrentDialog = $current = $dialog
        
        // set current to body data
        datas.current = options.id
    }
    
    Dialog.prototype.addMask = function($dialog) {
        var $mask = $dialog.data('bjui.dialog.mask')
        
        $dialog.wrap('<div style="z-index:'+ zindex +'" class="bjui-dialog-wrap"></div>')
        $dialog.find('> .dialogHeader > a.minimize').hide()
        if (!$mask || !$mask.length) {
            $mask = $(FRAG.dialogMask)
            $mask.css('z-index', 1).show().insertBefore($dialog)
            $dialog.data('bjui.dialog.mask', $mask)
        }
    }
    
    Dialog.prototype.refresh = function(id) {
        if (id && typeof id === 'string') {
            var arr = id.split(','), datas = $('body').data('bjui.dialog')
            
            for (var i = 0; i < arr.length; i++) {
                var $dialog = datas && datas[arr[i].trim()] && datas[arr[i].trim()].dialog
                
                if ($dialog) {
                    $dialog.removeData('bjui.clientPaging')
                    this.tools.reload($dialog)
                }
            }
        } else {
            if ($current) {
                $current.removeData('bjui.clientPaging')
                this.tools.reload($current)
            }
        }
    }
    
    Dialog.prototype.resize = function($dialog, width, height) {
        var that = this, options, $dialogContent, ww = $(window).width(), hh = $(window).height()
        
        if (!$dialog) {
            $dialog = $current
        }
        
        options = $dialog.data('options')
        $dialogContent = $dialog.find('> .dialogContent')
        
        if (width != options.width) {
            if (width > ww)
                width = ww
            
            if (options.max) {
                $dialog.animate({ width:width, left:(ww - width)/2 }, 'normal')
            } else {
                $dialog.width(width).css('left', (ww - width)/2)
            }
            
            options.width = width
        }
        if (height != options.height) {
            var itop = 0
            
            if (height < hh)
                itop = (hh - height) / 2 - 20
            if (itop < 0)
                itop = 0
            
            if (options.max) {
                $dialog.animate({ height:height, top:itop }, 'normal', function() {
                    $dialogContent.height(height - $dialog.find('> .dialogHeader').outerHeight())
                })
            } else {
                $dialog.height(height).css('top', itop)
                $dialogContent.height(height - $dialog.find('> .dialogHeader').outerHeight())
            }
            
            options.height = height
        }
    }
    
    Dialog.prototype.reload = function(option) {
        var that     = this,
            options  = $.extend({}, typeof option === 'object' && option),
            datas    = $('body').data('bjui.dialog'),
            $dialog  = (options.id && datas[options.id] && datas[options.id].dialog) || that.getCurrent()
        
        if ($dialog && $dialog.length) {
            var op = $dialog.data('options')
            
            options = $.extend({}, op, options)
            
            var _reload = function() {
                var $dialogContent = $dialog.find('> .dialogContent'), ww = $(window).width(), hh = $(window).height(), w = options.width, h = options.height
                
                if (w != op.width) {
                    if (w > ww)
                        w = ww
                    
                    if (options.max) {
                        $dialog.animate({ width:w, left:(ww - w)/2 }, 'normal'/*, function() { $dialogContent.width(options.width) }*/)
                    } else {
                        $dialog.width(w).css('left', (ww - w)/2)
                    }
                }
                if (h != op.height) {
                    var itop = 0
                    
                    if (h < hh)
                        itop = (hh - h) / 2 - 20
                    if (itop < 0)
                        itop = 0
                    
                    if (options.max) {
                        $dialog.animate({ height:h, top:itop }, 'normal', function() {
                            $dialogContent.height(h - $dialog.find('> .dialogHeader').outerHeight())
                        })
                    } else {
                        $dialog.height(h).css('top', itop)
                        $dialogContent.height(h - $dialog.find('> .dialogHeader').outerHeight())
                    }
                }
                if (options.maxable != op.maxable) {
                    if (options.maxable) $dialog.find('a.maximize').show()
                    else $dialog.find('a.maximize').hide()
                } 
                if (options.minable != op.minable) {
                    if (options.minable) $dialog.find('a.minimize').show()
                    else $dialog.find('a.minimize').hide()
                }
                if (options.max != op.max)
                    if (options.max)
                        setTimeout(that.maxsize($dialog), 10)
                if (options.mask != op.mask) {
                    if (options.mask) {
                        that.addMask($dialog)
                        if ($.fn.taskbar) that.$element.taskbar('closeDialog', options.id)
                    } else if (options.minable && $.fn.taskbar) {
                        that.$element.taskbar({id:options.id, title:options.title})
                    }
                }
                if (options.title != op.title) {
                    $dialog.find('> .dialogHeader > h1 > span.title').html(options.title)
                    $dialog.taskbar('changeTitle', options.id, options.title)
                }
                
                $dialog.data('options', $.extend({}, options))
                
                that.tools.reload($dialog, options)
            }
            
            if (options.reloadWarn) {
                $dialog.alertmsg('confirm', options.reloadWarn, {
                    okCall: function() {
                        _reload()
                    }
                })
            } else {
                _reload()
            }
        }
    }
    
    Dialog.prototype.reloadForm = function(clearQuery, option) {
        var options = $.extend({}, typeof option === 'object' && option),
            datas   = $('body').data('bjui.dialog'),
            $dialog
        
        if (options.id) {
            if (datas && datas[options.id])
                $dialog = datas[options.id].dialog
        } else {
            $dialog = $current
        }
        
        if ($dialog) {
            var op         = $dialog.data('options'),
                data       = {},
                pageData   = {},
                $pagerForm = options.form
            
            if ($pagerForm && $pagerForm.length) {
                options.type = options.type || $pagerForm.attr('method') || 'POST'
                options.url  = options.url || $pagerForm.attr('action')
                
                pageData = $pagerForm.serializeJson()
                
                if (clearQuery) {
                    var pageInfo = BJUI.pageInfo
                    
                    for (var key in pageInfo) {
                        data[pageInfo[key]] = pageData[pageInfo[key]]
                    }
                } else {
                    data = pageData
                }
            }
            
            options.data = $.extend({}, options.data || {}, data)
            
            this.tools.reload($dialog, options)
        }
    }
    
    Dialog.prototype.getCurrent = function() {
        return $current
    }
    
    Dialog.prototype.switchDialog = function($dialog) {
        var index = $dialog.css('z-index')
        
        if ($current && $current != $dialog) {
            var cindex = $current.css('z-index'),
                datas  = $('body').data('bjui.dialog'),
                pindex
            
            if ($current.data('options').mask) {
                pindex = $current.parent().css('z-index')
                
                if (Number(pindex) > Number(index))
                    return
            }
            
            $current.css('z-index', index)
            $dialog.css('z-index', cindex)
            $.CurrentDialog = $current = $dialog
            
            // set current to body data
            datas.current = $dialog.data('options').id
            
            if ($.fn.taskbar) this.$element.taskbar('switchTask', datas.current)
        }
        
        $dialog.addClass(shadow)
        $('body').find('> .bjui-dialog-container, > .bjui-dialog-wrap > .bjui-dialog-container').not($dialog).removeClass(shadow)
    }
    
    Dialog.prototype.close = function(dialog) {
        var datas = $('body').data('bjui.dialog'), $dialog = (typeof dialog === 'string') ? datas[dialog].dialog : dialog
        
        if (!$dialog || !$dialog.length) {
            return
        }
        
        var that        = this,
            $mask       = $dialog.data('bjui.dialog.mask'),
            options     = $dialog.data('options'),
            target      = $dialog.data('bjui.dialog.target'),
            beforeClose = options.beforeClose ? options.beforeClose.toFunc() : null,
            onClose     = options.onClose ? options.onClose.toFunc() : null,
            canClose    = true,
            closeFunc   = function() {
                delete datas[options.id]
                
                if (onClose) onClose.apply(that)
                
                $.CurrentDialog = $current = null
                
                var $dialogs  = $('body').find('.bjui-dialog-container'),
                $_current = null
                
                if ($dialogs.length) {
                    $_current = that.$element.getMaxIndexObj($dialogs)
                } else {
                    zindex = Dialog.ZINDEX
                }
                if ($_current && $_current.is(':visible')) {
                    $.CurrentDialog = $current = $_current
                    that.switchDialog($_current)
                }
            }
        
        if (!$dialog || !options) return
        if (beforeClose) canClose = beforeClose.apply(that, [$dialog])
        if (!canClose) {
            that.switchDialog($dialog)
            return
        }
        if (options.target && target) $(options.target).html(target) 
        if ($mask && $mask.length) {
            $mask.remove()
            $dialog.unwrap()
        } else if ($.fn.taskbar) {
            this.$element.taskbar('closeDialog', options.id)
        }
        
        if (options.noanimate) {
            $dialog.trigger(BJUI.eventType.beforeCloseDialog).remove()
            closeFunc()
        } else {
            $dialog.animate({top:- $dialog.outerHeight(), opacity:0.1}, 'normal', function() {
                $dialog.trigger(BJUI.eventType.beforeCloseDialog).remove()
                closeFunc()
            })
        }
    }
    
    Dialog.prototype.closeCurrent = function() {
        this.close($current)
    }
    
    Dialog.prototype.checkTimeout = function() {
        var $dialogConetnt = $current.find('> .dialogContent'),
            json = JSON.parse($dialogConetnt.html())
        
        if (json && json[BJUI.keys.statusCode] == BJUI.statusCode.timeout) this.closeCurrent()
    }
    
    Dialog.prototype.maxsize = function($dialog) {
        var $taskbar = $('#bjui-taskbar'), taskH = ($taskbar.is(':visible') ? $taskbar.height() : 0) + 1
        
        $dialog.data('original', {
            top   : $dialog.css('top'),
            left  : $dialog.css('left'),
            width : $dialog.css('width'),
            height: $dialog.css('height')
        }).data('max', true)
        
        $dialog.find('> .dialogHeader > a.maximize').hide()
        $dialog.find('> .dialogHeader > a.restore').show()
        
        var iContentW = $(window).width() - 1,
            iContentH = $(window).height() - taskH
        
        $dialog.css({ top:0, right:0, left:0, bottom:taskH, width:'100%', height:'auto'})
        
        this.tools.resizeContent($dialog)
        this.tools.resizeBjuiRow($dialog)
    }
    
    Dialog.prototype.restore = function($dialog) {
        var original = $dialog.data('original'),
            dwidth   = original.width,
            dheight  = original.height
        
        $dialog.css({
            top   : original.top,
            right : '',
            bottom: '',
            left  : original.left,
            width : dwidth,
            height: dheight
        })
        
        this.tools.resizeContent($dialog)
        this.tools.resizeBjuiRow($dialog)
        
        $dialog.find('> .dialogHeader > a.maximize').show()
        $dialog.find('> .dialogHeader > a.restore').hide()
        $dialog.data('max', false)
    }
    
    Dialog.prototype.minimize = function($dialog) {
        $dialog.hide()
        if ($.fn.taskbar) this.$element.taskbar('minimize', $dialog)
        
        var $dialogs  = $('body').find('.bjui-dialog-container:visible'),
            $_current = null
        
        if ($dialogs.length) {
            $_current = this.$element.getMaxIndexObj($dialogs)
        }
        if ($_current) this.switchDialog($_current)
    }
    
    Dialog.prototype.drag = function(e, $dialog) {
        var $shadow = $('#bjui-dialogProxy')
        
        $dialog.find('> .dialogContent').css('opacity', '.3')
        $dialog.basedrag({
            selector : '> .dialogHeader',
            stop     : function() {
                $dialog
                    .css({left:$dialog.css('left'), top:$dialog.css('top')})
                    .find('> .dialogContent').css('opacity', 1)
            },
            event    : e,
            nounbind : true
        })
    }
    
    Dialog.prototype.resizeDialog = function($resizable, $dialog, target) {
        var oleft  = parseInt($resizable.css('left'), 10),
            otop   = parseInt($resizable.css('top'), 10),
            height = parseInt($resizable.css('height'), 10),
            width  = parseInt($resizable.css('width'), 10)
        
        if (otop < 0) otop = 0
        
        $dialog.css({top:otop, left:oleft, width:width, height:height})
        
        if (target != 'w' && target != 'e')
            this.tools.resizeContent($dialog)
        if (target != 'n' && target != 's') {
            this.tools.resizeBjuiRow($dialog)
            $(window).trigger(BJUI.eventType.resizeGrid)
        }
    }
    
    Dialog.prototype.resizeInit = function(e, $resizable, $dialog, $bar) {
        var that = this, target = $bar.attr('tar')
        
        $('body').css('cursor', target +'-resize')
        $resizable
            .css({
                top    : $dialog.css('top'),
                left   : $dialog.css('left'),
                height : $dialog.outerHeight(),
                width  : $dialog.css('width')
            })
            .show()
        
        if (!this.options.dragCurrent) {
            this.options.dragCurrent = {
                $resizable : $resizable,
                $dialog    : $dialog,
                target     : target,
                oleft      : parseInt($resizable.css('left'), 10)   || 0,
                owidth     : parseInt($resizable.css('width'), 10)  || 0,
                otop       : parseInt($resizable.css('top'), 10)    || 0,
                oheight    : parseInt($resizable.css('height'), 10) || 0,
                ox         : e.pageX || e.screenX,
                oy         : e.pageY || e.clientY
            }
            $(document).on('mouseup.bjui.dialog.resize', $.proxy(that.resizeStop, that))
            $(document).on('mousemove.bjui.dialog.resize', $.proxy(that.resizeStart, that))
        }
    }
    
    Dialog.prototype.resizeStart = function(e) {
        var current = this.options.dragCurrent
        
        if (!current) return
        if (!e) var e = window.event
        
        var lmove     = (e.pageX || e.screenX) - current.ox,
            tmove     = (e.pageY || e.clientY) - current.oy,
            $mask = current.$dialog.data('bjui.dialog.mask')
        
        if (!$mask || !$mask.length)
            if ((e.pageY || e.clientY) <= 0 || (e.pageY || e.clientY) >= ($(window).height() - current.$dialog.find('> .dialogHeader').outerHeight())) return
        
        var target = current.target,
            width  = current.owidth,
            height = current.oheight
        
        if (target != 'n' && target != 's')
            width += (target.indexOf('w') >= 0) ? -lmove : lmove
        if (width >= this.options.minW) {
            if (target.indexOf('w') >= 0)
                current.$resizable.css('left', (current.oleft + lmove))
            if (target != 'n' && target != 's')
                current.$resizable.css('width', width)
        }
        if (target != 'w' && target != 'e')
            height += (target.indexOf('n') >= 0) ? -tmove : tmove
        if (height >= this.options.minH) {
            if (target.indexOf('n') >= 0)
                current.$resizable.css('top', (current.otop + tmove))
            if (target != 'w' && target != 'e')
                current.$resizable.css('height', height)
        }
    }
    
    Dialog.prototype.resizeStop = function(e) {
        var current = this.options.dragCurrent
        
        if (!current) return false
        
        $(document).off('mouseup.bjui.dialog.resize').off('mousemove.bjui.dialog.resize')
        
        this.options.dragCurrent = null
        this.resizeDialog(current.$resizable, current.$dialog, current.target)
        
        $('body').css('cursor', '')
        current.$resizable.hide()
    }
    
    // DIALOG PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args     = arguments,
            property = option,
            dialog   = 'bjui.dialog',
            $body    = $('body'),
            datas    = $body.data(dialog) || {}
        
        return this.each(function () {
            var $this   = $(this),
                options = $.extend({}, Dialog.DEFAULTS, typeof option === 'object' && option),
                id      = options && options.id,
                data
            
            if (!id) {
                if (datas.current) id = datas.current
                else id = 'dialog'
            } else {
                if (!id.isNormalID()) {
                    BJUI.debug('BJUI.Dialog: ID ['+ id +'] '+ BJUI.regional.idChecked)
                    
                    return
                }
            }
            
            options.id = id
            data = datas && datas[id]
            
            if (!data) {
                datas[id] = (data = new Dialog(options))
            } else {
                if (typeof option === 'object' && option)
                    $.extend(data.options, option)
            }
            
            $body.data(dialog, datas)
            
            if (typeof property === 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                data.open()
            }
        })
    }
    
    var old = $.fn.dialog
    
    $.fn.dialog             = Plugin
    $.fn.dialog.Constructor = Dialog
    
    // DIALOG NO CONFLICT
    // =================
    
    $.fn.dialog.noConflict = function () {
        $.fn.dialog = old
        return this
    }
    
    // NOT SELECTOR
    // ==============
    
    BJUI.dialog = function() {
        Plugin.apply($('body'), arguments)
    }
    
    // DIALOG DATA-API
    // ==============
    
    $(document).on('click.bjui.dialog.data-api', '[data-toggle="dialog"]', function(e) {
        var $this   = $(this), href = $this.attr('href'), data = $this.data(), options = data.options
        
        if (options) {
            if (typeof options === 'string') options = options.toObj()
            if (typeof options === 'object')
                $.extend(data, options)
        }
        
        if (!data.title) data.title = $this.text()
        if (href && !data.url) data.url = href
        
        Plugin.call($this, data)
        
        e.preventDefault()
    })
    
}(jQuery);