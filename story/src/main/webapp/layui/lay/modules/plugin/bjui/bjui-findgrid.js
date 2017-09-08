

/* ========================================================================
 * B-JUI: bjui-findgrid.js  V1.31
 * @author K'naan
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-findgrid.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
 // FINDGRID GLOBAL ELEMENTS
    // ======================
    
    var group, suffix, pk, include, exclude, append, oldData, beforeSelect, onSelect, afterSelect, $box, $currentFindGrid
    
    // FINDGRID CLASS DEFINITION
    // ======================
    
    var FindGrid = function(element, options) {
        this.$element = $(element)
        this.options  = options
        this.$findBtn = null
    }
    
    FindGrid.DEFAULTS = {
        pk           : null,
        oldData      : null,
        group        : null,
        suffix       : null,
        include      : null,
        exclude      : null,
        multiple     : false,
        append       : false,
        empty        : true,
        dialogOptions: {
            id        : null,
            mask      : true,
            width     : 600,
            height    : 400,
            title     : 'FindGrid',
            maxable   : true,
            resizable : true
        },
        gridOptions : {
            width      : '100%',
            height     : '100%',
            tableWidth : '100%',
            columnMenu : false
        },
        context     : null,
        beforeSelect: null,
        onSelect    : null,
        afterSelect : null
    }
    
    FindGrid.EVENTS = {
        afterChange : 'afterchange.bjui.findgrid'
    }
    
    FindGrid.getField = function(key) {
        return (group ? (group +'.') : '') + (key) + (suffix ? suffix : '')
    }
    
    FindGrid.empty = function() {
        if (!include) {
            BJUI.debug('BJUI.FindGrid: No set options \'include\' !')
            return
        }
        
        var that = this, includes = include.split(','), $inputs = $box.find(':text, :input:hidden, textarea, select'), includeKeys = {}
        
        for (var i = 0; i < includes.length; i++) {
            var arr = includes[i].split(':'), key, fieldKey
            
            if (arr.length == 2) {
                fieldKey = arr[0].trim()
                key      = arr[1].trim()
            } else {
                fieldKey = includes[i].trim()
                key      = fieldKey
            }
            
            includeKeys[that.getField(fieldKey)] = true
        }
        
        for (key in includeKeys) {
            $inputs.filter('[name="'+ key +'"]')
                .val('')
                .trigger(FindGrid.EVENTS.afterChange, {value:'', data:''})
                .trigger('focus')
                .trigger('change')
        }
    }
    
    FindGrid.setSingle = function(data) {
        if (typeof onSelect === 'function') {
            onSelect.call(this, data)
            return
        }
        
        var that   = this
        var setVal = function($input, fieldKey, value) {
            var name = that.getField(fieldKey)
            
            if (name == $input.attr('name')) {
                $input
                    .val(value)
                    .trigger(FindGrid.EVENTS.afterChange, {value:value, data:data})
                    .trigger('focus')
                    .trigger('change')
                
                if ($input.isTag('select') && $input.data('toggle') && $input.data('toggle') === 'selectpicker') {
                    $input.selectpicker('refresh')
                }
            }
        }
        
        $box.find('input:text, input:hidden, textarea, select').each(function() {
            var $input = $(this), fieldKey, excludeKeys = []
            
            if (include) {
                var includes = include.split(',')
                
                for (var i = 0; i < includes.length; i++) {
                    var arr = includes[i].split(':'), key
                    
                    if (arr.length == 2) {
                        fieldKey = arr[0].trim()
                        key      = arr[1].trim()
                    } else {
                        fieldKey = includes[i].trim()
                        key      = fieldKey
                    }
                    
                    if (data && typeof data[key] !== 'undefined')
                        setVal($input, fieldKey, data[key])
                }
            } else {
                for (var key in data) {
                    if (exclude) {
                        $.each(exclude.split(','), function(i, n) {
                            excludeKeys.push(n.trim())
                        })
                        
                        if ($.inArray(key, excludeKeys) != -1) {
                            continue
                        }
                    }
                    
                    setVal($input, key, data[key])
                }
            }
        })
        
        if (typeof afterSelect === 'function') {
            afterSelect.call(that, data)
            return
        }
    }
    
    FindGrid.setMult = function(gridId) {
        var datas = $('#'+ gridId).data('selectedDatas')
        
        if (typeof beforeSelect === 'function') {
            if (!beforeSelect.apply(that, [datas])) {
                return false
            }
        }
        if (typeof onSelect === 'function') {
            onSelect.call(that, datas)
            return
        }
        
        var that = this, data, inputLen = 0, newVal
        var refreshSelect = function($input) {
            if ($input.isTag('select') && $input.data('toggle') && $input.data('toggle') === 'selectpicker') {
                $input.selectpicker('refresh')
            }
        }
        
        if (datas && datas.length) {
            var $inputs = $box.find('input:text, input:hidden, textarea, select'), fieldKey, includeKeys = {}, okObj = {}, excludeKeys = [], v
            
            if (!append && oldData)
                oldData = []
            
            if (include) {
                var includes = include.split(',')
                
                for (var i = 0; i < includes.length; i++) {
                    var arr = includes[i].split(':'), key, obj
                    
                    if (arr.length == 2) {
                        fieldKey = arr[0].trim()
                        key      = arr[1].trim()
                    } else {
                        fieldKey = includes[i].trim()
                        key      = fieldKey
                    }
                    
                    includeKeys[that.getField(fieldKey)] = key
                }
            } else {
                for (var key in datas[0]) {
                    if (exclude) {
                        $.each(exclude.split(','), function(i, n) {
                            excludeKeys.push(n.trim())
                        })
                        if ($.inArray(key, excludeKeys) === -1) {
                            includeKeys[that.getField(key)] = key
                        }
                    } else {
                        includeKeys[that.getField(key)] = key
                    }
                }
            }
            
            $inputs = $($.map($inputs, function(n) {
                var $n = $(n), name = $n.attr('name')
                
                if (!name) return null
                if (!includeKeys[name]) return null
                
                okObj[name] = includeKeys[name]
                
                return n
            }))
            
            for (var j = 0; j < datas.length; j++) {
                data = datas[j]
                
                if (oldData && $.inArray(data[pk], oldData) != -1 && !append)
                    continue
                
                $inputs.each(function(k) {
                    var $input = $(this), name = $input.attr('name'), value = $input.val()
                    
                    if (!newVal) newVal = new Array()
                    if (!newVal[k]) newVal[k] = []
                    
                    if (!append) {
                        $input.val('')
                        refreshSelect($input)
                    } else {
                        if (value) {
                            newVal[k].push(value)
                            
                            if ($input.isTag('select') && $input.prop('multiple')) {
                                newVal[k] = $.type(value) === 'array' ? value : []
                            }
                        }
                    }
                    
                    newVal[k].push(data[okObj[name]])
                    
                    if (oldData && $.inArray(data[pk], oldData) === -1)
                        oldData.push(data[pk])
                })
            }
            
            if (newVal) {
                $inputs.each(function(k) {
                    var $input = $(this)
                    
                    v = newVal[k].join(',')
                    
                    if ($input.isTag('select') && $input.prop('multiple'))
                        v = newVal[k]
                    
                    $input
                        .val(v)
                        .trigger(FindGrid.EVENTS.afterChange, {value:v, data:datas})
                        .trigger('change')
                    
                    $currentFindGrid.data('oldData', oldData)
                    
                    refreshSelect($input)
                })
            }
            
            if (typeof afterSelect === 'function') {
                afterSelect.call(that, data.data)
                return
            }
            
            BJUI.dialog('closeCurrent')
        }
    }
    
    FindGrid.prototype.init = function() {
        var that = this, options = this.options, gridOptions = options.gridOptions, tools = this.tools
        
        group            = options.group  || null
        suffix           = options.suffix || null
        $currentFindGrid = that.$element
        oldData          = options.oldData
        pk               = options.pk || null
        include          = options.include || null
        exclude          = options.exclude || null
        $box             = null
        
        if (options.context) {
            if (options.context instanceof jQuery)
                $box = options.context
            else
                $box = $(options.context)
        }
        if (!$box || !$box.length) {
            if (that.$element[0] === $('body')[0]) {
                $box = $.CurrentDialog || $.CurrentNavtab
            } else {
                $box = that.$element.closest('.unitBox')
            }
        }
        if (suffix)
            suffix = suffix.trim()
        
        if (pk) {
            if ($currentFindGrid.data('oldData')) {
                oldData = $currentFindGrid.data('oldData')
            } else {
                if (typeof oldData !== 'undefined') {
                    if (typeof oldData === 'string')
                        oldData = oldData.split(',')
                    else if (!$.isArray(oldData))
                        oldData = []
                } else {
                    oldData = []
                }
            }
        } else {
            oldData = null
        }
        
        if (gridOptions.dataUrl) {
            gridOptions.dataUrl = decodeURI(gridOptions.dataUrl).replacePlh($box)
            
            if (!gridOptions.dataUrl.isFinishedTm()) {
                BJUI.alertmsg('error', (options.warn || BJUI.regional.plhmsg))
                BJUI.debug('Findgrid Plugin: gridOptions -> dataUrl is incorrect: '+ gridOptions.dataUrl)
                return
            }
            
            gridOptions.dataUrl = encodeURI(gridOptions.dataUrl)
        }
        
        this.open(that.$element)
    }
    
    FindGrid.prototype.addBtn = function() {
        var that = this, $element = that.$element, options = $element.data('bjui.findgrid.options'), fluid = $element.attr('size') ? '' : ' fluid'
        
        if (!this.$findBtn && !$element.parent().hasClass('wrap_bjui_btn_box')) {
            this.$findBtn = $(FRAG.findgridBtn)
            this.$element.css({'paddingRight':'15px'}).wrap('<span class="wrap_bjui_btn_box'+ fluid +'"></span>')
            
            var $box   = this.$element.parent()
            var height = this.$element.addClass('form-control').innerHeight()
            
            $box.css({'position':'relative', 'display':'inline-block'})
            
            delete options.toggle
            
            that.$findBtn.data('bjui.findgrid.options', options)
            
            this.$findBtn.css({'height':height, 'lineHeight':height +'px'}).appendTo($box)
            this.$findBtn.on('selectstart', function() { return false })
        }
    }
    
    FindGrid.prototype.open = function($obj) {
        var that = this, options = this.options, dialogOptions = options.dialogOptions, gridOptions = options.gridOptions, timestamp = (new Date().getTime())
        
        if (!dialogOptions.id)
            dialogOptions.id = 'dialog_findgrid_'+ timestamp
        if (!options.gridId)
            options.gridId = 'datagrid_findgrid_'+ timestamp
        
        gridOptions.showToolbar = false
        
        if (options.empty) {
            if (!gridOptions.toolbarCustom) gridOptions.toolbarCustom = ''
            gridOptions.showToolbar = true
        }
        if (options.multiple) {
            gridOptions.showToolbar = true
            
            if (typeof gridOptions.showCheckboxcol === 'undefined') {
                gridOptions.showCheckboxcol = true
            }
            if (!gridOptions.toolbarCustom) gridOptions.toolbarCustom = ''
            
            gridOptions.selectMult  = true
            
            // set multiple
            gridOptions.toolbarCustom += '　<button type="button" class="btn-blue" onclick="$.fn.findgrid.Constructor.setMult(\''+ options.gridId +'\')">'+ (BJUI.getRegional('findgrid.choose')) +'</button>'
            gridOptions.toolbarCustom += '　<label class="ilabel"><input type="checkbox" data-toggle="icheck" id="checkbox_findgrid_'+ timestamp +'" '+ (options.append ? 'checked' : '') +'>&nbsp;'+ (BJUI.getRegional('findgrid.append')) +'</label>'
            
            append = options.append
        }
        
        if (options.empty)
            gridOptions.toolbarCustom += '　<button type="button" class="btn-orange" onclick="$.fn.findgrid.Constructor.empty(\''+ options.gridId +'\')">'+ (BJUI.getRegional('findgrid.empty')) +'</button>'
        
        delete dialogOptions.url
        delete dialogOptions.target
        
        if (options.onSelect) {
            onSelect = options.onSelect
            if (typeof onSelect === 'string') onSelect = onSelect.toFunc()
        } else {
            onSelect = null
        }
        if (options.beforeSelect) {
            beforeSelect = options.beforeSelect
            if (typeof beforeSelect === 'string') beforeSelect = beforeSelect.toFunc()
        } else {
            beforeSelect = null
        }
        if (options.afterSelect) {
            afterSelect = options.afterSelect
            if (typeof afterSelect === 'string') afterSelect = afterSelect.toFunc()
        } else {
            afterSelect = null
        }
        
        dialogOptions.html = '<div class="bjui-pageContent tableContent"><table id="'+ options.gridId +'"></table></div>'
        dialogOptions.onLoad = function($dialog) {
            var gridId = '#'+ options.gridId, $grid = $(gridId)
            
            $grid.datagrid(gridOptions)
            
            // after load - selected row by (oldData && pk)
            if ($.isArray(oldData) && oldData.length && pk) {
                $(document).on('afterLoad.bjui.datagrid', gridId, function(e, data) {
                    if (data.datas) {
                        $.each(data.datas, function(i, data) {
                            if (data[pk]) {
                                if ($.inArray(data[pk], oldData) != '-1') {
                                    $grid.datagrid('selectedRows', i, true)
                                }
                            }
                        })
                    }
                })
            }
            
            // set single
            if (!options.multiple) {
                $(document).on('clicked.bjui.datagrid.tr', gridId, function(e, data) {
                    if (typeof beforeSelect === 'function') {
                        if (!beforeSelect.apply(that, [data.data])) {
                            return false
                        }
                    }
                    if (typeof onSelect === 'function') {
                        onSelect.call(that, data.data)
                    } else {
                        FindGrid.setSingle(data.data)
                        BJUI.dialog('closeCurrent')
                    }
                })
            }
            
            // append checkbox
            $(document).on('ifChanged', '#checkbox_findgrid_'+ timestamp, function(e) {
                append = $(this).is(':checked')
            })
        }
        
        BJUI.dialog(dialogOptions)
    }
    
    // FINDGRID PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args     = arguments
        var property = option
        
        return this.each(function () {
            var $this   = $(this),
                options = {},
                data
            
            $.extend(true, options, FindGrid.DEFAULTS, typeof option === 'object' && option)
            
            data = new FindGrid(this, options)
            
            if (typeof property === 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                data.init()
            }
        })
    }
    
    var old = $.fn.findgrid
    
    $.fn.findgrid             = Plugin
    $.fn.findgrid.Constructor = FindGrid
    
    // FINDGRID NO CONFLICT
    // =================
    
    $.fn.findgrid.noConflict = function () {
        $.fn.findgrid = old
        return this
    }
    
    // NOT SELECTOR
    // ==============
    
    BJUI.findgrid = function(option) {
        Plugin.apply($('body'), [option])
    }
    
    // FINDGRID DATA-API
    // ==============
    
    $(document).on(BJUI.eventType.initUI, function(e) {
        $(e.target).find('input[data-toggle="findgrid"]').each(function() {
            var $this = $(this), data = $this.data(), options = data.options
            
            if (options) {
                if (typeof options === 'string') {
                    if (options.trim().startsWith('{')) 
                        options = options.toObj()
                    else
                        options = options.toFunc()
                }
                if (typeof options === 'function') {
                    options = options.apply()
                }
                if (typeof options === 'object') {
                    delete data.options
                    
                    $.extend(data, options)
                }
            }
            
            $this.data('bjui.findgrid.options', data)
            Plugin.call($this, 'addBtn')
        })
    })
    
    $(document).on('click.bjui.findgrid.data-api', '[data-toggle="findgridbtn"]', function(e) {
        var $this = $(this), opts = $this.data('bjui.findgrid.options')
        
        if (!opts) {
            var data = $this.data(), options = data.options
            
            if (options) {
                if (typeof options === 'string') {
                    if (options.trim().startsWith('{')) 
                        options = options.toObj()
                    else
                        options = options.toFunc()
                }
                if (typeof options === 'function') {
                    options = options.apply()
                }
                if (typeof options === 'object') {
                    delete data.options
                    
                    $.extend(data, options)
                }
            }
            opts = data
        }
        
        delete opts['bjui.findgrid.options']
        
        Plugin.call($this, opts)
        
        e.preventDefault()
    })
    
}(jQuery);