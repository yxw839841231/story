

/* ========================================================================
 * B-JUI: bjui-ajax.js  V1.31
 * @author K'naan 
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-ajax.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

layui.define('BJUInavtab', function(exports){
    "use strict";
    var $ = layui.BJUIextends,BJUI=layui.BJUIcore,layer = layui.layer;

    var autorefreshTimer

    var Bjuiajax = function(element, options) {
        var $this     = this
        
        this.$element = $(element)
        this.options  = options
        this.tools    = this.TOOLS()
    }
    
    Bjuiajax.DEFAULTS = {
        okalert         : true,
        reload          : true,
        loadingmask     : true,
        gridrefreshflag : true
    }
    
    Bjuiajax.NAVTAB = 'navtab'
    
    Bjuiajax.prototype.TOOLS = function() {
        var that  = this
        var tools = {
            getTarget: function() {
                if (that.$element.closest('.navtab-panel').length) return Bjuiajax.NAVTAB
                else return 'dialog'
            }
        }
        
        return tools
    }
    
    Bjuiajax.prototype.ajaxdone = function(json) {
        if (json[BJUI.keys.statusCode] == BJUI.statusCode.error) {
            if (json[BJUI.keys.message]) BJUI.alertmsg('error', json[BJUI.keys.message])
        } else if (json[BJUI.keys.statusCode] == BJUI.statusCode.timeout) {
            BJUI.alertmsg('info', (json[BJUI.keys.message] || BJUI.regional.sessiontimeout))
            BJUI.loadLogin()
        } else {
            if (json[BJUI.keys.message]){
                //layer.msg(json[BJUI.keys.message],{icon:6})
                //BJUI.alertmsg('correct', json[BJUI.keys.message])
            }
        }
    }
    
    Bjuiajax.prototype.ajaxerror = function(xhr, ajaxOptions, thrownError) {
        var msg = xhr.responseText, that = this, options = that.$element.data('bjui.ajax.options') || that.options, failCallback = options.failCallback
        
        if (typeof msg === 'string' && msg.startsWith('{')) {
            this.ajaxdone(msg.toObj())
        } else {
            BJUI.alertmsg('error', '<div>Http status: ' + xhr.status + ' ' + xhr.statusText + '</div>' 
                + '<div>ajaxOptions: '+ ajaxOptions +' </div>'
                + '<div>thrownError: '+ thrownError +' </div>'
                + '<div>'+ msg +'</div>')
        }
        
        if (failCallback) {
            if (typeof failCallback === 'string')
                failCallback = failCallback.toFunc()
            if (typeof failCallback === 'function')
                failCallback.apply(that, [msg, options])
            else
                BJUI.debug('The callback function \'failCallback\' is incorrect: '+ failCallback)
        }
    }
    
    Bjuiajax.prototype.ajaxcallback = function(json) {
        var that = this, options = that.options,
            okCallback = options.okCallback, errCallback = options.errCallback, okAfterCallback = options.okAfterCallback,
            tabids = [], dialogids = [], divids = [], datagrids = []
        
        var okFunc = function() {
                if (typeof okCallback === 'string')
                    okCallback = okCallback.toFunc()
                if (typeof okCallback === 'function')
                    okCallback.apply(that, [json, options])
                else
                    BJUI.debug('The callback function \'okCallback\' is incorrect: '+ okCallback)
            },
            okAfterFunc = function() {
                if (typeof okAfterCallback === 'string')
                    okAfterCallback = okAfterCallback.toFunc()
                if (typeof okAfterCallback === 'function')
                    okAfterCallback.apply(that, [json, options])
                else
                    BJUI.debug('The callback function \'okAfterCallback\' is incorrect: '+ okAfterCallback)
            },
            errFunc = function() {
                if (typeof errCallback === 'string')
                    errCallback = errCallback.toFunc()
                if (typeof errCallback === 'function')
                    errCallback.apply(that, [json, options])
                else
                    BJUI.debug('The callback function \'errCallback\' is incorrect: '+ errCallback)
            }
        
        if (typeof json === 'string')
            json = json.toObj()
                
        if (options.okalert)
            that.ajaxdone(json)
        
        if (!json[BJUI.keys.statusCode]) {
            if (okCallback) {
                okFunc()
                return
            }
        }
        if (json[BJUI.keys.statusCode] == BJUI.statusCode.ok) {
            if (okCallback) {
                okFunc()
                return
            }
            
            if (json.tabid)
                $.merge(tabids, json.tabid.split(','))
            if (options.tabid)
                $.merge(tabids, options.tabid.split(','))
            
            if (json.dialogid)
                $.merge(dialogids, json.dialogid.split(','))
            if (options.dialogid)
                $.merge(dialogids, options.dialogid.split(','))
            
            if (json.divid)
                $.merge(divids, json.divid.split(','))
            if (options.divid)
                $.merge(divids, options.divid.split(','))
            
            if (json.datagrid)
                $.merge(datagrids, json.datagrid.split(','))
            if (options.datagrid)
                $.merge(datagrids, options.datagrid.split(','))
            
            // refresh
            if (tabids.length) {
                $.unique(tabids)
                setTimeout(function() { BJUI.navtab('reloadFlag', tabids.join(',')) }, 100)
            }
            if (dialogids.length) {
                $.unique(dialogids)
                setTimeout(function() { BJUI.dialog('refresh', dialogids.join(',')) }, 100)
            }
            if (divids.length) {
                $.unique(divids)
                setTimeout(function() { that.refreshdiv(divids.join(',')) }, 100)
            }
            if (datagrids.length) {
                setTimeout(function() {
                    $.each(datagrids, function(i, n) {
                        $('#'+ n.trim()).datagrid('refresh', options.gridrefreshflag)
                    })
                }, 100)
            }
            
            if (that.$target == $.CurrentNavtab) {
                that.navtabcallback(json)
            } else if (that.$target == $.CurrentDialog) {
                that.dialogcallback(json)
            } else {
                that.divcallback(json)
            }
            
            if (okAfterCallback) {
                okAfterFunc()
            }
        } else {
            if (errCallback) {
                errFunc()
            }
        }
    }
    
    Bjuiajax.prototype.divcallback = function(json, $target, options) {
        var that = this, options = that.options,
            forward = json.forward || options.forward || null,
            forwardConfirm = json.forwardConfirm || options.forwardConfirm || null
        
        
        if (options.reload && !forward) {
            that.refreshlayout()
        }
        
        if (options.reloadNavtab)
            setTimeout(function() { BJUI.navtab('refresh') }, 100)
        
        if (forward) {
            var _forward = function() {
                $.extend(options, {url: forward})
                that.refreshlayout()
            }
            
            if (forwardConfirm) {
                BJUI.alertmsg('confirm', forwardConfirm, {
                    okCall: function() { _forward() }
                })
            } else {
                _forward()
            }
        }
    }
    
    Bjuiajax.prototype.navtabcallback = function(json) {
        var that = this, options = that.options,
            closeCurrent = json.closeCurrent || options.closeCurrent || false,
            forward = json.forward || options.forward || null,
            forwardConfirm = json.forwardConfirm || options.forwardConfirm || null
        
        if (closeCurrent && !forward)
            BJUI.navtab('closeCurrentTab')
        else if (options.reload && !forward)
            setTimeout(function() { BJUI.navtab('refresh') }, 100)
        
        if (forward) {
            var _forward = function() {
                BJUI.navtab('reload', {url:forward})
            }
            
            if (forwardConfirm) {
                BJUI.alertmsg('confirm', forwardConfirm, {
                    okCall: function() { _forward() },
                    cancelCall: function() { if (closeCurrent) { BJUI.navtab('closeCurrentTab') } }
                })
            } else {
                _forward()
            }
        }
    }
    
    Bjuiajax.prototype.dialogcallback = function(json) {
        var that = this, options = that.options,
            closeCurrent = json.closeCurrent || options.closeCurrent || false,
            forward = json.forward || options.forward || null,
            forwardConfirm = json.forwardConfirm || options.forwardConfirm || null
        
        if (closeCurrent && !forward)
            BJUI.dialog('closeCurrent')
        else if (options.reload && !forward)
            setTimeout(function() { BJUI.dialog('refresh') }, 100)
        
        if (options.reloadNavtab)
            setTimeout(function() { BJUI.navtab('refresh') }, 100)
        if (forward) {
            var _forward = function() {
                BJUI.dialog('reload', {url:forward})
            }
            
            if (forwardConfirm) {
                BJUI.alertmsg('confirm', json.forwardConfirm, {
                    okCall: function() { _forward() },
                    cancelCall: function() { if (closeCurrent) { BJUI.dialog('closeCurrent') } }
                })
            } else {
                _forward()
            }
        }
    }
    
    Bjuiajax.prototype.doajax = function(options) {
        var that = this, $target, $element = that.$element
        
        if (!options) options = {}
        if (!options.loadingmask) options.loadingmask = false
        
        options = $.extend({}, Bjuiajax.DEFAULTS, typeof options === 'object' && options)
        that.options = options
        
        if (options.target) {
            if (options.target instanceof jQuery)
                $target = options.target
            else
                $target = $(options.target)
        } else {
            if ($element[0] !== $('body')[0]) {
                $target = $element.closest('.bjui-layout')
            }
        }
        
        if (!$target || !$target.length)
            $target = $.CurrentDialog || $.CurrentNavtab
        
        that.$target = $target
        
        if (!options.url) {
            BJUI.debug('BJUI.ajax: \'doajax\' method: the url is undefined!')
            return
        } else {
            options.url = decodeURI(options.url).replacePlh($target)
            
            if (!options.url.isFinishedTm()) {
                BJUI.alertmsg('error', (options.warn || BJUI.regional.plhmsg))
                BJUI.debug('BJUI.ajax: \'doajax\' method: The url is incorrect: '+ options.url)
                return
            }
            
            options.url = encodeURI(options.url)
        }
        
        var callback = options.callback && options.callback.toFunc()
        var todo     = function() {
            if (!options.callback)
                options.callback = $.proxy(function(data) {that.ajaxcallback(data)}, that)
            
            $target.data('bjui.ajax.options', options).doAjax(options)
        }
        
        if (options.confirmMsg) {
            BJUI.alertmsg('confirm', options.confirmMsg,
                {
                    okCall : function() {
                        todo()
                    }
                }
            )
        } else {
            todo()
        }
    }
    
    Bjuiajax.prototype._ajaxform = function($form, options) {
        var that         = this,
            $target      = null,
            beforeSubmit = options.beforeSubmit,
            callback     = options.callback,
            isSubmit     = false,
            enctype
        
        if ($form.data('holdSubmit')) {
            return
        }
        // beforeSubmit
        if (beforeSubmit) {
            if (typeof beforeSubmit === 'string')
                beforeSubmit = beforeSubmit.toFunc()
            if (typeof beforeSubmit === 'function') {
                if (!beforeSubmit.apply(that, [$form])) {
                    return
                }
            } else {
                BJUI.debug('BJUI.ajax: \'ajaxform\' options \'beforeSubmit\': Not a function!')
                return
            }
        }
        
        // for webuploader
        var $uploaders = $form.find('input[data-toggle="webuploader"]'), requiredMsg, error4Uploader = false
        
        if ($uploaders.length && WebUploader) {
            $uploaders.each(function(i, n) {
                var uploader = $(this).data('webuploader'), $lis = $(this).data('webuploader.wrap').find('.filelist > li'), fileCount = $lis.length, waitCount = fileCount - $lis.filter('.uploaded').length 
                
                if (waitCount && uploader) {
                    if (waitCount !== uploader.getStats().successNum) {
                        // 自动上传
                        uploader.upload()
                        // 上传完成后触发
                        uploader.on('uploadFinished', function() {
                            $form.submit()
                        })
                        
                        error4Uploader = true
                        return false
                    }
                }
                if (uploader && uploader.options.required) {
                    if (!fileCount) {
                        requiredMsg = uploader.options.requiredMsg || '请上传图片！'
                        return false
                    }
                }
            })
        }
        
        if (requiredMsg) {
            BJUI.alertmsg('info', requiredMsg)
            return
        }
        if (error4Uploader) {
            BJUI.alertmsg('info', '表单将在图片上传完成后自动提交！')
            return
        }
        
        enctype = $form.attr('enctype')
        
        // target
        if (!options.target)
            options.target = $form.closest('.bjui-layout')
        if (options.target) {
            $target = options.target
            
            if (!($target instanceof jQuery))
                $target = $($target)
        }
        if (!$target || !$target.length)
            $target = $.CurrentDialog || $.CurrentNavtab
        
        that.$target = $target
        
        options.url  = options.url || $form.attr('action')
        // for ie8
        if (BJUI.isIE(8) && !options.type) {
            if (!$form[0].getAttributeNode('method').specified) options.type = 'POST'
        }
        options.type = options.type || $form.attr('method') || 'POST'
        
        $.extend(that.options, options)
        
        if (callback) callback = callback.toFunc()
        
        var successFn = function(data, textStatus, jqXHR) {
            callback ? callback.apply(that, [data, $form]) : $.proxy(that.ajaxcallback(data), that)
        }
        var _submitFn = function() {
            var op = {loadingmask:that.options.loadingmask, type:that.options.type, url:that.options.url, callback:successFn}
            
            if (enctype && enctype == 'multipart/form-data') {
                if (window.FormData) {
                    $.extend(op, {data:new FormData($form[0]), contentType:false, processData:false}) 
                } else {
                    $.extend(op, {data:$form.serializeArray(), files:$form.find(':file'), iframe:true, processData:false})
                }
            } else {
                $.extend(op, {data:$form.serializeArray()})
            }
            
            if (that.options.ajaxTimeout) op.ajaxTimeout = that.options.ajaxTimeout
            
            $form.doAjax(op)
        }
        
        if (that.options.confirmMsg) {
            BJUI.alertmsg('confirm', that.options.confirmMsg, {okCall: _submitFn})
        } else {
            _submitFn()
        }
    }
    
    Bjuiajax.prototype.ajaxform = function(option) {
        var that     = this,
            options  = $.extend({}, typeof option === 'object' && option),
            $element = that.$element,
            $form    = null,
            valiOpts = {
                validClass : 'ok',
                msgClass   : 'n-bottom',
                theme      : 'red_bottom_effect_grid'
            }
        
        // form
        if ($element[0] === $('body')[0]) {
            $form = options.form
            
            if (!($form instanceof jQuery))
                $form = $(options.form)
        } else {
            $form   = $element
        }
        if (!$form || !$form.length || !($form.isTag('form'))) {
            BJUI.debug('BJUI.ajax: \'ajaxform\' method: Not set the form!')
            return
        }
        
        if (typeof options.validate === 'undefined')
            options.validate = true
        
        if ($.fn.validator && options.validate) {
            if (!$form.data('validator'))
                $form.validator(valiOpts)
            
            $form
                .on('valid.form', function(e) {
                    that._ajaxform($form, options)
                })
                .on('invalid.form', function(e, form, errors) {
                    if (options.alertmsg) BJUI.alertmsg('error', BJUI.regional.validatemsg.replaceMsg(errors.length))
                })
            
            $form.trigger('validate')
        } else {
            that._ajaxform($form, options)
        }
    }
    
    Bjuiajax.prototype._ajaxsearch = function($form, options) {
        var that         = this,
            $target      = null,
            beforeSubmit = options.beforeSubmit,
            callback     = options.callback,
            isSubmit     = false,
            enctype
        
        if ($form.data('holdSubmit')) {
            return
        }
        // beforeSubmit
        if (beforeSubmit) {
            if (typeof beforeSubmit === 'string')
                beforeSubmit = beforeSubmit.toFunc()
            if (typeof beforeSubmit === 'function') {
                if (!beforeSubmit.apply(that, [$form])) {
                    return
                }
            } else {
                BJUI.debug('BJUI.ajax: \'ajaxform\' options \'beforeSubmit\': Not a function!')
                return
            }
        }
        // pagination
        if ($form.data('bjui.paging')) {
            if (!options.data)
                options.data = {}
            
            $.extend(options.data, $form.data('bjui.paging'))
        }
        // search for datagrid
        if (options.searchDatagrid) {
            var $datagrid = options.searchDatagrid
            
            if (!($datagrid instanceof jQuery)) {
                $datagrid = $($datagrid)
            }
            
            if (!$datagrid || !$datagrid.length || !$datagrid.data('bjui.datagrid')) {
                BJUI.debug('BJUI.ajax: \'ajaxsearch\' method: The options \'searchDatagrid\' is not incorrect!')
                return
            }
            
            $form.data('holdSubmit', true)
            
            $datagrid.datagrid('filter', $form.serializeJson())
            
            $datagrid.on('afterLoad.bjui.datagrid', function() {
                $form.data('holdSubmit', false)
            })
            
            return
        }
        // target
        if (!options.target)
            options.target = $form.closest('.bjui-layout')
        if (options.target) {
            $target = options.target
            
            if (!($target instanceof jQuery))
                $target = $($target)
        }
        if (!$target || !$target.length)
            $target = $.CurrentDialog || $.CurrentNavtab
        
        that.$target = $target
        
        options.url  = options.url || $form.attr('action')
        // for ie8
        if (BJUI.isIE(8) && !options.type) {
            if (!$form[0].getAttributeNode('method').specified) options.type = 'POST'
        }
        options.type = options.type || $form.attr('method') || 'POST'
        
        if (!options.url) {
            BJUI.debug('BJUI.ajax: \'ajaxsearch\' method: The form\'s action or url is undefined!')
            return
        } else {
            options.url = decodeURI(options.url).replacePlh($form.closest('.unitBox'))
            
            if (!options.url.isFinishedTm()) {
                BJUI.alertmsg('error', (options.warn || BJUI.regional.plhmsg))
                BJUI.debug('BJUI.ajax: \'ajaxsearch\' method: The form\'s action or url is incorrect: '+ options.url)
                return
            }
            
            options.url = encodeURI(options.url)
        }
        
        $.extend(that.options, options)
        
        if ($target.hasClass('bjui-layout')) {
            var data = $.extend($form.serializeJson(), options.data)
            
            that.reloadlayout({target:$target[0], type:that.options.type, url:that.options.url, data:data, loadingmask:that.options.loadingmask})
        } else {
            options.form = $form
            if ($target[0] === ($.CurrentNavtab)[0]) {
                BJUI.navtab('reloadForm', that.options.clearQuery, options)
            } else {
                BJUI.dialog('reloadForm', that.options.clearQuery, options)
            }
        }
    }
    
    /*Bjuiajax.prototype.ajaxsearch = function(option) {
        var that     = this,
            options  = $.extend({}, typeof option === 'object' && option),
            $element = that.$element,
            $form    = null,
            valiOpts = {
                validClass : 'ok',
                msgClass   : 'n-bottom',
                theme      : 'red_bottom_effect_grid'
            }
        
        // form
        if ($element[0] === $('body')[0]) {
            $form = options.form
            
            if (!($form instanceof jQuery)) {
                $form = $(options.form)
            }
        } else {
            $form = $element
        }
        if (!$form || !$form.length || !($form.isTag('form'))) {
            BJUI.debug('BJUI.ajax: \'ajaxsearch\' method: Not set the form!')
            return
        }
        
        if (typeof options.validate === 'undefined')
            options.validate = true
        
        if ($.fn.validator && options.validate) {
            if (!$form.data('validator'))
                $form.validator(valiOpts)
            
            $form
                .on('valid.form', function(e) {
                    that._ajaxsearch($form, options)
                })
                .on('invalid.form', function(e, form, errors) {
                    if (options.alertmsg) BJUI.alertmsg('error', BJUI.regional.validatemsg.replaceMsg(errors.length))
                })
            
            $form.trigger('validate')
        } else {
            that._ajaxsearch($form, options)
        }
    }*/
    Bjuiajax.prototype.ajaxsearch = function(option) {
        var that = this, options = $.extend({}, typeof option === 'object' && option), $element = that.$element, form = null, op = {pageCurrent:1}, $form, $target, isValid = options.isValid

        if (options.target) $target = $(options.target)
        if ($element[0] === $('body')[0]) {
            $form = options.form

            if (!($form instanceof jQuery)) {
                $form = $(options.form)
            }
            if (!$form || !$form.length || !($form.isTag('form'))) {
                BJUI.debug('Bjuiajax Plugin: \'ajaxsearch\' method: Not set the form!')
                return
            }
            if (options.target) {
                $target = options.target

                if (!($target instanceof jQuery))
                    $target = $($target)
            } else {
                $target = $form.closest('.bjui-layout')
            }

            if (!$target || !$target.length)
                $target = $.CurrentDialog || $.CurrentNavtab
        } else {
            $form   = $element
            $target = $form.closest('.bjui-layout')

            if (!($form.isTag('form'))) {
                BJUI.debug('Bjuiajax Plugin: \'ajaxsearch\' method: Not set the form!')
                return
            }
            if (!$target || !$target.length) {
                $target = $.CurrentDialog || $.CurrentNavtab
            }

            if (!options.url)
                options.url = $form.attr('action')
        }

        that.$target = $target

        if (!options.url)
            options.url = $form.attr('action')

        if (!options.url) {
            BJUI.debug('Bjuiajax Plugin: \'ajaxsearch\' method: The form\'s action or url is undefined!')
            return
        } else {
            options.url = decodeURI(options.url).replacePlh($form.closest('.unitBox'))

            if (!options.url.isFinishedTm()) {
                BJUI.alertmsg('error', (options.warn || BJUI.regional.plhmsg))
                BJUI.debug('Bjuiajax Plugin: \'ajaxsearch\' method: The form\'s action or url is incorrect: '+ options.url)
                return
            }

            options.url = encodeURI(options.url)
        }

        if (!options.type)
            options.type = $form.attr('method') || 'POST'

        that.tools.getPagerForm($target, op, $form[0])
        options.form = $form

        $.extend(that.options, options)

        var search = function() {
            if ($target.hasClass('bjui-layout')) {
                var data = $form.serializeJson(), _data = {}

                if (options.clearQuery) {
                    var pageInfo = BJUI.pageInfo

                    for (var key in pageInfo) {
                        _data[pageInfo[key]] = data[pageInfo[key]]
                    }

                    data = _data
                }

                that.reloadlayout({target:$target[0], type:that.options.type, url:that.options.url, data:data, loadingmask:that.options.loadingmask})
            } else {
                if ($target[0] === ($.CurrentNavtab)[0]) {
                    BJUI.navtab('reloadForm', that.options.clearQuery, options)
                } else {
                    BJUI.dialog('reloadForm', that.options.clearQuery, options)
                }
            }
        }

        if (!isValid) {
            if ($.fn.validator) {
                $form.isValid(function(v) {
                    if (v) search()
                })
            } else {
                search()
            }
        } else {
            search()
        }
    }

    Bjuiajax.prototype.doload = function(option) {
        var that = this, $target = null, options = that.options
            
        $.extend(options, typeof option === 'object' && option)
        
        if (options.target) {
            $target = options.target
            
            if (!($target instanceof jQuery))
                $target = $($target)
        }
        
        if (!$target || !$target.length) {
            BJUI.debug('BJUI.ajax: \'doload\' method: Not set loaded container, like [data-target].')
            return
        }
        
        if (!options.url) {
            BJUI.debug('BJUI.ajax: \'doload\' method: The url is undefined!')
            return
        } else {
            options.url = decodeURI(options.url).replacePlh()
            
            if (!options.url.isFinishedTm()) {
                BJUI.alertmsg('error', (options.warn || BJUI.regional.plhmsg))
                BJUI.debug('BJUI.ajax: \'doload\' method: The url is incorrect: '+ options.url)
                return
            }
            
            options.url = encodeURI(options.url)
        }
        
        $target.removeData('bjui.clientPaging').data('options', options)
        that.reloadlayout(options)
    }
    
    Bjuiajax.prototype.refreshlayout = function(target) {
        var that = this, $target
        
        if (target) {
            $target = target
            
            if (!($target instanceof jQuery))
                $target = $($target)
        } else {
            $target = that.$target
        }
        
        if (!$target || !$target.length) {
            if (autorefreshTimer) clearInterval(autorefreshTimer)
            BJUI.debug('BJUI.ajax: \'refreshlayout\' method: No argument, can not refresh DIV.(parameters:[selector/jQuery object/element])')
            return
        }
        if ($target && $target.length) {
            if (!$target.data('options')) {
                BJUI.debug('BJUI.ajax: \'refreshlayout\' method: The target(DIV) is not a reload layout!')
                return
            }
            $target.removeData('bjui.clientPaging')
            that.reloadlayout($target.data('options'))
        }
    }
    
    Bjuiajax.prototype.reloadlayout = function(option) {
        var $target = null,
            options = $.extend({}, typeof option === 'object' && option),
            arefre  = options && options.autorefresh && (isNaN(String(options.autorefresh)) ? 15 : options.autorefresh)
        
        if (options.target) {
            $target = options.target
            
            if (!($target instanceof jQuery))
                $target = $($target)
        }
        
        if (!$target || !$target.length) {
            if (autorefreshTimer) clearInterval(autorefreshTimer)
            BJUI.debug('BJUI.ajax: \'refreshlayout\' method: Not set loaded container, like [data-target].')
            return
        } else {
            if (!$target.data('options')) {
                BJUI.debug('BJUI.ajax: \'refreshlayout\' method: This target(DIV) is not initialized!')
                return
            }
            options = $.extend({}, $target.data('options'), options)
        }
        
        $target
            .addClass('bjui-layout')
            .data('options', options)
            .ajaxUrl({ type:options.type, url:options.url, data:options.data, loadingmask:options.loadingmask, callback:function(html) {
                    if (BJUI.ui.clientPaging && $target.data('bjui.clientPaging'))
                        $target.pagination('setPagingAndOrderby', $target)
                    if (options.callback)
                        options.callback.apply(this, [$target, html])
                    if (autorefreshTimer)
                        clearInterval(autorefreshTimer)
                    if (arefre)
                        autorefreshTimer = setInterval(function() { $target.bjuiajax('refreshlayout', $target) }, arefre * 1000)
                    if(!$target.height()) {
                        $target.css('position', 'static')
                    }
                }
            })
    }
    
    Bjuiajax.prototype.refreshdiv = function(divid) {
        if (divid && typeof divid === 'string') {
            var arr = divid.split(',')
            
            for (var i = 0; i < arr.length; i++) {
                this.refreshlayout('#'+ arr[i])
            }
        }
    }
    
    Bjuiajax.prototype.ajaxdownload = function(option) {
        var that = this, $target, options = $.extend({}, {loadingmask: false}, typeof option === 'object' && option)
        
        $.extend(that.options, options)
        
        if (options.target) {
            $target = options.target
            
            if (!($target instanceof jQuery))
                $target = $($target)
        }
        
        if (!$target || !$target.length)
            $target = $.CurrentDialog || $.CurrentNavtab
        
        that.$target = $target
        
        if (!options.url) {
            BJUI.debug('BJUI.ajax: \'ajaxdownload\' method: The url is undefined!')
            return
        } else {
            options.url = decodeURI(options.url).replacePlh($target)
            
            if (!options.url.isFinishedTm()) {
                BJUI.alertmsg('error', (options.warn || BJUI.regional.plhmsg))
                BJUI.debug('BJUI.ajax: \'ajaxdownload\' method: The url is incorrect: '+ options.url)
                return
            }
        }
        
        var todo = function() {
            var downloadOptions = {}
            
            downloadOptions.failCallback = function(responseHtml, url) {
                if (responseHtml.trim().startsWith('{')) responseHtml = responseHtml.toObj()
                that.ajaxdone(responseHtml)
                $target.trigger('bjui.ajaxError')
            }
            downloadOptions.prepareCallback = function(url) {
                if (options.loadingmask) {
                    $target.trigger('bjui.ajaxStart')
                }
            }
            downloadOptions.successCallback = function(url) {
                $target.trigger('bjui.ajaxStop')
            }
            
            if (options.type && !options.httpMethod)
                options.httpMethod = options.type
            
            $.extend(downloadOptions, options)
            
            if (!downloadOptions.data) downloadOptions.data = {}
            if (typeof downloadOptions.data.ajaxrequest === 'undefined') downloadOptions.data.ajaxrequest = true
            
            $.fileDownload(options.url, downloadOptions)
        }
        
        if (options.confirmMsg) {
            BJUI.alertmsg('confirm', options.confirmMsg, {
                okCall: function() {
                    todo()
                }
            })
        } else {
            todo()
        }
    }
    
    function Plugin(option) {
        var args     = arguments,
            property = option,
            ajax     = 'bjui.ajax',
            $body    = $('body')
        
        return this.each(function () {
            var $this   = $(this),
                options = $.extend({}, Bjuiajax.DEFAULTS, typeof option === 'object' && option),
                data    = $this.data(ajax),
                func
            
            if (!data) {
                data = new Bjuiajax(this, options)
            } else {
                if (this === $body[0]) {
                    data = new Bjuiajax(this, options)
                } else {
                    $.extend(data.options, typeof option === 'object' && option)
                }
            }
            
            $this.data(ajax, data)
            
            if (typeof property === 'string') {
                func = data[property.toLowerCase()]
                if ($.isFunction(func)) {
                    [].shift.apply(args)
                    if (!args) func()
                    else func.apply(data, args)
                }
            }
        })
    }
    
    var old = $.fn.bjuiajax
    
    $.fn.bjuiajax             = Plugin
    $.fn.bjuiajax.Constructor = Bjuiajax

    $.fn.bjuiajax.noConflict = function () {
        $.fn.bjuiajax = old
        return this
    }
    
    BJUI.ajax = function() {
        Plugin.apply($('body'), arguments)
    }

    $(document).on(BJUI.eventType.initUI, function(e) {
        if ($.fn.validator) {
            $(e.target).find('form[data-toggle="ajaxform"], form[data-toggle="ajaxsearch"]').each(function() {
                var $this = $(this), data = $this.data(), options = data.options,
                    valiOpts = {
                        validClass : 'ok',
                        msgClass   : 'n-bottom',
                        theme      : 'red_bottom_effect_grid'
                    }
                
                if (options) {
                    if (typeof options === 'string') options = options.toObj()
                    if (typeof options === 'object') {
                        delete data.options
                        $.extend(data, options)
                    }
                }
                if (typeof data.validate === 'undefined')
                    data.validate = true
                if (!data.validate) {
                    valiOpts.ignore = '*'
                }
                
                $this
                    .validator(valiOpts)
                    .on('valid.form', function(e) {
                        BJUI.ajax('_'+ data.toggle, $this, data)
                    })
                    .on('invalid.form', function(e, form, errors) {
                        if (data.alertmsg) BJUI.alertmsg('error', BJUI.regional.validatemsg.replaceMsg(errors.length))
                    })
            })
        }
    })
    
    $(document).on('submit.bjui.bjuiajax.data-api', 'form[data-toggle="ajaxform"], form[data-toggle="ajaxsearch"]', function(e) {
        if (!$.fn.validator) {
            var $this = $(this), data = $this.data(), options = data.options
            
            if (options) {
                if (typeof options === 'string') options = options.toObj()
                if (typeof options === 'object') {
                    delete data.options
                    $.extend(data, options)
                }
            }
            
            Plugin.call($this, '_'+ data.toggle, $this, data)
            
            e.preventDefault()
        }
    })
    
    $(document).on('click.bjui.bjuiajax.data-api', '[data-toggle="ajaxload"]', function(e) {
        var $this = $(this), data = $this.data(), options = data.options
        
        if (options) {
            if (typeof options === 'string') options = options.toObj()
            if (typeof options === 'object') {
                delete data.options
                $.extend(data, options)
            }
        }
        
        if (!data.url) data.url = $this.attr('href')
        
        Plugin.call($this, 'doload', data)
        
        e.preventDefault()
    })
    
    $(document).on(BJUI.eventType.initUI, function(e) {
        $(e.target).find('[data-toggle="autoajaxload"]').each(function() {
            var $element = $(this), data = $this.data(), options = data.options
            
            if (options) {
                if (typeof options === 'string') options = options.toObj()
                if (typeof options === 'object') {
                    delete data.options
                    $.extend(data, options)
                }
            }
            
            data.target = this
            Plugin.call($element, 'doload', data)
        })
    })
    
    $(document).on('click.bjui.bjuiajax.data-api', '[data-toggle="refreshlayout"]', function(e) {
        var $this = $(this), target = $this.data('target')
        
        Plugin.call($this, 'refreshlayout', target)
        
        e.preventDefault()
    })
    
    $(document).on('click.bjui.bjuiajax.data-api', '[data-toggle="reloadlayout"]', function(e) {
        var $this = $(this), data = $this.data()
        
        Plugin.call($this, 'reloadlayout', data)
        
        e.preventDefault()
    })
    
    $(document).on('click.bjui.bjuiajax.data-api', '[data-toggle="doajax"]', function(e) {
        var $this = $(this), data = $this.data(), options = data.options
        
        if (options) {
            if (typeof options === 'string') options = options.toObj()
            if (typeof options === 'object') {
                delete data.options
                $.extend(data, options)
            }
        }
        
        if (!data.url) data.url = $this.attr('href')
        
        Plugin.call($this, 'doajax', data)
        
        e.preventDefault()
    })
    
    $(document).on('click.bjui.bjuiajax.data-api', '[data-toggle="ajaxdownload"]', function(e) {
        var $this = $(this), data = $this.data(), options = data.options
        
        if (options) {
            if (typeof options === 'string') options = options.toObj()
            if (typeof options === 'object') {
                delete data.options
                $.extend(data, options)
            }
        }
        if (!data.url) data.url = $this.attr('href')
        
        Plugin.call($this, 'ajaxdownload', data)
        
        e.preventDefault()
    })

    exports('BJUIajax',new Bjuiajax());
});