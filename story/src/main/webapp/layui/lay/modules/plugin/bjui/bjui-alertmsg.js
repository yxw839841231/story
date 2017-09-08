

/* ========================================================================
 * B-JUI: bjui-alertmsg.js  V1.31
 * @author K'naan
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-alertmsg.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
    // ALERTMSG GLOBAL ELEMENTS
    // ======================
    
    var $box, $alertbg, timer
    
    $(function() {
        var INIT_ALERTMSG = function() {
            $box     = $(FRAG.alertBoxFrag).hide().html('')
            $alertbg = $(FRAG.alertBackground).hide().html('')
            $('body').append('<!-- alert msg box -->').append($box).append('<!-- alert msg box mask bg -->').append($alertbg)
        }
        
        INIT_ALERTMSG()
    })
    
    // ALERTMSG CLASS DEFINITION
    // ======================
    var Alertmsg = function(options) {
        this.options   = options
        this.tools     = this.TOOLS()
        this.clearTime = null
    }
    
    Alertmsg.DEFAULTS = {
        displayPosition : 'topcenter', // Optional 'topleft, topcenter, topright, middleleft, middlecenter, middleright, bottomleft, bottomcenter, bottomright'
        displayMode     : 'slide',     // Optional 'none, fade, slide'
        autoClose       : null,
        alertTimeout    : 3000,
        mask            : null,
        promptRequired  : 'required',
        types           : {error:'error', info:'info', warn:'warn', correct:'correct', confirm:'confirm', prompt:'prompt'},
        fas             : {error:'fa-times-circle', info:'fa-info-circle', warn:'fa-exclamation-circle', correct:'fa-check-circle', confirm:'fa-question-circle', prompt:'fa-paper-plane-o'}
    }
    
    Alertmsg.prototype.TOOLS = function() {
        var that  = this
        var tools = {
            getTitle: function(key){
                return that.options.title || BJUI.regional.alertmsg.title[key]
            },
            keydownOk: function(event) {
                if (event.which == BJUI.keyCode.ENTER) {
                    event.data.target.trigger('click')
                    return false
                }
                return true
            },
            keydownEsc: function(event) {
                if (event.which == BJUI.keyCode.ESC) event.data.target.trigger('click')
            },
            openPosition: function() {
                var position = BJUI.alertMsg.displayPosition, mode = BJUI.alertMsg.displayMode, width = 460, height = $box.outerHeight(), startCss = {}, endCss = {}
                
                if (position) {
                    if (that.options.displayPosition && that.options.displayPosition != 'topcenter')
                        position = that.options.displayPosition
                } else {
                    position = that.options.displayPosition
                }
                
                if (mode) {
                    if (that.options.displayMode && that.options.displayMode != 'slide')
                        mode = that.options.displayMode
                } else {
                    mode = that.options.displayMode
                }
                
                switch (position) {
                case 'topleft':
                    startCss = {top:0 - height, left:0, 'margin-left':0}
                    endCss   = {top:0}
                    
                    break
                case 'topcenter':
                    startCss = {top:0 - height}
                    endCss   = {top:0}
                    
                    break
                case 'topright':
                    startCss = {top:0 - height, left:'auto', right:0, 'margin-left':0}
                    endCss   = {top:0}
                    
                    break
                case 'middleleft':
                    startCss = {top:'50%', left:0 - width, 'margin-left':0, 'margin-top':0 - height/2}
                    endCss   = {left:0}
                    
                    break
                case 'middlecenter':
                    startCss = {top:'0', 'margin-top':0 - height/2}
                    endCss   = {top:'50%'}
                    
                    break
                case 'middleright':
                    startCss = {top:'50%', left:'auto', right:0 - width, 'margin-top':0 - height/2}
                    endCss   = {right:0}
                    
                    break
                case 'bottomleft':
                    startCss = {top:'auto', left:0, bottom:0 - height, 'margin-left':0}
                    endCss   = {bottom:0}
                    
                    break
                case 'bottomcenter':
                    startCss = {top:'auto', bottom:0 - height}
                    endCss   = {bottom:0}
                    
                    break
                case 'bottomright':
                    startCss = {top:'auto', left:'auto', right:0, bottom:0 - height, 'margin-left':0}
                    endCss   = {bottom:0}
                    
                    break
                }
                
                if (mode == 'slide') {
                    $box.css(startCss).show().animate(endCss, 500)
                } else if (mode == 'fade') {
                    startCss.opacity = 0.1
                    $box.css(startCss).css(endCss).show().animate({opacity:1}, 500)
                } else {
                    $box.css(startCss).css(endCss).show()
                }
            },
            closePosition: function() {
                var position = BJUI.alertMsg.displayPosition, mode = BJUI.alertMsg.displayMode, width = 460, height = $box.outerHeight(), endCss = {}
                
                if (position) {
                    if (that.options.displayPosition && that.options.displayPosition != 'topcenter')
                        position = that.options.displayPosition
                } else {
                    position = that.options.displayPosition
                }
                
                if (mode) {
                    if (that.options.displayMode && that.options.displayMode != 'slide')
                        mode = that.options.displayMode
                } else {
                    mode = that.options.displayMode
                }
                
                switch (position) {
                case 'topleft':
                    endCss   = {top:0 - height}
                    
                    break
                case 'topcenter':
                    endCss   = {top:0 - height}
                    
                    break
                case 'topright':
                    endCss   = {top:0 - height}
                    
                    break
                case 'middleleft':
                    endCss   = {left:0 - width}
                    
                    break
                case 'middlecenter':
                    endCss   = {top:0 - height}
                    
                    break
                case 'middleright':
                    endCss   = {right:0 - width}
                    
                    break
                case 'bottomleft':
                    endCss   = {bottom:0 - height}
                    
                    break
                case 'bottomcenter':
                    endCss   = {bottom:0 - height}
                    
                    break
                case 'bottomright':
                    endCss   = {bottom:0 - height}
                    
                    break
                }
                
                if (mode == 'slide') {
                    $box.animate(endCss, 500, function() {
                        $alertbg.hide()
                        $(this).hide().empty()
                    })
                } else if (mode == 'fade') {
                    $box.animate({opacity:0}, 500, function() {
                        $alertbg.hide()
                        $(this).hide().empty()
                    })
                } else {
                    $box.hide().remove()
                    $alertbg.hide()
                }
            },
            open: function(type, msg, buttons) {
                var tools = this, btnsHtml = '', $newbox, $btns, alertTimeout = BJUI.alertMsg.alertTimeout, input = ''
                
                if (buttons) {
                    for (var i = 0; i < buttons.length; i++) {
                        var sRel = buttons[i].call ? 'callback' : '',
                            sCls = buttons[i].cls  ? buttons[i].cls : 'default',
                            sIco = (buttons[i].cls && buttons[i].cls == 'green') ? 'check' : 'close'
                        
                        btnsHtml += FRAG.alertBtnFrag.replace('#btnMsg#', '<i class="fa fa-'+ sIco +'"></i> '+ buttons[i].name).replace('#callback#', sRel).replace('#class#', sCls)
                    }
                }
                if (type == that.options.types.prompt) {
                    input = '<p style="padding-top:5px;"><input type="text" class="form-control" name="'+ (that.options.promptname || 'prompt') +'" value=""></p>'
                }
                
                $newbox = 
                    $(FRAG.alertBoxFrag.replace('#type#', type)
                    .replace('#fa#', that.options.fas[type])
                    .replace('#title#', this.getTitle(type))
                    .replace('#message#', msg)
                    .replace('#prompt#', input)
                    .replace('#btnFragment#', btnsHtml))
                    .hide()
                    .appendTo('body')
                
                if ($box && $box.length) $box.remove()
                $box = $newbox
                
                tools.openPosition()
                
                if (timer) {
                    clearTimeout(timer)
                    timer = null
                }
                
                if (that.options.mask == null) {
                    if (!(that.options.types.info == type || that.options.types.correct == type))
                        $alertbg.show()
                }
                if (that.options.autoClose == null) {
                    if (that.options.types.info == type || that.options.types.correct == type) {
                        if (alertTimeout) { 
                            if (that.options.alertTimeout && that.options.alertTimeout != 3000)
                                alertTimeout = that.options.alertTimeout
                        } else {
                            alertTimeout = that.options.alertTimeout
                        }
                        timer = setTimeout(function() { tools.close() }, alertTimeout)
                    }
                }
                if (type == that.options.types.prompt) {
                    $box.find(':text').focus().val(that.options.promptval)
                }
                
                $btns = $box.find('.btn')
                
                $btns.each(function(i) {
                    $(this).on('click', $.proxy(function() {
                            if (type !== that.options.types.prompt || $btns.eq(i).hasClass('btn-red'))
                                that.tools.close()
                            
                            var call = buttons[i].call
                            
                            if (typeof call === 'string')   call = call.toFunc() 
                            if (typeof call === 'function') {
                                if (type == that.options.types.prompt) {
                                    var $input = $box.find('input'), value = $input.val()
                                    
                                    $input.focus(function() {
                                        $box.removeClass('has-error')
                                    })
                                    
                                    if (that.options.promptRequired === 'required' && !value) {
                                        $box.addClass('has-error')
                                    } else {
                                        that.tools.close()
                                        call.call(that, value)
                                    }
                                } else {
                                    call.call()
                                }
                            }
                        }, that)
                    )
                    
                    if (buttons[i].keyCode === BJUI.keyCode.ENTER) {
                        $(document).on('keydown.bjui.alertmsg.ok', {target:$btns.eq(i)}, tools.keydownOk)
                    }
                    if (buttons[i].keyCode === BJUI.keyCode.ESC) {
                        $(document).on('keydown.bjui.alertmsg.esc', {target:$btns.eq(i)}, tools.keydownEsc)
                    }
                })
            },
            alert: function(type, msg, btnoptions) {
                $.extend(that.options, typeof btnoptions === 'object' && btnoptions)
                
                var op      = $.extend({}, {okName:BJUI.regional.alertmsg.btnMsg.ok, okCall:null}, that.options)
                var buttons = [
                    {name:op.okName, call:op.okCall, cls:'default', keyCode:BJUI.keyCode.ENTER}
                ]
                
                this.open(type, msg, buttons)
            },
            close: function() {
                $(document).off('keydown.bjui.alertmsg.ok').off('keydown.bjui.alertmsg.esc')
                
                this.closePosition()
            }
        }
        
        return tools
    }
    
    Alertmsg.prototype.error = function(msg, btnoptions) {
        this.tools.alert(this.options.types.error, msg, btnoptions)
    }
    
    Alertmsg.prototype.info = function(msg, btnoptions) {
        this.tools.alert(this.options.types.info, msg, btnoptions)
    }
    
    Alertmsg.prototype.warn = function(msg, btnoptions) {
        this.tools.alert(this.options.types.warn, msg, btnoptions)
    }
    
    Alertmsg.prototype.ok = function(msg, btnoptions) {
        this.tools.alert(this.options.types.correct, msg, btnoptions)
    }
    
    Alertmsg.prototype.correct = function(msg, btnoptions) {
        this.tools.alert(this.options.types.correct, msg, btnoptions)
    }
    
    Alertmsg.prototype.confirm = function(msg, btnoptions) {
        $.extend(this.options, typeof btnoptions === 'object' && btnoptions)
        
        var op      = $.extend({}, {okName:BJUI.regional.alertmsg.btnMsg.ok, okCall:null, cancelName:BJUI.regional.alertmsg.btnMsg.cancel, cancelCall:null}, this.options)
        var buttons = [
            {name:op.okName, call:op.okCall, cls:'green', keyCode:BJUI.keyCode.ENTER},
            {name:op.cancelName, call:op.cancelCall, cls:'red', keyCode:BJUI.keyCode.ESC}
        ]
        
        this.tools.open(this.options.types.confirm, msg, buttons)
    }
    
    Alertmsg.prototype.prompt = function(msg, btnoptions) {
        $.extend(this.options, typeof btnoptions === 'object' && btnoptions)
        
        var that = this, op = $.extend({}, {okName:BJUI.regional.alertmsg.btnMsg.ok, okCall:null, cancelName:BJUI.regional.alertmsg.btnMsg.cancel, cancelCall:null}, this.options)
        
        if (op.okCall == null && (typeof that.options.prompt === 'object' && that.options.prompt)) {
            op.okCall = function(val) {
                var data = {}
                
                data[(that.options.promptname || 'prompt')] = val
                
                if (!that.options.prompt.data)
                    that.options.prompt.data = data
                else
                    $.extend(that.options.prompt.data, data)
                    
                BJUI.ajax('doajax', that.options.prompt)
            }
        }
        
        var buttons = [
            {name:op.okName, call:op.okCall, cls:'green', keyCode:BJUI.keyCode.ENTER},
            {name:op.cancelName, call:op.cancelCall, cls:'red', keyCode:BJUI.keyCode.ESC}
        ]
        
        this.tools.open(this.options.types.prompt, msg, buttons)
    }
    
    // ALERTMSG PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args     = arguments,
            property = option,
            alertmsg = 'bjui.alertmsg',
            $body    = $('body'),
            data     = $body.data(alertmsg)
        
        return this.each(function () {
            var $this   = $(this),
                options = $.extend({}, Alertmsg.DEFAULTS, typeof option === 'object' && option)
            
            if (!data) {
                data = new Alertmsg(options)
            } else {
                data.options = options
            }
            
            $body.data(alertmsg, data)
            
            if (typeof property === 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            }
        })
    }
    
    var old = $.fn.alertmsg
    
    $.fn.alertmsg             = Plugin
    $.fn.alertmsg.Constructor = Alertmsg
    
    // ALERTMSG NO CONFLICT
    // =================
    
    $.fn.alertmsg.noConflict = function () {
        $.fn.alertmsg = old
        return this
    }
    
    // NOT SELECTOR
    // ==============
    
    BJUI.alertmsg = function() {
        Plugin.apply($('body'), arguments)
    }
    
    // NAVTAB DATA-API
    // ==============
    
    $(document).on('click.bjui.alertmsg.data-api', '[data-toggle="alertmsg"]', function(e) {
        var $this = $(this), data = $this.data(), options = data.options, type
        
        if (options) {
            if (typeof options === 'string') options = options.toObj()
            if (typeof options === 'object') {
                $.extend(data, options)
            }
        }
        
        type = data.type
        if (!type) return false
        if (!data.msg) {
            if (options.msg) data.msg = options.msg
        }
        
        Plugin.call($this, type, data.msg || type, data)
        
        e.preventDefault()
    })
    
}(jQuery);