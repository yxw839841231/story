/* ========================================================================
 * B-JUI: bjui-initui.js  V1.31
 * @author K'naan
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-initui.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

layui.define('BJUIextends', function(exports){
    "use strict";
    var $ = layui.jquery,BJUI=layui.BJUIcore;
    
    // INITUI CLASS DEFINITION
    // ======================
    var Initui = function(element, options) {
        var $this     = this
        this.$element = $(element)
        this.options  = options
    }
    
    Initui.DEFAULTS = {}
    
    Initui.prototype.init = function() {
        var that = this, $element = that.$element
        
        $.when(that.initUI()).done(function(){
            $element.trigger(BJUI.eventType.afterInitUI)
        })
    }
    
    Initui.prototype.initUI = function() {
        var $element = this.$element
        
        $.when($element.trigger(BJUI.eventType.beforeInitUI)).done(function(){
            $element.trigger(BJUI.eventType.initUI)
        })
    }
    
    // INITUI PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args     = arguments,
            property = option
        
        return this.each(function () {
            var $this   = $(this),
                options = $.extend({}, Initui.DEFAULTS, $this.data(), typeof option === 'object' && option),
                data    = $this.data('bjui.initui')
            
            if (!data) $this.data('bjui.initui', (data = new Initui(this, options)))
            
            if (typeof property === 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                data.init()
            }
        })
    }

    var old = $.fn.initui

    $.fn.initui             = Plugin
    $.fn.initui.Constructor = Initui
    
    // INITUI NO CONFLICT
    // =================
    
    $.fn.initui.noConflict = function () {
        $.fn.initui = old
        return this
    }
    
    // INITUI DATA-API
    // ==============

    $(document).on('click.bjui.initui.data-api', '[data-toggle="initui"]', function(e) {
        Plugin.call($this, $this.data())
        
        e.preventDefault()
    })
    
    /* beforeInitUI */
    $(document).on(BJUI.eventType.beforeInitUI, function(e) {
        var $box    = $(e.target),
            noinits = [],
            $noinit = $box.find('[data-noinit], pre')
        
        //progress
        $box.find('> .bjui-maskProgress').find('.progress').stop().animate({width:'85%'}, 'fast')
        
        // Hide not need to initialize the UI DOM
        $noinit.each(function(i) {
            var $this = $(this), pos = {}
                        
            pos.$target = $this
            pos.$next   = $this.next()
            pos.$prev   = $this.prev()
            pos.$parent = $this.parent()
            pos.visible = $this.is(':visible') ? true : false
            
            noinits.push(pos)
            $this.remove()
        })
        
        $box.data('bjui.noinit', noinits)
    })
    
    /* initUI */
    $(document).on(BJUI.eventType.initUI, function(e) {
        var $box    = $(e.target)
        
        //progress
        $box.find('> .bjui-maskProgress').find('.progress').stop().animate({width:'95%'}, 'fast')
    })
    
    /* afterInitUI */
    $(document).on(BJUI.eventType.afterInitUI, function(e) {
        var $box    = $(e.target),
            noinits = $box.data('bjui.noinit'),
            $form   = $box.find('> .bjui-pageContent').find('form')
        
        // Recovery not need to initialize the UI DOM
        if (noinits) {
            $.each(noinits, function(i, n) {
                if (n.$next.length) n.$next.before(n.$target)
                else if (n.$prev.length) n.$prev.after(n.$target)
                else if (n.$parent.length) n.$parent.append(n.$target)
                
                if (n.visible) n.$target.show()
                
                $box.removeData('bjui.noinit')
            })
        }
        
        /* resizePageH */
        $box.resizePageH()
        
        //submit
        if ($form.length) {
            $box.find('> .bjui-pageFooter').find(':submit').on('click.bjui.submit', function(e) {
                e.preventDefault()
                
                $form.submit()
            })
        }
        
        $box.find('> .bjui-pageFooter').find(':submit.btn-submit-header').on('click.bjui.submit', function(e) {
            e.preventDefault()
            
            var $form = $box.find('> .bjui-pageHeader').find('form')
            
            $form.length && $form.submit()
        })
        
        //progress
        $box.find('> .bjui-maskProgress').find('.progress').stop().animate({width:'100%'}, 'fast', function() {
            $box.find('> .bjui-ajax-mask').fadeOut('normal', function() { $(this).remove() })
        })
    })
    
    /* Lateral Navigation */
    $(document).one(BJUI.eventType.afterInitUI, function(e) {
        var $hnavbar = $('#bjui-hnav-navbar'), $active = $hnavbar.find('> li.active'), $a = $active.find('> a')
        
        if ($active.length) {
            if ($active.find('> .items').length) {
                $a.trigger('click')
            } else {
                var href = $a.attr('href')
                
                if (href && !(href.startsWith('#') || href.startsWith('javascript'))) {
                    $a.trigger('click')
                }
            }
        }
    })
    
    /* ajaxStatus */
    var bjui_ajaxStatus = function($target) {
        var $this    = $target,
            $offset  = $this,
            position = $this.css('position'),
            top      = $this.scrollTop() || 0,
            height   = ($this[0].clientHeight) / 2
        
        if (position == 'static') {
            $this.css('position', 'relative').data('bjui.ajax.static', true)
            $offset  = $this.offsetParent()
        }
        
        var zIndex   = parseInt($offset.css('zIndex')) || 0,
            $ajaxBackground = $this.find('> .bjui-maskBackground'),
            $ajaxProgress   = $this.find('> .bjui-maskProgress')
            
        if (!$ajaxBackground.length) {
            $ajaxBackground = $(FRAG.maskBackground)
            $ajaxProgress   = $(BJUI.doRegional(FRAG.maskProgress, BJUI.regional))
            $this.prepend($ajaxBackground).prepend($ajaxProgress)
        }
        
        var bgZindex = parseInt($ajaxBackground.css('zIndex')) || 0,
            prZindex = parseInt($ajaxProgress.css('zIndex')) || 0
        
        $ajaxBackground.css('zIndex', zIndex + 1).css('top', top)
        $ajaxProgress.css('zIndex', zIndex + 2)
        
        if (top)
            $ajaxProgress.css('top', top + height)
        
        if (height == 0) {
            setTimeout(function() {
                $ajaxProgress.css('top', $(this).scrollTop() + $this[0].clientHeight / 2)
            }, 50)
        }
        
        $this.off('scroll.ajaxmask').on('scroll.ajaxmask', function() {
            var top = $(this).scrollTop()
            
            $ajaxBackground.css('top', $this.scrollTop())
            $ajaxProgress.css('top', top + this.clientHeight / 2)
        })
        
        return {$bg:$ajaxBackground, $pr:$ajaxProgress}
    }
    
    $(document)
        .on('bjui.ajaxStart', function(e, timeout, callback) {
            var ajaxMask = bjui_ajaxStatus($(e.target))
            
            ajaxMask.$bg.fadeIn()
            ajaxMask.$pr.fadeIn()
            ajaxMask.$pr.find('.progress').animate({width:'80%'}, timeout || 500)
            
            if (callback) {
                setTimeout(function() {
                    callback.toFunc().call(this)
                }, 25)
            }
        })
        .on('bjui.ajaxStop', function(e) {
            var $target = $(e.target), ajaxMask = bjui_ajaxStatus($target)
            
            ajaxMask.$pr.find('.progress').animate({width:'100%'}, 'fast', function() {
                ajaxMask.$bg.remove()
                ajaxMask.$pr.remove()
                
                if ($target.data('bjui.ajax.static'))
                    $target.css('position', 'static')
            })
        })
        .on('bjui.ajaxError', function(e) {
            var $target = $(e.target), ajaxMask = bjui_ajaxStatus($target)
            
            ajaxMask.$bg.remove()
            ajaxMask.$pr.remove()
            
            if ($target.data('bjui.ajax.static'))
                $target.css('position', 'static')
        })
    
    $(document).on(BJUI.eventType.ajaxStatus, function(e) {
        var $target = $(e.target), ajaxMask = bjui_ajaxStatus($target)
        
        $target
            .one('ajaxStart', function() {
                ajaxMask.$bg.fadeIn()
                ajaxMask.$pr.fadeIn()
                
                ajaxMask.$pr.find('.progress').animate({width:'10%'}, 'fast')
            })
            .one('ajaxStop', function() {
                //ajaxMask.$bg.fadeOut()
                //ajaxMask.$pr.fadeOut()
                //ajaxMask.$pr.find('.progress').animate({width:'80%'}, 'fast')
            })
            .one('ajaxError', function() {
                ajaxMask.$bg.remove()
                ajaxMask.$pr.remove()
                
                if ($target.data('bjui.ajax.static'))
                    $target.css('position', 'static')
            })
    })
    
    /* Clean plugins generated 'Dom elements' in the body */
    var bodyClear = function($target) {
        $target.find('select[data-toggle="selectpicker"]').selectpicker('destroyMenu')
        $target.find('[data-toggle="selectztree"]').trigger('destroy.bjui.selectztree')
        $target.find('.bjui-suggest-input').trigger('destroy.bjui.suggest')
    }
    
    $(document).on(BJUI.eventType.beforeLoadDialog, function(e) {
        
    }).on(BJUI.eventType.beforeAjaxLoad, function(e) {
        bodyClear($(e.target))
    }).on(BJUI.eventType.beforeCloseNavtab, function(e) {
        bodyClear($(e.target))
    }).on(BJUI.eventType.beforeCloseDialog, function(e) {
        bodyClear($(e.target))
    })
    
    /* other */
    $(function() {
        $(document).on('keydown keyup', function(e) {
            if (e.which === BJUI.keyCode.CTRL) {
                BJUI.KeyPressed.ctrl = e.type == 'keydown' ? true : false
            }
            if (e.which === BJUI.keyCode.SHIFT) {
                BJUI.KeyPressed.shift = e.type == 'keydown' ? true : false
            }
        })
    })

    exports('BJUIinitui');
});
