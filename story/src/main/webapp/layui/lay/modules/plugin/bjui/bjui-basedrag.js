
/* ========================================================================
 * B-JUI: bjui-basedrag.js  V1.31
 * @author K'naan
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-basedrag.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

layui.define('BJUIextends', function(exports){
    "use strict";
    var $ = layui.BJUIextends,BJUI=layui.BJUIcore;

    // BASEDRAG CLASS DEFINITION
    // ======================
    
    var Basedrag = function(element, options) {
        this.$element = $(element)
        this.options  = options
        this.tools    = this.TOOLS()
    }
    
    Basedrag.prototype.TOOLS = function() {
        var tools = {
            isOver: function($drop, x, y) {
                var offset = $drop.offset(),
                    left   = offset.left,
                    top    = offset.top,
                    width  = $drop.outerWidth(),
                    height = $drop.outerHeight()
                
                return (x > left && x < (left + width)) && (y > top && y < (top + height))
            },
            mouseDirection: function (element, opts) {
                var $element = $(element), dirs = ['top', 'right', 'bottom', 'left']
                var calculate = function (e) {
                    var w = $element.outerWidth(),
                        h = $element.outerHeight(),
                        offset = $element.offset(),
                        x = (e.pageX - offset.left - (w / 2)) * (w > h ? (h / w) : 1),
                        y = (e.pageY - offset.top - (h / 2)) * (h > w ? (w / h) : 1)
                    
                    return Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4
                }
                
                //enter leave代表鼠标移入移出时的回调
                opts = $.extend({}, {
                    move: $.noop
                }, opts || {})
                
                var r = calculate(opts.e)
                
                opts.move($element, dirs[r])
            }
        }
        
        return tools
    }
    
    Basedrag.prototype.init = function() {
        var that = this
        
        that.$drag = this.$element
        that.options.$obj = this.$element
        if (that.options.obj) this.options.$obj = this.options.obj
        if (that.options.event) {
            that.hasEvent = true
            that.start(this.options.event)
        } else {
            if (that.options.selector)
                that.$drag = that.$element.find(that.options.selector)
                
            if (that.$drag.length) {
                that.$drag.on('mousedown', function(e) {
                    that.start.apply(that, [e])
                    that.options.event = e
                })
            }
        }
    }
    
    Basedrag.prototype.start = function(e) {
        $(document).on('selectstart', false)
        var that = this, options = that.options
        
        if (options.exclude) {
            var $exclude = that.$element.find(options.exclude)
            
            if ($exclude.length && $.inArray(e.target, $exclude.add($exclude.find('*'))) != -1) {
                return false
            }
        }
        
        if (this.$element.css('position') === 'static') {
            this.$element.css('position', 'absolute')
            !options.oleft && (options.oleft = this.$element.position().left)
            !options.otop  && (options.otop  = this.$element.position().top)
            this.$element.css('position', '')
        }
        if (!options.oleft) options.oleft = parseInt(this.$element.css('left')) || 0
        if (!options.otop)  options.otop  = parseInt(this.$element.css('top')) || 0
        
        $(document)
            .on('mouseup.bjui.basedrag', function(e) { that.stop.apply(that, [e]) })
            .on('mousemove.bjui.basedrag', function(e) { that.drag.apply(that, [e]) })
    }
    
    Basedrag.prototype.drop = function(e) {
        var that = this, options = that.options, $drop = options.drop
        
        if (!$drop instanceof jQuery)
            $drop = $($drop)
        
        if ($drop.length) {
            that.$drops = $drop
            $drop.each(function() {
                if (that.tools.isOver($(this), e.pageX, e.pageY)) {
                    $(this).trigger('dropover.bjui.basedrag', [e.pageX, e.pageY, that.$element])
                    
                    that.isDrop = true
                    that.$drop  = $(this)
                    
                    return false
                } else {
                    $(this).trigger('dropout.bjui.basedrag', [e.pageX, e.pageY, that.$element])
                    that.isDrop = false
                }
            }).css('-moz-user-select', 'none')
        }
    }
    
    Basedrag.prototype.drag = function(e) {
        if (!e) e = window.event
        
        BJUI['bjui.basedrag'] = this.$element
        
        var that       = this,
            options    = this.options,
            beforeDrag = options.beforeDrag,
            trData     = options.treeData,      // only for drop Datagrid
            dataIndex  = this.$element.index(), // only for drop Datagrid
            left       = options.oleft + (e.pageX - options.event.pageX),
            top        = options.otop + (e.pageY - options.event.pageY)
        
        if (beforeDrag && typeof beforeDrag === 'string')
            beforeDrag = beforeDrag.toFunc()
        if (beforeDrag && typeof beforeDrag === 'function') {
            if (this.$element.next().hasClass('datagrid-child-tr'))
                dataIndex = dataIndex / 2
            
            if (!beforeDrag.apply(this, [this.$element, (trData ? trData[dataIndex] : '')])) {
                return false
            }
        }
        
        if (options.drop) options.move = ''
        //if (top < 1) top = 0
        if (options.move === 'horizontal') {
            if ((options.minW && left >= parseInt(this.options.$obj.css('left')) + options.minW) && (options.maxW && left <= parseInt(this.options.$obj.css('left')) + options.maxW)) {
                this.$element.css('left', left)
            } else if (options.scop) {
                if (options.relObj) {
                    if ((left - parseInt(options.relObj.css('left'))) > options.cellMinW)
                        this.$element.css('left', left)
                    else
                        this.$element.css('left', left)
                }
            }
        } else if (options.move === 'vertical') {
            this.$element.css('top', top)
        } else {
            var $selector = options.selector ? this.options.$obj.find(options.selector) : this.options.$obj
            
            if (options.drop) {
                var $placeholder = $('#bjui-drag-placeholder')
                
                if (!$placeholder.length)
                    $placeholder = $('<div style="position:absolute; z-index:999;" id="bjui-drag-placeholder"></div>').appendTo($('body'))
                    
                $placeholder.css({left:e.pageX, top:e.pageY, opacity:1}).show().empty().append(this.$element.clone())
                
                this.$placeholder = $placeholder
            } else {
                this.$element.css({left:left, top:top})
            }
        }
        if (options.drag)
            options.drag.apply(this.$element, [this.$element, e, left, top])
        
        if (options.drop) {
            that.drop(e)
        }
        if (options.container) {
            if (!options.container instanceof jQuery)
                options.container = $(options.container)
            
            var scrollTop = options.container.scrollTop()
            
            if (!scrollTop) {
                options.container.scrollTop(1)
            }
            if (options.container.scrollTop()) {
                that.tools.mouseDirection(options.container, {
                    e: e,
                    move: function ($element, dir) {
                        if (dir === 'top' || dir === 'bottom') {
                            options.container.scrollTop(options.container.scrollTop() + (e.clientY - options.event.clientY) / 13)
                        }
                    }
                })
            }
        }
        
        return this.preventEvent(e)
    }
    
    Basedrag.prototype.stop = function(e) {
        var that = this
        
        $(document).off('mousemove.bjui.basedrag').off('mouseup.bjui.basedrag').off('mouseover.bjui.basedrag')
        
        that.options.drop && that.options.drop.off('mouseenter.bjui.basedrag')
        
        if (this.options.stop)
            this.options.stop.apply(this.$element, [this.$element, e])
        
        if (this.hasEvent)
            this.destroy()
        else {
            that.$drag.off('mousedown').on('mousedown', $.proxy(function(e) {
                that.options.event = e
                that.options.oleft = 0
                that.options.otop  = 0
                
                that.start(e)
            }, that))
        }
        
        if (that.options.drop && !that.isDrop) {
            var offset = that.$element.offset()
            
            that.$placeholder && that.$placeholder.animate({top:offset.top, left:offset.left, opacity:0.2}, 'normal', function() {
                that.$placeholder.hide()
            })
        }
        if (that.isDrop) {
            that.$placeholder && that.$placeholder.hide()
            that.$drop && that.$drop.trigger('drop.bjui.basedrag', [that.$element])
        }
        
        that.$drops && that.$drops.css('-moz-user-select', '')
        $(document).off('selectstart')
        return this.preventEvent(e)
    }
    
    Basedrag.prototype.preventEvent = function(e) {
        if (e.stopPropagation) e.stopPropagation()
        if (e.preventDefault) e.preventDefault()
        return false
    }
    
    Basedrag.prototype.destroy = function() {
        this.$element.removeData('bjui.basedrag')
        if (!this.options.nounbind) this.$element.off('mousedown')
    }
    

    
    function Plugin(option) {
        var args     = arguments
        var property = option
        
        return this.each(function () {
            var $this   = $(this)
            var options = $.extend({}, $this.data(), typeof option === 'object' && option)
            var data    = $this.data('bjui.basedrag')
            
            if (!data) $this.data('bjui.basedrag', (data = new Basedrag(this, options)))
            if (typeof property === 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                data.init()
            }
        })
    }

    var old = $.fn.basedrag

    $.fn.basedrag             = Plugin
    $.fn.basedrag.Constructor = Basedrag

    $.fn.basedrag.noConflict = function () {
        $.fn.basedrag = old
        return this
    }

    exports('BJUIbasedrag', new Basedrag());
});