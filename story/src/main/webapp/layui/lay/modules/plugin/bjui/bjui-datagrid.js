

/* ========================================================================
 * B-JUI: bjui-datagrid.js  V1.31
 * @author K'naan
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-datagrid.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

layui.define(['BJUIpagination','BJUIbasedrag','BJUIicheck'], function(exports){
    "use strict";
    var $ = layui.BJUIextends,BJUI=layui.BJUIcore;
    
    // DATAGRID CLASS DEFINITION
    // ======================
    
    var Datagrid = function(element, options) {
        this.$element = $(element)
        this.options  = options
        this.tools    = this.TOOLS()
        
        this.datanames = {
            tbody      : 'bjui.datagrid.tbody.dom',
            td_html    : 'bjui.datagrid.td.html',
            changeData : 'bjui.datagrid.tr.changeData'
        }
        
        this.classnames = {
            s_checkbox    : 'datagrid-checkbox',
            s_linenumber  : 'datagrid-linenumber',
            s_edit        : 'datagrid-column-edit',
            s_lock        : 'datagrid-lock',
            s_menu        : 'datagrid-menu-box',
            s_filter      : 'datagrid-filter-box',
            s_showhide    : 'datagrid-showhide-box',
            th_cell       : 'datagrid-cell',
            th_menu       : 'datagrid-column-menu',
            btn_menu      : 'datagrid-column-menu-btn',
            th_col        : 'datagrid-col',
            th_field      : 'datagrid-col-field',
            th_sort       : 'datagrid-sortable',
            th_resize     : 'datagrid-resize-head',
            th_resizemark : 'datagrid-column-resizemark',
            tr_child      : 'datagrid-child-tr',
            tr_edit       : 'datagrid-edit-tr',
            tr_add        : 'datagrid-add-tr',
            tr_selected   : 'datagrid-selected-tr',
            td_edit       : 'datagrid-edit-td',
            td_changed    : 'datagrid-changed',
            td_child      : 'datagrid-child-td',
            td_linenumber : 'datagrid-linenumber-td',
            td_checkbox   : 'datagrid-checkbox-td',
            li_asc        : 'datagrid-li-asc',
            li_desc       : 'datagrid-li-desc',
            li_filter     : 'datagrid-li-filter',
            li_showhide   : 'datagrid-li-showhide',
            li_lock       : 'datagrid-li-lock',
            li_unlock     : 'datagrid-li-unlock'
        }
    }
    
    Datagrid.DEFAULTS = {
        gridTitle       : '',
        columns         : null,     // Thead column module
        data            : null,     // Data source
        dataUrl         : null,     // Request data source URL, for processing (filtering / sorting / paging) results
        updateRowUrl    : null,     // Update row data URL, return JSON data
        postData        : null,     // Send other data to server
        loadType        : 'POST',   // Ajax load request type
        dataType        : 'json',   // Data type of data source
        local           : 'remote', // Optional 'local' | 'remote'
        fieldSortable   : true,     // Click the field to sort
        filterThead     : true,     // Filter in the thead
        sortAll         : true,     // Sort scope, false = this page, true = all
        filterAll       : true,     // Filter scope, false = this page, true = all
        filterMult      : true,     // Filter multiple fileds, false = single, true = multiple
        initFilter      : {},       // 
        selectMult      : false,    // When clicked tr, multiple selected (Default need to press Ctrl or Shift or used checkbox)
        linenumberAll   : false,    // All data together numbers
        showLinenumber  : true,     // Display linenumber column, Optional 'true' | 'false' | 'lock', (Optional 'true, false' is a boolean)
        showCheckboxcol : false,    // Display checkbox column, Optional 'true' | 'false' | 'lock', (Optional 'true, false' is a boolean)
        showChildcol    : undefined,// Display child button column, Optional 'true' | 'false' | 'lock', (Optional 'true, false' is a boolean). If not set false and 'hasChild == true', showChildcol = true
        showEditbtnscol : false,    // Display edit buttons column, Optional 'true' | 'false' | 'edit', (Optional 'true, false' is a boolean, Optional 'edit' is custom column label)
        customEditbtns  : {         // Custom edit column buttons
            position    : 'after',  // Button inserted position, Optional 'after' | 'before' | 'replace'
            buttons     : null,     // Custom buttons, Set string or function
            width       : 0         // The edit column width, 0 = 'auto'
        },
        showTfoot       : false,    // Display the tfoot, Optional 'true' | 'false' | 'lock', (Optional 'true, false' is a boolean)
        showToolbar     : false,    // Display datagrid toolbar
        showNoDataTip   : true,     // Display 'no data' tips, Optional 'true' | 'false' | 'string', (Optional 'true, false' is a boolean, Optional 'string' is custom tips)
        toolbarItem     : '',       // Displayed on the toolbar elements, Optional 'all, add, edit, cancel, save, del, import, export, exportf |'
        toolbarCustom   : '',       // Html code || function || jQuery dom object, custom elements, displayed on the toolbar
        columnResize    : true,     // Allow adjust the column width
        columnMenu      : true,     // Display the menu button on the column
        columnShowhide  : true,     // On the menu display (show / hide columns)
        columnFilter    : false,    // On the menu display (filter form)
        columnLock      : true,     // On the menu display (lock / unlock columns)
        paging          : true,     // Display pagination component
        pagingAlign     : 'center', // The pagination component alignment
        keys            : {
            gridChild   : 'gridChild',
            gridNumber  : 'gridNumber',
            gridCheckbox: 'gridCheckbox',
            gridEdit    : 'gridEdit',
            gridIndex   : 'gridIndex',
            dropFlag    : 'dropFlag',
            treePTr     : 'datagrid.tree.parentTr',
            treePData   : 'datagrid.tree.parentData',
            childlen    : 'childlen',
            isExpand    : 'isExpand',
            isParent    : 'isparent'
        },
        hasChild        : false,    // It contains child data, Optional (true | false)
        childOptions    : {         // Child grid options
            width       : '100%',
            height      : 'auto',
            paging      : false,
            columnMenu  : false,
            filterThead : false,
            childUpdate : false     // This options only for childOptions, when the child grid data changes, update the parent row(!! The parent grid neeed option 'updateRowUrl' !!), Optional (Boolean: true | false, true = 'all') OR (String: 'all, add, edit, del')
        },
        isTree          : false,
        treeOptions     : {
            keys        : {
                key       : 'id',
                parentKey : 'pid',
                childKey  : 'children',
                childLen  : 'childlen',
                isParent  : 'isparent',
                level     : 'level',
                order     : 'order',
                isExpand  : 'isExpand'
            },
            simpleData  : true,
            expandAll   : false,
            add         : true
        },
        dropOptions     : {
            drop        : false,
            dropUrl     : null,
            paging      : true,     // send paging data
            scope       : 'drop',   // send data scope, Optional 'drop' | 'all'
            beforeDrag  : null,     // Function - before drag, return true can drag
            beforeDrop  : null,     // Function - before drop, return false cancel drop
            afterDrop   : 'POST'    // Post(Ajax) the current page data to server, request type = editType. Optional ('POST' | function), If set a function, doesn't post
        },
        tdTemplate      : '',
        editUrl         : null,     // An action URL, for processing (update / save), return results (json)
        editCallback    : null,     // Callback for save
        editMode        : 'inline', // Editing mode, Optional 'false' | 'inline' | 'dialog', (Optional 'false' is a boolean)
        editDialogOp    : null,     // For dialog edit, the dialog init options
        editType        : 'POST',   // Ajax request method of edit, Optional 'POST' | 'GET' | 'raw', (Optional 'raw' is post raw data)
        inlineEditMult  : true,     // Can inline edit multiple rows
        saveAll         : true,     // For inline edit, true = save current row, false = save all editing rows
        addLocation     : 'first',  // Add rows to datagrid location, Optional 'first' | 'last' | 'prev' | 'next'
        delUrl          : null,     // The delete URL, return delete tr results (json)
        delType         : 'POST',   // Delete URL of ajax request method
        delPK           : null,     // Ajax delete request to send only the primary key
        delConfirm      : true,     // Delete confirmation message, Optional 'true' | 'false' | 'message', (Optional 'true, false' is a boolean)
        delCallback     : null,     // Callback for delete
        jsonPrefix      : '',       // JSON object key prefix, for post data
        contextMenuH    : true,     // Right-click on the thead, display the context menu
        contextMenuB    : false,    // Right-click on the tbody tr, display the context menu
        templateWidth   : 600,      // 
        flowLayoutWidth : 0,        // 
        dialogFilterW   : 360,      // 
        hScrollbar      : false,    // Allowed horizontal scroll bar
        fullGrid        : false,    // If the table width below gridbox width, stretching table width
        importOption    : null,     // Import btn options
        exportOption    : null,     // Export btn options
        beforeEdit      : null,     // Function - before edit method, return true execute edit method
        beforeDelete    : null,     // Function - before delete method, return true execute delete method
        beforeSave      : null,     // Function - before save method, arguments($trs, datas)
        afterSave       : null,     // Function - after save method, arguments($trs, datas)
        afterDelete     : null      // Function - after delete method
    }
    
    Datagrid.renderItem = function(value, data, items, itemattr) {
        if (!items || !items.length) return ''
        var label = ''
        
        $.each(items, function(i, n) {
            if (itemattr && itemattr.value) {
                if (n[itemattr.value] == value) {
                    label = n[itemattr.label]
                    return false
                }
            } else {
                if (typeof n[value] !== 'undefined') {
                    label = n[value]
                    return false
                }
            }
        })
        
        return label
    }
    
    Datagrid.renderItemMulti = function(value, data, items, itemattr) {
        if (!items || !items.length) return ''
        var label = [], val = $.type(value) === 'array' ? value : String(value).split(',')
        
        $.each(items, function(i, n) {
            $.each(val, function(k, v) {
                if (itemattr && itemattr.value) {
                    if (n[itemattr.value] == v) {
                        label.push(n[itemattr.label])
                        return false
                    }
                } else {
                    if (typeof n[v] !== 'undefined') {
                        label.push(n[v])
                        return false
                    }
                }
            })
        })
        
        return label.join(',')
    }
    
    Datagrid.prototype.TOOLS = function() {
        var that  = this, options = that.options
        var tools = {
            getPageCount: function(pageSize, total) {
                return Math.ceil(total / pageSize)
            },
            getPageInterval: function(count, pageNum, showPageNum) {
                var half  = Math.ceil(showPageNum / 2), limit = count - showPageNum,
                    start = pageNum > half ? Math.max(Math.min(pageNum - half, limit), 0) : 0,
                    end   = pageNum > half ? Math.min((pageNum + half), count) : Math.min(showPageNum, count)
                
                if (end - start == showPageNum) end = end + 1
                if (end < showPageNum) end = end + 1
                if (start + 1 == end) end = end + 1
                
                return {start:start + 1, end:end}
            },
            getRight: function($obj) {
                var width = 0, index = $obj.data('index'), model = that.columnModel
                
                for (var i = index; i >= 0; i--) {
                    width += model[i].th.outerWidth()
                }
                
                return width
            },
            getRight4Lock: function(index) {
                var width = 0, $td = that.$lockTbody.find('> tr:first > td:eq('+ index +')'), $firstTds = $td && $td.prevAll().add($td)
                
                if (!$firstTds || !$firstTds.length) $firstTds = that.$lockColgroupH.filter(':lt('+ (index + 1) +')')
                $firstTds.each(function() {
                    var $td = $(this), w = $td.is(':hidden') ? 0 : $td.outerWidth()
                    
                    width += w
                })
                
                return width
            },
            beforeEdit: function($trs, datas) {
                var beforeEdit = options.beforeEdit
                
                if (beforeEdit) {
                    if (typeof beforeEdit === 'string') beforeEdit = beforeEdit.toFunc()
                    if (typeof beforeEdit === 'function') {
                        return beforeEdit.call(that, $trs, datas)
                    }
                }
                
                return true
            },
            beforeSave: function($trs, data) {
                var beforeSave = options.beforeSave
                
                if (beforeSave) {
                    if (typeof beforeSave === 'string') beforeSave = beforeSave.toFunc()
                    if (typeof beforeSave === 'function') {
                        return beforeSave.call(that, $trs, data)
                    }
                }
                
                return true
            },
            afterSave: function($trs, data) {
                var afterSave = options.afterSave, childUpdate = that.options.childUpdate, $parent = that.$element.data('bjui.datagrid.parent'),
                    updateParent = function($tr) {
                        $tr.closest('table').datagrid('updateRow', $tr)
                    }
                
                if (afterSave) {
                    if (typeof afterSave === 'string') afterSave = afterSave.toFunc()
                    if (typeof afterSave === 'function') {
                        afterSave.call(that, $trs, data)
                    }
                }
                
                // remove add data
                $trs.each(function() {
                    $(this).removeData('datagrid.addData')
                })
                
                // update child parent
                if ($parent && childUpdate) {
                    if (typeof childUpdate === 'string' && childUpdate.indexOf('all') === -1) {
                        if (data.addFlag && childUpdate.indexOf('add') !== -1)
                            updateParent($parent)
                        else if (childUpdate.indexOf('edit') !== -1)
                            updateParent($parent)
                    } else {
                        updateParent($parent)
                    }
                }
                
                if (that.needfixedWidth) {
                    that.fixedWidth()
                    that.needfixedWidth = false
                }
                
                // fixedH
                if (options.height === 'auto') {
                    var scrollTop = that.$boxB.scrollTop()
                    
                    that.$boxB.scrollTop(5)
                    if (that.$boxB.scrollTop()) {
                        that.fixedHeight()
                        that.$boxB.scrollTop(scrollTop)
                    }
                }
                
                that.$element.data('allData', that.allData)
            },
            afterDelete: function() {
                var afterDelete = options.afterDelete
                
                if (afterDelete) {
                    if (typeof afterDelete === 'string') afterDelete = afterDelete.toFunc()
                    if (typeof afterDelete === 'function') {
                        afterDelete.call(that)
                    }
                }
                
                that.$element.data('allData', that.allData)
            },
            // Correct colspan
            setColspan: function(column, colspanNum) {
                if (column.colspan) column.colspan = column.colspan + colspanNum - 1
                column.index = column.index + colspanNum - 1
                if (column.parent) this.setColspan(column.parent, colspanNum)
            },
            // set columns options
            setOp: function(op) {
                if (!op.name) {
                    op.menu = op.lock = op.edit = op.add = op.quickSort = op.quickfilter = false
                } else {
                    op.menu        = (typeof op.menu        === 'undefined') ? true  : op.menu
                    op.lock        = (typeof op.lock        === 'undefined') ? true  : op.lock
                    op.edit        = (typeof op.edit        === 'undefined') ? true  : op.edit
                    op.add         = (typeof op.add         === 'undefined') ? true  : op.add
                    op.quicksort   = (typeof op.quicksort   === 'undefined') ? true  : op.quicksort
                    op.quickfilter = (typeof op.quickfilter === 'undefined') ? true  : op.quickfilter
                    op.finalWidth  = (typeof op.finalWidth  === 'undefined') ? false : op.finalWidth
                }
                op.hide = (typeof op.hide === 'undefined') ? false : op.hide
                
                return op
            },
            json2Array4Tree: function (options, datas, level, pid) {
                if (!datas) return []
                if (!level) level = 0
                
                var k = options.key, pk = options.parentKey, childKey = options.childKey, childLen = options.childLen, levelKey = options.level, isParent = options.isParent, r = [], data
                
                if (datas) {
                    datas.sort(function(a, b) {
                        return a[options.order] - b[options.order]
                    })
                }
                
                if ($.isArray(datas)) {
                    for (var i = 0, l = datas.length; i < l; i++) {
                        data = $.extend({}, datas[i])
                        
                        data[levelKey] = level
                        r.push(data)
                        
                        if (data[childKey]) {
                            delete data[childKey]
                            data[isParent] = true
                            data[childLen] = datas[i][childKey].length
                            pid = data[k]
                            
                            r = r.concat(this.json2Array4Tree(options, datas[i][childKey], data[levelKey] + 1, pid))
                            
                            pid = null
                        }
                    }
                } else {
                    data = $.extend({}, datas)
                    
                    data[levelKey] = level
                    r.push(data)
                    
                    if (data[childKey]) {
                        delete data[childKey]
                        data[isParent] = true
                        data[childLen] = datas[childKey].length
                        pid = data[k]
                        
                        r = r.concat(this.json2Array4Tree(options, datas[childKey], data[levelKey] + 1))
                        
                        pid = null
                    }
                }
                
                return r
            },
            array2Json4Tree: function(options, datas) {
                var r = [], temp = [], keys = options.keys, key = keys.key, parentKey = keys.parentKey, childKey = keys.childKey
                
                if (!$.isArray(datas)) return [datas]
                
                for (var i = 0, l = datas.length; i < l; i++) {
                    temp[datas[i][key]] = datas[i]
                }
                for (var i = 0, l = datas.length; i < l; i++) {
                    if (datas[i][parentKey] && datas[i][key] !== datas[i][parentKey]) {
                        if (!temp[datas[i][parentKey]])
                            temp[datas[i][parentKey]] = []
                        if (!temp[datas[i][parentKey]][childKey])
                            temp[datas[i][parentKey]][childKey] = []
                        
                        temp[datas[i][parentKey]][childKey].push(datas[i])
                    } else {
                        r.push(datas[i])
                    }
                }
                
                return r
            },
            // create trs by data source
            createTrsByData: function(data, refreshFlag) {
                var list
                
                if (!that.$tbody) that.$tbody = $('<tbody></tbody>')
                if (data) {
                    if (data.data) list = data.data.list
                    else list = data
                    
                    that.paging.total = data.data.total || 0
                    
                    // for tree
                    if (that.options.isTree) {
                        if (that.options.treeOptions.simpleData) {
                            list = this.array2Json4Tree(that.options.treeOptions, list)
                            list = this.json2Array4Tree(that.options.treeOptions.keys, list)
                        } else {
                            list = this.json2Array4Tree(that.options.treeOptions.keys, list)
                        }
                    }
                    
                    if (list && !$.isArray(list))
                        list = [list]

                    that.paging.total = data.data.total || 0
                    
                    if (!that.paging.total)
                        list = []
                    
                    if (typeof data === 'object' && that.paging.total) {
                        if (data[BJUI.pageInfo.total]) that.paging.total = parseInt(data[BJUI.pageInfo.total], 10)
                        if (data[BJUI.pageInfo.pageSize]) {
                            if (refreshFlag && that.paging.pageSize != data[BJUI.pageInfo.pageSize]) {
                                that.$boxP && that.$boxP.trigger('bjui.datagrid.paging.pageSize', data[BJUI.pageInfo.pageSize])
                            }
                            that.paging.pageSize = parseInt(data[BJUI.pageInfo.pageSize], 10)
                        }
                    }
                    
                    that.paging.pageCount = tools.getPageCount(that.paging.pageSize, that.paging.total)
                    
                    if (that.paging.pageNum > that.paging.pageCount) that.paging.pageNum = that.paging.pageCount
                    if (!that.paging.pageNum) that.paging.pageNum = 1
                    
                    this.initTbody(list, refreshFlag)
                }
                
                if (!that.init_tbody) that.$tbody.appendTo(that.$tableB)
                if (!that.init_thead) that.initThead()
            },
            // initTbody
            initTbody: function(data, refreshFlag) {
                var tools  = this, allData = that.allData, type = options.dataType || 'json', model = that.columnModel, hiddenFields = that.hiddenFields, regional = that.regional, newData = [], attach = that.attach, json
                var paging = that.paging, start = 0, end = paging.pageSize, keys = that.options.keys
                var doInit = function() {
                    type = type.toLowerCase()
                    if (data) allData = that.allData = data
                    
                    that.$element.data('allData', that.allData)
                    
                    if (!allData.length) {
                        end = 0
                    } else {
                        if (options.local === 'local') {
                            start = (paging.pageSize * (paging.pageNum - 1))
                            end   = start + paging.pageSize
                            if (paging.total != allData.length) paging.total = allData.length
                            if (start > allData.length) start = paging.pageSize * (paging.pageCount - 1)
                        } else {
                            if (allData.length > paging.pageSize) end = paging.pageSize
                        }
                    }
                    if (end > allData.length) end = allData.length
                    
                    // array to json
                    if (type === 'array' && data && data.length && $.type(data[0]) === 'array') {
                        var a1 = start, a2 = end, arrData = [], _index
                        
                        if (options.local === 'local') {
                            a1 = 0
                            a2 = allData.length
                        }
                        for (var i = a1; i < a2; i++) {
                            json   = {}
                            _index = 0
                            $.each(allData[i], function(k, v) {
                                var obj, val = v
                                
                                if (model[_index] && model[_index][keys.gridChild])    _index ++
                                if (model[_index] && model[_index][keys.gridNumber])   _index ++
                                if (model[_index] && model[_index][keys.gridCheckbox]) _index ++
                                if (typeof val === 'string') val = '"'+ val +'"'
                                
                                if (model[_index] && !model[_index][keys.gridEdit]) {
                                    obj = '{"'+ model[_index].name +'":'+ val +'}'
                                    $.extend(json, JSON.parse(obj))
                                } else { // init hidden fields
                                    if (model[_index] && model[_index][keys.gridEdit]) _index ++
                                    if (_index >= model.length && hiddenFields) {
                                        if (hiddenFields[k - model.length]) {
                                            obj = '{"'+ hiddenFields[k - model.length] +'":'+ val +'}'
                                            $.extend(json, JSON.parse(obj))
                                        }
                                    }
                                }
                                _index ++
                            })
                            
                            arrData.push(json)
                        }
                        
                        allData = that.allData = arrData
                    }
                    
                    // create cuttent page data
                    for (var i = start; i < end; i++) {
                        json = $.extend({}, that.allData[i], attach)
                        
                        /* for quickSort */
                        if (options.local === 'local' && !refreshFlag) {
                            json['bjui_local_index'] = i
                            that.allData[i]['bjui_local_index'] = i
                        }
                        
                        newData.push(json)
                    }
                    
                    tools.createTrs(newData, refreshFlag)
                    
                    that.data = newData
                    
                    that.$element.trigger('afterLoad.bjui.datagrid', {datas:newData})
                }
                
                if (refreshFlag && that.$boxM) {
                    that.$boxM.show().trigger('bjui.ajaxStop').trigger('bjui.ajaxStart', [50, doInit])
                } else {
                    doInit()
                }
            },
            // create tbody - tr
            createTrs: function(datas, refreshFlag) {
                var tools = this, keys = that.options.keys, model = that.columnModel, paging = that.paging, trs = [], editFrag = BJUI.doRegional(FRAG.gridEditBtn, that.regional), childFrag = BJUI.doRegional(FRAG.gridExpandBtn, that.regional), lockedCols = [], isRenderOnly = false,
                    customEditbtns = that.options.customEditbtns, editFrag2 = customEditbtns.buttons
                    
                // custom edit column buttons
                if (editFrag2) {
                    if (typeof editFrag2 === 'function')
                        editFrag2 = editFrag2.apply()
                    
                    if (editFrag2) {
                        if (customEditbtns.position === 'before')
                            editFrag = editFrag2 + editFrag
                        else if (customEditbtns.position === 'replace')
                            editFrag = editFrag2
                        else
                            editFrag += editFrag2
                    }
                }
                
                if (refreshFlag) {
                    // remebered lock columns
                    $.each(model, function(i, n) {
                        if (n.locked) {
                            that.colLock(n.th, false)
                            n.lock_refresh = true
                        }
                    })
                    
                    if (that.$tbody.find('> tr.datagrid-nodata').length) {
                        that.needfixedWidth = true
                    }
                    
                    that.$tbody.empty()
                    that.$lockTableH && that.$lockTableH.empty()
                    that.$lockTableB && that.$lockTableB.empty()
                }
                
                if (!datas.length && !refreshFlag) {
                    var emptyObj = {}
                    
                    emptyObj[model[0].name] = '0'
                    isRenderOnly = true
                    datas = []
                    datas.push(emptyObj)
                }
                
                for (var i = 0, l = datas.length; i < l; i++) {
                    var trData = datas[i], modellength = model.length, tempcolspan = modellength, linenumber = options.linenumberAll ? ((paging.pageNum - 1) * paging.pageSize + (i + 1)) : (i + 1),
                        tds = [], n, tdHtml = BJUI.StrBuilder(), $td, name, label, _label, render_label, align, cls, display, tree, hasTree = false, treeattr = '', tdTemplate = options.tdTemplate
                    
                    trData[keys.gridNumber] = linenumber
                    trData[keys.gridIndex]  = i
                    
                    if (that.options.hasChild && that.options.childOptions)
                        tempcolspan = tempcolspan - 1
                    if (that.options.showLinenumber)
                        tempcolspan = tempcolspan - 1
                    if (that.options.showCheckboxcol)
                        tempcolspan = tempcolspan - 1
                    
                    var tempData = $.extend({}, trData)
                    
                    for (var j = 0; j < modellength; j++) {
                        n       = model[j] 
                        name    = n.name || 'datagrid-noname'
                        label   = trData[name]
                        align   = ''
                        cls     = []
                        _label  = ''
                        display = ''
                        tree    = ''
                        render_label = undefined
                        
                        if (typeof label === 'undefined' || label === 'null' || label === null) label = ''
                        _label = label
                        
                        if (n.align) align = ' align="'+ n.align +'"'
                        if (n[keys.gridChild]) label = childFrag
                        if (n[keys.gridCheckbox]) label = '<div><input type="checkbox" data-toggle="icheck" name="datagrid.checkbox" value="true"></div>'
                        if (n[keys.gridEdit]) {
                            label = editFrag
                            cls.push(that.classnames.s_edit)
                        }
                        if (options.hScrollbar) {
                            if (!n.width || n.width === 'auto')
                                cls.push('nowrap')
                        }
                        
                        /* for tfoot */
                        /*if (n.calc) {
                            if (!n.calc_count) n.calc_count = datas.length
                            
                            var number = label ? (String(label).isNumber() ? Number(label) : 0) : 0
                            
                            if (n.calc === 'sum' || n.calc === 'avg') n.calc_sum = (n.calc_sum || 0) + number
                            else if (n.calc === 'max') n.calc_max = n.calc_max ? (n.calc_max < number ? number : n.calc_max) : number
                            else if (n.calc === 'min') n.calc_min = n.calc_min ? (n.calc_min > number ? number : n.calc_min) : number
                        }*/
                        
                        if (n[keys.gridChild])    cls.push(that.classnames.td_child)
                        if (n[keys.gridNumber])   cls.push(that.classnames.td_linenumber)
                        if (n[keys.gridCheckbox]) cls.push(that.classnames.td_checkbox)
                        
                        if (cls.length) cls = cls.join(' ')
                        else cls = ''
                        
                        if (refreshFlag && n.hidden) display = ' style="display:none;"'
                        
                        /* render */
                        if (n.items && !n.render) {
                            if (n.attrs && n.attrs['multiple'])
                                n.render = $.datagrid.renderItemMulti
                            else
                                n.render = $.datagrid.renderItem
                        }
                        if (n.render && typeof n.render === 'string') n.render = n.render.toFunc()
                        if (n.render && typeof n.render === 'function') {
                            if (n.items) {
                                if (typeof n.items === 'string') {
                                    if (n.items.trim().startsWith('[')) n.items = n.items.toObj()
                                    else n.items = n.items.toFunc()
                                }
                                
                                if (!that.renderTds) that.renderTds = []
                                
                                var delayRender = function(index, label, trData, n) {
                                    $.when(n.items.call(that)).done(function(item) {
                                        n.items = item
                                        
                                        that.delayRender --
                                    })
                                }
                                
                                if (typeof n.items === 'function') {
                                    if (!i) {
                                        if (!that.delayRender) that.delayRender = 0
                                        that.delayRender ++
                                        delayRender((i * j), _label, trData, n)
                                    }
                                    n.delayRender = true
                                    that.renderTds.push({trindex:i, tdindex:j, label:_label, data:trData, render:n.render})
                                } else {
                                    delete n.delayRender
                                    render_label = n.render.call(that, _label, trData, n.items, n.itemattr)
                                }
                            } else {
                                render_label = n.render.call(that, _label, trData)
                            }
                        }
                        
                        if (options.isTree && !hasTree && (!(n === that.childColumn || n === that.linenumberColumn || n === that.checkboxColumn || n === that.editBtnsColumn) || that.treeColumn)) {
                            if (typeof options.isTree === 'string') {
                                if (n.name && n.name === options.isTree)
                                    hasTree = true
                            } else {
                                hasTree = true
                            }
                            
                            if (hasTree) {
                                !that.treeColumn && (that.treeColumn = n)
                                n.hasTree = true
                                !trData[options.treeOptions.keys.level] && (trData[options.treeOptions.keys.level] = 0)
                                tree  = that.tools.createTreePlaceholder(trData, (render_label || label))
                                align = ' align="left"'
                                
                                if (cls) {
                                    cls += ' datagrid-tree-td'
                                } else {
                                    cls = 'datagrid-tree-td'
                                }
                                
                                treeattr = ' data-child="'+ (trData[options.treeOptions.keys.childLen] || 0) +'" data-level="'+ trData[options.treeOptions.keys.level] +'" class="datagrid-tree-tr datagrid-tree-level-'+ trData[options.treeOptions.keys.level] +'"'
                            }
                        }
                        
                        cls && (cls = ' class="'+ cls +'"')
                        
                        if (that.isTemplate) {
                            if (!n.delayRender) {
                                tempData[n.name] = (typeof render_label === 'undefined' ? label : render_label)
                            } else {
                                delete tempData[n.name]
                            }
                            if (!tds[0] && j == (modellength - 1)) {
                                if (tdTemplate && typeof tdTemplate === 'function')
                                    tdTemplate = tdTemplate.apply(that, [trData])
                                
                                tdTemplate = that.tools.replacePlh4Template(tdTemplate, tempData, true)
                                
                                if (that.options.hasChild && that.options.childOptions) {
                                    display = that.childColumn.hidden ? ' style="display:none;"' : ''
                                    tds[0]  = ['<td data-title="..." align="center" class="datagrid-child-td"'+ display +'><div>'+ childFrag +'</div></td>']
                                }
                                if (that.options.showLinenumber) {
                                    display = that.linenumberColumn.hidden ? ' style="display:none;"' : ''
                                    
                                    var linenumbertd = ['<td data-title="No." align="center" class="datagrid-linenumber-td"'+ display +'>'+ linenumber +'</td>']
                                    
                                    tds[tds.length] = linenumbertd
                                }
                                if (that.options.showCheckboxcol) {
                                    display = that.checkboxColumn.hidden ? ' style="display:none;"' : ''
                                    
                                    var checkboxtd = ['<td data-title="Checkbox" align="center" class="datagrid-checkbox-td"'+ display +'><div><input type="checkbox" data-toggle="icheck" name="datagrid.checkbox" value="true"></div></td>']
                                    
                                    tds[tds.length] = checkboxtd
                                }
                                
                                var temptd = ['<td class="datagrid-template-td" colspan="'+ tempcolspan +'">'+ tdTemplate +'</td>']
                                
                                tds[tds.length] = temptd
                                
                                treeattr = ' class="datagrid-template-tr"'
                            }
                        } else {
                            tdHtml
                                .add('<td data-title="'+ n.label +'"')
                                .add(align)
                                .add(cls)
                                .add(display)
                                .add('>')
                            
                            if (tree) {
                                tdHtml.add(tree)
                            } else {
                                tdHtml
                                    .add('<div>')
                                    .add(typeof render_label === 'undefined' ? label : render_label)
                                    .add('</div>')
                            }
                            
                            tdHtml.add('</td>')
                            tds.push(tdHtml.toString())
                        }
                    }
                    
                    trs.push('<tr'+ treeattr +'>'+ tds.join('') +'</tr>')
                    
                    if (isRenderOnly) {
                        trs = []
                        trs.push(tools.createNoDataTr(true) || '')
                    } else {
                        trs.push(tools.createChildTr(null, trData))
                    }
                }
                
                that.$tbody.html(trs.join(''))
                
                if (refreshFlag) {
                    that.initEvents()
                    if (options.editMode) that.edit()
                    
                    if (!datas.length)
                        tools.createNoDataTr()
                    
                    that.$boxP && that.$boxP.trigger('bjui.datagrid.paging.jump')
                    
                    // locked
                    $.each(model, function(i, n) {
                        if (n.lock_refresh) {
                            that.colLock(n.th, true)
                            delete n.lock_refresh
                        }
                    })
                    
                    setTimeout(function() {
                        that.$tableB.initui()
                        that.$lockTableB && that.$lockTableB.initui()
                        
                        that.fixedHeight()
                        
                        if (that.needfixedWidth) {
                            that.fixedWidth()
                            that.needfixedWidth = null
                        }
                        
                        that.$boxM && that.$boxM.trigger('bjui.ajaxStop').hide()
                        
                        // for initFilter
                        if (that.doInitFilter) {
                            that.tools.initFilter()
                            that.doInitFilter = undefined
                        }
                    }, datas.length + 1)
                }
            },
            coverTemplate: function() {
                var tools = this, options = that.options, datas = that.data, model = that.columnModel, trs
                
                if (that.isTemplate) {
                    trs = that.$grid.data('bjui.datagrid.trs.template')
                    
                    if (!trs)
                        tools.createTrs(datas, true)
                    else {
                        that.$tbody.html(trs)
                        
                        that.initEvents()
                        if (options.editMode) that.edit()
                        
                        if (!datas.length)
                            tools.createNoDataTr()
                        
                        that.$boxP && that.$boxP.trigger('bjui.datagrid.paging.jump')
                        
                        // locked
                        $.each(model, function(i, n) {
                            if (n.lock_refresh) {
                                that.colLock(n.th, true)
                                delete n.lock_refresh
                            }
                        })
                        
                        setTimeout(function() {
                            that.$tableB.initui()
                            that.$lockTableB && that.$lockTableB.initui()
                            
                            that.fixedHeight()
                            
                            that.$boxM && that.$boxM.trigger('bjui.ajaxStop').hide()
                            
                            // for initFilter
                            if (that.doInitFilter) {
                                that.tools.initFilter()
                                that.doInitFilter = undefined
                            }
                        }, datas.length + 1)
                    }
                } else {
                    trs = that.$grid.data('bjui.datagrid.trs.normal')
                    
                    if (!trs)
                        this.createTrs(datas, true)
                    else {
                        that.$tbody.html(trs)
                        
                        that.initEvents()
                        if (options.editMode) that.edit()
                        
                        if (!datas.length)
                            tools.createNoDataTr()
                        
                        that.$boxP && that.$boxP.trigger('bjui.datagrid.paging.jump')
                        
                        // locked
                        $.each(model, function(i, n) {
                            if (n.lock_refresh) {
                                that.colLock(n.th, true)
                                delete n.lock_refresh
                            }
                        })
                        
                        setTimeout(function() {
                            that.$tableB.initui()
                            that.$lockTableB && that.$lockTableB.initui()
                            
                            that.fixedHeight()
                            
                            that.$boxM && that.$boxM.trigger('bjui.ajaxStop').hide()
                            
                            // for initFilter
                            if (that.doInitFilter) {
                                that.tools.initFilter()
                                that.doInitFilter = undefined
                            }
                        }, datas.length + 1)
                    }
                }
                
                setTimeout(function() {
                    that.initFixedW = false
                    that.hasAutoCol = true
                    that.fixedWidth(true)
                }, 300)
            },
            replacePlh: function(url, data) {
                return url.replace(/{\/?[^}]*}/g, function($1) {
                    var key = $1.replace(/[{}]+/g, ''), val = data[key]
                    
                    if (typeof val === 'undefined' || val === 'null' || val === null)
                        val = ''
                    
                    return val
                })
            },
            replacePlh4Template: function(html, data, replaceAll) {
                return html.replace(/{#\/?[^}]*}/g, function($1) {
                    var key = $1.replace(/[{#}]+/g, ''), val = data[key]
                    
                    if (replaceAll && typeof val === 'undefined')
                        return $1
                    
                    if (typeof val === 'undefined' || val === 'null' || val === null)
                        val = ''
                    
                    return val
                })
            },
            createNoDataTr: function(str) {
                if (that.options.showNoDataTip) {
                    if (str) {
                        return '<tr class="datagrid-nodata"><td colspan="'+ that.columnModel.length +'">'+ (typeof that.options.showNoDataTip === 'string' ? that.options.showNoDataTip : BJUI.getRegional('datagrid.noData')) +'</td></tr>'
                    } else if (!that.$tbody.find('> tr').length) {
                        $('<tr class="datagrid-nodata"></tr>').html('<td colspan="'+ that.columnModel.length +'">'+ (typeof that.options.showNoDataTip === 'string' ? that.options.showNoDataTip : BJUI.getRegional('datagrid.noData')) +'</td>').appendTo(that.$tbody)
                    }
                }
            },
            createTreePlaceholder: function(data, label, isExpand) {
                var keys = that.options.treeOptions.keys, str = BJUI.StrBuilder()
                var addIndent = function(level) {
                    var indent = []
                    
                    while (level--) {
                        indent.push('<span class="datagrid-tree-indent"></span>')
                    }
                    
                    return indent.join('')
                }
                
                str.add('<div class="datagrid-tree-box">')
                
                if (data[keys.level])
                    str.add(addIndent(data[keys.level]))
                
                str.add('<span class="datagrid-tree-switch'+ (typeof isExpand !== 'undefined' && !isExpand ? ' collapsed' : '') +'">')
                
                if (data[keys.isParent]) {
                    if (typeof isExpand === 'undefined') {
                        if (typeof data[keys.isExpand] === 'undefined')
                            data[keys.isExpand] = true
                            
                            if (!data[keys.isExpand]) {
                                if (!that.collapseIndex) that.collapseIndex = []
                                that.collapseIndex.push(data.gridIndex)
                            }
                        
                        str.add('<i class="fa fa-minus-square-o"></i>')
                    } else {
                        str.add('<i class="fa fa-'+ (isExpand ? 'minus' : 'plus') +'-square-o"></i>')
                    } 
                }
                
                str
                    .add('</span>')
                    .add('<span class="datagrid-tree-'+ (data[keys.isParent] ? 'branch' : 'leaf') +'"><i class="fa fa-'+ (data[keys.isParent] ? 'folder' : 'file') +'-o"></i></span>')
                    .add('<span class="datagrid-tree-title">')
                    .add(label)
                    .add('</span>')
                    .add('</div>')
                
                return str.toString()
            },
            createChildTr: function($tr, trData) {
                if ($tr && $tr.next() && $tr.next().hasClass(that.classnames.tr_child))
                    return
                
                if (options.hasChild && options.childOptions && options.childOptions.dataUrl) {
                    that.childOptions = $.extend(true, {}, Datagrid.DEFAULTS, options.childOptions)
                    
                    var child = '<tr class="'+ that.classnames.tr_child +'"><td colspan="'+ that.columnModel.length +'" style="width:100%; padding:10px;"><table class="table-child"></table></td></tr>'
                    
                    if ($tr && $tr.length)
                        $tr.after(child)
                    else
                        return child
                }
                
                return ''
            },
            // Parameters can be (jQuery Object || number)
            getNoChildTrIndex: function(row) {
                var index 
                
                if (isNaN(row)) {
                    if (!row || !row.length) return -1
                    index = row.index()
                } else {
                    index = parseInt(row, 10)
                }
                if (that.options.hasChild && that.options.childOptions)
                    index = index * 2
                
                return index
            },
            // Parameters can be (jQuery Object || number)
            getNoChildDataIndex: function(row) {
                var data_index
                
                if (isNaN(row))
                    data_index = this.getNoChildTrIndex(row)
                else
                    data_index = parseInt(row, 10)
                
                if (data_index === -1) return data_index
                if (that.options.hasChild && that.options.childOptions)
                    data_index = data_index / 2
                
                return data_index
            },
            // ajax load data by url
            loadData: function(data, refreshFlag) {
                var tools = this, url = options.dataUrl, dataType = options.dataType || 'json', model = that.columnModel
                
                that.$boxM && that.$boxM.show().trigger('bjui.ajaxStart')
                
                dataType = dataType.toLowerCase()
                if (dataType === 'array') dataType = 'text'
                
                if (options.postData) {
                    if (typeof options.postData === 'string') {
                        if (options.postData.trim().startsWith('{')) options.postData = options.postData.toObj()
                        else options.postData = options.postData.toFunc()
                    }
                    if (typeof options.postData === 'function') {
                        options.postData = options.postData.apply()
                    }
                    if (typeof options.postData === 'object') {
                        if (!data) data = options.postData
                        else data = $.extend({}, options.postData, data)
                    }
                }
                
                data = data || {}
                if (!data.pageSize && options.paging) {
                    data.pageSize = that.paging.pageSize
                    data.pageNum = that.paging.pageNum
                }
                
                if (!options.paging) {
                    delete data.pageSize
                    delete data.pageNum
                }
                
                BJUI.ajax('doajax', {
                    url       : url,
                    data      : data,
                    type      : options.loadType,
                    cache     : options.cache || false,
                    dataType  : dataType,
                    okCallback: function(response) {
                        if (dataType === 'json' || dataType === 'jsonp') {
                            tools.createTrsByData(response, refreshFlag)
                        } else if (dataType === 'text') {
                            if ($.type(response) !== 'array')
                                response = []
                            
                            tools.createTrsByData(response, refreshFlag)
                        } else if (dataType === 'xml') {
                            var xmlData = [], obj
                            
                            $(response).find('row').each(function() {
                                obj = {}
                                
                                $(this).find('cell').each(function(i) {
                                    var $cell = $(this), label = $cell.text(), name = $cell.attr('name')
                                    
                                    obj[name] = label
                                })
                                
                                xmlData.push(obj)
                            })
                            
                            if (xmlData.length) tools.createTrsByData(xmlData, refreshFlag)
                        } else {
                            BJUI.debug('BJUI.Datagrid: The options \'dataType\' is incorrect!')
                        } 
                    },
                    errCallback: function(json) {
                        if (json && json[BJUI.keys.statusCode]) {
                            BJUI.alertmsg('error', json[BJUI.keys.message] || BJUI.getRegional('datagrid.errorData'))
                        } else {
                            BJUI.alertmsg('warn', BJUI.getRegional('datagrid.errorData'))
                        }
                        
                        tools.createTrsByData([], refreshFlag)
                    },
                    failCallback: function(msg) {
                        BJUI.alertmsg('warn', BJUI.getRegional('datagrid.failData'))
                        
                        tools.createTrsByData([], refreshFlag)
                    }
                })
            },
            // append columns
            appendColumns: function() {
                that.childColumn      = {name:that.options.keys.gridChild, gridChild:true, width:30, minWidth:30, label:'...', align:'center', menu:false, edit:false, quicksort:false}
                that.linenumberColumn = {name:that.options.keys.gridNumber, gridNumber:true, width:'auto', minWidth:80, label:'No.', align:'center', menu:false, edit:false, quicksort:false}
                that.checkboxColumn   = {name:that.options.keys.gridCheckbox, gridCheckbox:true, width:30, minWidth:30, label:'Checkbox', align:'center', menu:false, edit:false, quicksort:false}
                that.editBtnsColumn   = {name:that.options.keys.gridEdit, gridEdit:true, width:that.options.customEditbtns.width, minWidth:110, label:(typeof options.showEditbtnscol === 'string' ? options.showEditbtnscol : 'Edit'), align:'center', menu:false, edit:false, hide:false, quicksort:false}
            },
            // setBoxb - height
            setBoxbH: function(height) {
                var boxH = height || that.boxH || options.height, topM = 0, h, $boxB, bH
                
                if (boxH < 100) return
                if (isNaN(boxH)) {
                    if (boxH === 'auto') {
                        $boxB = that.$boxB.clone().height('').prependTo('body').find('> colgroup').remove().end()
                        bH = $boxB.outerHeight()
                        $boxB.remove()
                        
                        boxH = (that.$boxT ? that.$boxT.outerHeight() : 0)
                             + (that.$boxH ? that.$boxH.outerHeight() : 0)
                             + (that.$toolbar ? that.$toolbar.outerHeight() : 0) 
                             + (that.$boxP ? that.$boxP.outerHeight() : 0)
                             + bH
                             + (that.$boxF ? that.$boxF.outerHeight() : 0)
                        
                        if (options.maxHeight && Number(options.maxHeight) < boxH) {
                            boxH = Number(options.maxHeight)
                        }
                        
                        that.$grid.height(boxH)
                        that.boxH = boxH
                    } else {
                        boxH = that.$grid.height()
                    }
                }
                
                if (that.$boxT) {
                    h     = that.$boxT.outerHeight()
                    boxH -= h
                    topM += h
                }
                if (that.$toolbar) {
                    h     = that.$toolbar.outerHeight()
                    boxH -= h
                    topM += h
                }
                if (that.$boxP)
                    boxH -= that.$boxP.outerHeight()
                if (that.$boxF)
                    boxH -= that.$boxF.outerHeight()
                
                topM += that.$tableH.outerHeight()
                boxH -= that.$boxH.outerHeight()
                
                if (boxH < 0) boxH = 0
                
                that.$boxB.height(boxH)
                that.$boxM.height(boxH).css({top:topM})
                that.$lockB && that.$lockB.height(boxH)
                
                if (that.$element.data('bjui.datagrid.parent'))
                    that.$element.data('bjui.datagrid.parent').closest('table').datagrid('fixedHeight')
            },
            // column menu - toggle show submenu
            showSubMenu: function($li, $menu, $submenu) {
                var left, width = $menu.outerWidth(), submenu_width = $submenu.data('width') || $submenu.outerWidth(), wh = that.$grid.height(), mt, submenu_height = $submenu.data('height'), animate_op, boxWidth = that.$boxH.width()
                var hidesubmenu = function($li, $menu, $submenu) {
                    left       = $menu.offset().left - that.$grid.offset().left - 1
                    animate_op = {left:'50%'}
                    
                    $li.removeClass('active')
                    
                    if ($menu.hasClass('position-right') || (boxWidth - left < width + submenu_width)) {
                        $submenu.css({left:'auto', right:'100%'})
                        animate_op = {right:'50%'}
                    } else {
                        $submenu.css({left:'100%', right:'auto'})
                    }
                    animate_op.opacity = 0.2
                    
                    $submenu.stop().animate(animate_op, 'fast', function() {
                        $(this).hide()
                    })
                }
                
                $li.hover(function() {
                    $submenu.appendTo($li)
                    if ($li.hasClass(that.classnames.li_filter) && $submenu.is(':visible')) {
                        return false
                    } else {
                        var $filterli = $li.siblings('.'+ that.classnames.li_filter)
                        
                        if ($filterli.length && $filterli.hasClass('active')) {
                            hidesubmenu($filterli, $menu, $filterli.find('> .'+ that.classnames.s_filter))
                        }
                    }
                    
                    if ($li.hasClass(that.classnames.li_showhide)) {
                        mt = $li.position().top + $menu.position().top
                        
                        if ((wh - mt) < submenu_height) {
                            if (submenu_height > wh) {
                                submenu_height = wh
                                $submenu.css('height', wh)
                            }
                            $submenu.css({top:(- (submenu_height - (wh - mt)))})
                        }
                    }
                    
                    left       = $menu.offset().left - that.$grid.offset().left - 1
                    animate_op = {left:'100%'}
                    
                    if ($menu.hasClass('position-right') || (boxWidth - left < width + submenu_width)) {
                        $submenu.css({left:'auto', right:'50%'})
                        animate_op = {right:'100%'}
                    } else {
                        $submenu.css({left:'50%', right:'auto'})
                    }
                    animate_op.opacity = 1
                    
                    $li.addClass('active')
                    $submenu.show().stop().animate(animate_op, 'fast')
                }, function() {
                    if ($li.hasClass(that.classnames.li_filter)) {
                        return false
                    }
                    hidesubmenu($li, $menu, $submenu)
                })
                
                $li.on('hidesubmenu.bjui.datagrid.th', function(e, menu, submenu) {
                    hidesubmenu($(this), menu, submenu)
                })
            },
            // column menu - lock/unlock
            locking: function($th) {
                var index= $th.data('index'), columnModel = that.columnModel[index], lockFlag = columnModel.lock, locked = columnModel.locked, $menu = that.$menu, $ul = $menu.find('> ul'), $lockli = $ul.find('> li.'+ that.classnames.li_lock), $unlockli = $lockli.next()
                    
                if (locked) {
                    $lockli.addClass('disable')
                    $unlockli.removeClass('disable')
                } else {
                    $unlockli.addClass('disable')
                    $lockli.removeClass('disable')
                }
                
                if (lockFlag) {
                    $lockli.show().off('click').on('click', function() {
                        if ($lockli.hasClass('disable')) return
                        
                        $menu.hide().data('bjui.datagrid.menu.btn').removeClass('active')
                        that.colLock($th, true)
                    })
                    
                    $unlockli.show().off('click').on('click', function() {
                        if ($unlockli.hasClass('disable')) return
                        
                        $menu.hide().data('bjui.datagrid.menu.btn').removeClass('active')
                        that.colLock($th, false)
                    })
                } else {
                    $lockli.hide().off('click')
                    $unlockli.hide().off('click')
                }
            },
            // create show/hide column panel
            createShowhide: function() {
                var $showhide, keys = that.options.keys
                
                if (!that.$showhide) {
                    that.col_showhide_count = that.columnModel.length
                    $showhide = $('<ul class="'+ that.classnames.s_showhide +'" role="menu"></ul>')
                    
                    $.each(that.columnModel, function(i, n) {
                        if (that.tools.isGridModel(n))
                            that.col_showhide_count --
                        
                        var $col = $(FRAG.gridShowhide.replaceAll('#index#', n.index).replaceAll('#label#', (n.label || ''))).attr('title', (n.label || '')).toggleClass('nodisable', !!(that.tools.isGridModel(n)))
                        var colClick = function(n) {
                            $col.click(function() {
                                if ($(this).hasClass('disable')) return false
                                
                                var $this = $(this), check = !$this.find('i').hasClass('fa-check-square-o'), index = n.index
                                
                                $this.toggleClass('datagrid-col-check')
                                    .find('i').attr('class', 'fa fa'+ (check ? '-check' : '') +'-square-o')
                                
                                that.showhideColumn(n.th, check)
                                
                                if (!(that.tools.isGridModel(n))) {
                                    that.col_showhide_count = check ? that.col_showhide_count + 1 : that.col_showhide_count - 1
                                }
                                
                                if (that.col_showhide_count == 1) $showhide.find('> li.datagrid-col-check').addClass('disable')
                                else $showhide.find('> li.disable').removeClass('disable')
                                
                                $showhide.find('> li.nodisable').removeClass('disable')
                            })
                        }
                        
                        colClick(n)
                        $col.appendTo($showhide)
                        
                        if (n.hide) $col.trigger('click')
                    })
                    
                    $showhide.appendTo(that.$grid)
                    $showhide.data('width', $showhide.outerWidth()).data('height', $showhide.outerHeight())
                    that.$showhide = $showhide
                }
            },
            // column - display/hide
            showhide: function(model, showFlag) {
                var keys = that.options.keys, index = model.index, $th = model.th, $trs = that.$tbody.find('> tr'), display = showFlag ? '' : 'none'
                var setColspan = function(column) {
                    var _colspan = column.colspan
                    
                    if (showFlag) _colspan ++
                    else _colspan --
                    
                    if (!_colspan) column.th.css('display', 'none')
                    else column.th.css('display', '')
                    
                    column.th.attr('colspan', _colspan)
                    column.colspan = _colspan
                    
                    if (column.parent) setColspan(column.parent)
                }
                
                if (typeof model.hidden === 'undefined') model.hidden = false
                if (model.hidden === !showFlag) return
                
                model.hidden = !showFlag
                
                $th.css('display', display)
                
                if (that.options.tdTemplate && !this.isGridModel(model)) {
                    var colspan = $trs.eq(0).find('> td.datagrid-template-td').attr('colspan')
                    
                    if (colspan) {
                        $trs.find('> td.datagrid-template-td').attr('colspan', parseInt(colspan, 10) + (model.hidden ? -1 : 1))
                    }
                } else {
                    $trs.find('> td:eq('+ index +')').css('display', display)
                }
                that.$colgroupH.find('> col').eq(index).css('display', display)
                that.$colgroupB.find('> col').eq(index).css('display', display)
                that.$thead.find('> tr.datagrid-filter > th:eq('+ index +')').css('display', display)
                if (that.$boxF) {
                    that.$tableF.find('> thead > tr > th:eq('+ index +')').css('display', display)
                    that.$colgroupF.find('> col').eq(index).css('display', display)
                }
                
                if (model.calc) {
                    that.$tfoot && that.$tfoot.trigger('resizeH.bjui.datagrid.tfoot')
                }
                
                if (model.parent) setColspan(model.parent)
                
                // fixed width && height for child datagrid
                that.$tbody.find('> tr.'+ that.classnames.tr_child +':visible > td table').trigger('bjui.datagrid.child.resize')
            },
            isGridModel: function(model) {
                var keys = that.options.keys
                
                if (!model || typeof model !== 'object') return false
                return (model[keys.gridChild] || model[keys.gridNumber] || model[keys.gridCheckbox] || model[keys.gridEdit])
            },
            isGridData: function(name) {
                var keys = that.options.keys, b = false
                
                for (var key in keys) {
                    if (keys[key] === name) {
                        b = true
                        
                        break
                    }
                }
                
                return b
            },
            // jump to page
            jumpPage: function(pageNum, pageSize) {
                var allData = that.allData, filterDatas
                
                if (pageNum) {
                    that.paging.oldpageNum = that.paging.pageNum
                    that.paging.pageNum    = pageNum
                }
                if (pageSize) {
                    that.paging.oldPageSize = that.paging.pageSize
                    
                    that.paging.pageSize  = pageSize
                    that.paging.pageCount = this.getPageCount(pageSize, that.paging.total)
                    
                    if (that.paging.pageNum > that.paging.pageCount)
                        that.paging.pageNum = that.paging.pageCount
                }
                
                if (options.local === 'remote') {
                    filterDatas = this.getRemoteFilterData(true)
                    this.loadData(filterDatas, true)
                } else {
                    this.initTbody(allData, true)
                }
            },
            // column - quicksort
            quickSort: function(model) {
                if (that.isDom) {
                    if (options.local === 'local') return
                    options.sortAll = true
                }
                if (!that.sortData) {
                    that.sortData = {}
                }
                if (that.$tbody.find('> tr.'+ that.classnames.tr_edit).length) {
                    that.$tbody.alertmsg('info', BJUI.getRegional('datagrid.editMsg'))
                    return
                }
                
                var $th = model.th, data = that.data, allData = that.allData, postData, direction, name = model.name, type = model.type, $ths = that.$thead.find('> tr > th.datagrid-quicksort-th')
                
                if (!name) name = 'datagrid-noname'
                
                var getOrders = function() {
                    var orders = []
                    
                    $.each(that.sortData, function(k, v) {
                        orders.push(k +' '+ v.direction)
                    })
                    
                    return orders
                }
                var sortData = function(data, orders) {
                    var localSort = function(a, b) {
                        var key_index = 0
                        
                        function doCompare() {
                            var keys = orders[key_index].split(' '), name = keys[0], direction = keys[1], typeA = (typeof a[name]), typeB = (typeof b[name])
                            
                            if (a[name] == b[name] && key_index < orders.length - 1) {
                                key_index ++
                                return doCompare()
                            }
                            
                            if ((typeA = typeB === 'number') || (typeA = typeB === 'boolean')) {
                                return direction === 'asc' ? (a[name] - b[name]) : (b[name] - a[name])
                            } else {
                                return direction === 'asc' ? String(a[name]).localeCompare(b[name]) : String(b[name]).localeCompare(a[name])
                            }
                        }
                        
                        if (!orders || !orders.length) {
                            return (a['bjui_local_index'] - b['bjui_local_index'])
                        }
                        return doCompare()
                    }
                    
                    data.sort(localSort)
                }
                
                if (options.fieldSortable)
                    $th.find('> div > .datagrid-label > i').remove()
                else
                    that.$thead.find('> tr:not(.datagrid-filter) > th > div > .datagrid-label > i').remove()
                
                if (model.sortDesc) {
                    model.sortDesc = false
                } else {
                    if (model.sortAsc) {
                        direction = 'desc'
                        model.sortAsc  = false
                        model.sortDesc = true
                    } else {
                        direction = 'asc'
                        model.sortAsc = true
                    }
                    // for thead
                    $th.find('> div > .datagrid-label').prepend('<i class="datagrid-sort-i fa fa-long-arrow-'+ (model.sortAsc ? 'up' : 'down') +'"></i>')
                }
                
                if (direction) {
                    if (that.sortData[name]) {
                        that.sortData[name]['direction'] = direction
                    } else {
                        that.sortData[name] = {index:(Object.keys(that.sortData)).length, direction:direction}
                    }
                } else {
                    delete that.sortData[name]
                }
                if (options.sortAll) {
                    if (options.local === 'remote') {
                        postData = that.$element.data('filterDatas') || {}
                        postData[BJUI.pageInfo.pageSize]    = that.paging.pageSize
                        postData[BJUI.pageInfo.pageNum] = that.paging.pageNum
                        
                        if (direction) {
                            postData[BJUI.pageInfo.orderField]     = name
                            postData[BJUI.pageInfo.orderDirection] = direction
                        } else {
                            postData[BJUI.pageInfo.orderField]     = ''
                            postData[BJUI.pageInfo.orderDirection] = ''
                        }
                        
                        postData['orders'] = getOrders().join(',')
                        that.orders = {orders : postData['orders']}
                        
                        this.loadData(that.tools.getRemoteFilterData(true), true)
                    } else {
                        sortData(allData, getOrders())
                        this.initTbody(allData, true)
                    }
                } else {
                    sortData(data, getOrders())
                    this.createTrs(data, true)
                }
            },
            showFilterMsg: function(msgs) {
                var $msg = that.$boxH.find('.datagrid-thead-dialog-filter-msg'), $filter = $msg.find('> .msg-filter'), html = BJUI.StrBuilder()
                
                $filter.html('')
                
                if (!msgs.length) return
                
                $.each(msgs, function(i, n) {
                    if (!n) return true
                    
                    var label = n.label, val = n.data.valA
                    
                    if (n.model.type === 'select' || n.model.type === 'boolean') {
                        val = n.model.render.call(that, val, {}, n.model.items, n.model.itemattr)
                    }
                    
                    html.add('；')
                        .add(n.model.label +':'+ val)
                })
                
                html = html.toString()
                html.length > 1 && (html = html.substr(1))
                
                $filter.html(html)
            },
            quickFilter: function(model, filterDatas) {
                if (that.isDom) {
                    if (options.local != 'remote') {
                        BJUI.debug('BJUI.Datagrid: Please change the local option is remote!')
                        return
                    }
                    if (!options.dataUrl) {
                        BJUI.debug('BJUI.Datagrid: Not Set the dataUrl option!')
                        return
                    }
                }
                
                var tools = this, $th = model.th, data = that.data, allData = that.allData, name = model.name, postData, fDatas, msgs = []
                var switchOperator = function(operator, val1, val2, model) {
                    var compare = false
                    
                    switch (operator) {
                    case '=':
                        compare = String(val1) === String(val2)
                        break
                    case '!=':
                        compare = String(val1) !== String(val2)
                        break
                    case '>':
                        compare = parseFloat(val2) > parseFloat(val1)
                        break
                    case '<':
                        compare = parseFloat(val2) < parseFloat(val1)
                        break
                    case 'like':
                        if (model && model.type === 'select') {
                            compare = String(val1) === String(val2)
                            if (model.attrs && model.attrs.multiple) {
                                if ($.isArray(val1) && String(val2)) {
                                    $.each(String(val2).split(','), function(i, n) {
                                        compare = $.inArray(n, val1) != -1
                                        if (compare) return false
                                    })
                                }
                            }
                        } else {
                            compare = String(val2).indexOf(String(val1)) >= 0
                        }
                        break
                    default:
                        break
                    }
                    
                    return compare
                }
                var filterData = function(data, filterDatas) {
                    var grepFun = function(n) {
                        var count = 0
                        
                        $.each(filterDatas, function(name, v) {
                            var op = v.datas
                            
                            count ++
                            if (!op) {
                                count --
                                v.model.isFiltered = false
                                v.model.th.trigger('filter.bjui.datagrid.th', [false])
                                if (v.model.$quickfilter) v.model.$quickfilter.trigger('clearfilter.bjui.datagrid.thead')
                                
                                return true
                            }
                            
                            v.model.isFiltered = true
                            v.model.th.trigger('filter.bjui.datagrid.th', [true])
                            
                            if (!msgs[v.model.index])
                                msgs[v.model.index] = {model:v.model, data:v.datas}
                            
                            if (op.andor) {
                                if (op.andor === 'and') {
                                    if (switchOperator(op.operatorA, op.valA, n[name], v.model) && switchOperator(op.operatorB, op.valB, n[name], v.model)) {
                                        count --
                                    }
                                } else if (op.andor === 'or') {
                                    if (switchOperator(op.operatorA, op.valA, n[name], v.model) || switchOperator(op.operatorB, op.valB, n[name], v.model)) {
                                        count --
                                    }
                                }
                            } else {
                                if (op.operatorB) {
                                    if (switchOperator(op.operatorB, op.valB, n[name], v.model)) {
                                        count --
                                    }
                                } else {
                                    if (switchOperator(op.operatorA, op.valA, n[name], v.model)) {
                                        count --
                                    }
                                }
                            }
                        })
                        
                        return !count ? true : false
                    }
                    
                    return $.grep(data, function(n, i) {
                        return grepFun(n)
                    })
                }
                
                if (!that.filterDatas) that.filterDatas = {}
                if (options.filterMult) {
                    that.filterDatas[name] = {datas:filterDatas, model:model}
                } else {
                    that.filterDatas = {}
                    that.filterDatas[name] = {datas:filterDatas, model:model}
                }
                
                if (options.local !== 'remote' && allData) {
                    if (!that.oldAllData) that.oldAllData = allData.concat()
                    else allData = that.oldAllData.concat()
                }
                
                if (options.filterAll) {
                    if (options.local === 'remote') {
                        tools.loadData(tools.getRemoteFilterData(false, msgs), true)
                    } else {
                        fDatas = filterData(allData, that.filterDatas)
                        
                        that.tools.showFilterMsg(msgs)
                        
                        that.paging.pageNum = 1
                        that.paging.pageCount   = this.getPageCount(that.paging.pageSize, fDatas.length)
                        
                        this.initTbody(fDatas, true)
                    }
                } else {
                    if (that.isDom) {
                        tools.loadData(tools.getRemoteFilterData(false, msgs), true)
                    } else {
                        if (!that.oldData) that.oldData = data.concat()
                        else data = that.oldData.concat()
                        
                        fDatas = filterData(data, that.filterDatas)
                        
                        that.tools.showFilterMsg(msgs)
                        
                        this.createTrs(fDatas, true)
                    }
                }
            },
            getRemoteFilterData: function(isPaging, msgs) {
                var filterDatas = {}
                
                if (that.filterDatas && !$.isEmptyObject(that.filterDatas)) {
                    $.each(that.filterDatas, function(name, v) {
                        if (!v.datas) {
                            v.model.isFiltered = false
                            v.model.th.trigger('filter.bjui.datagrid.th', [false])
                            if (v.model.$quickfilter) v.model.$quickfilter.trigger('clearfilter.bjui.datagrid.thead')
                            msgs && msgs[v.model.index] && (msgs[v.model.index] = false)
                            return true
                        }
                        
                        v.model.isFiltered = true
                        v.model.th.trigger('filter.bjui.datagrid.th', [true])
                        
                        if (options.jsonPrefix)
                            name = options.jsonPrefix +'.'+ name
                        
                        if (v.datas.andor)
                            filterDatas['andor'] = v.datas.andor
                        if (v.datas.operatorA) {
                            filterDatas[name] = v.datas.valA
                            filterDatas[name +'operator'] = v.datas.operatorA
                        }
                        if (v.datas.operatorB) {
                            if (filterDatas[name]) {
                                filterDatas[name] = [filterDatas[name], v.datas.valB]
                                filterDatas[name +'operator'] = [filterDatas[name +'operator'], v.datas.operatorB]
                            } else {
                                filterDatas[name] = v.datas.valB
                                filterDatas[name +'operator'] = v.datas.operatorB
                            }
                        }
                    })
                    
                    if (!isPaging) that.paging.pageNum = 1
                }
                
                if (that.initFilter) {
                    var name = options.jsonPrefix ? options.jsonPrefix +'.' : ''
                    
                    $.each(that.initFilter, function(k, v) {
                        if (!that.filterDatas || typeof that.filterDatas[k] === 'undefined')
                            filterDatas[name + k] = v.value
                    })
                }
                
                // paging
                filterDatas[BJUI.pageInfo.pageSize]    = that.paging.pageSize
                filterDatas[BJUI.pageInfo.pageNum] = that.paging.pageNum || 1
                
                $.extend(filterDatas, that.orders || {})
                
                that.$element.data('filterDatas', filterDatas)
                
                return filterDatas
            },
            // set data for Dom
            setDomData: function(tr) {
                var columnModel = that.columnModel, data = {}, hideDatas = tr.attr('data-hidden-datas'), attach = that.attach
                    
                tr.find('> td').each(function(i) {
                    var $td = $(this), model = columnModel[i], val = $td.attr('data-val') || $td.text()
                    
                    if (!model.name) data['datagrid-noname'+ i] = val
                    else data[model.name] = val
                })
                
                if (hideDatas) hideDatas = hideDatas.toObj()
                
                attach[that.options.keys.gridNumber] = (tr.index() + 1)
                $.extend(data, attach, hideDatas)
                
                tr.data('initData', data)
                
                return data
            },
            // update linenumber
            updateLinenumber: function() {
                if ($.inArray(that.linenumberColumn, that.columnModel) == -1)
                    return
                
                var lock = false
                
                if (that.linenumberColumn.locked) {
                    that.colLock(that.linenumberColumn.th, false)
                    lock = true
                }
                
                that.$tbody.find('> tr:not(.'+ that.classnames.tr_child +')').each(function(i) {
                    var $tr = $(this)
                    
                    $tr.find('> td.'+ that.classnames.td_linenumber).text(i + 1)
                })
                
                if (lock)
                    that.colLock(that.linenumberColumn.th, true)
            },
            // update that.data gridIndex && gridNumber
            updateGridIndex: function() {
                var paging = that.paging, options = that.options, startNumber = (paging.pageNum - 1) * paging.pageSize
                
                $.each(that.data, function(i, data) {
                    var linenumber = options.linenumberAll ? (startNumber + (i + 1)) : (i + 1)
                    
                    data[options.keys.gridNumber] = linenumber
                    data[options.keys.gridIndex]  = i
                })
            },
            // init filter
            initFilter: function($input, model) {
                var initFilter = that.initFilter
                var doFilter = function($input, model) {
                    $input.val(String(that.options.initFilter[model.name]))
                    
                    if (that.$headFilterUl) {
                        var $headinput = that.$headFilterUl.find('> li.li-'+ model.index +'> '+ $input[0].tagName)
                        
                        if ($headinput.length) {
                            $headinput.val($input.val())
                            if ($headinput.isTag('select'))
                                $headinput.selectpicker('refresh')
                        }
                    }
                    
                    if (that.options.local === 'remote') {
                        model.isFiltered = true
                        model.th.trigger('filter.bjui.datagrid.th', [true])
                    } else {
                        that.tools.quickFilter(model, {operatorA:'like', valA:that.options.initFilter[model.name]})
                    }
                }
                
                if (!$input && !model) {
                    if (initFilter) {
                        $.each(initFilter, function(i, n) {
                            doFilter(n.input, n.model)
                        })
                    }
                    return
                }
                
                if (!initFilter) initFilter = {}
                
                if (!model) return
                
                doFilter($input, model)
                
                if (!initFilter[model.name]) {
                    initFilter[model.name] = {}
                    initFilter[model.name].input = $input
                    initFilter[model.name].model = model
                    initFilter[model.name].value = that.options.initFilter[model.name]
                }
                
                that.initFilter = initFilter
            },
            // init inputs array for edit
            initEditInputs: function() {
                var columnModel = that.columnModel
                
                that.inputs = []
                
                $.each(columnModel, function(i, op) {
                    var name = op.name, rule = '', pattern = '', selectoptions = [], attrs = ''
                    
                    if (!op) return
                    if (op.attrs && typeof op.attrs === 'object') {
                        $.each(op.attrs, function(i, n) {
                            if (typeof n === 'object') n = JSON.stringify(n).replaceAll('\"', '\'')
                            attrs += ' '+ i +'='+ n
                        })
                    }
                    
                    if (op === that.childColumn || op === that.linenumberColumn || op === that.checkboxColumn || op === that.editBtnsColumn) {
                        that.inputs.push('')
                    } else if (name) {
                        if (op.rule) rule = ' data-rule="'+ op.label +'：'+ op.rule +'"'
                        else if (op.type === 'date') rule = ' data-rule="pattern('+ (op.pattern || 'yyyy-MM-dd') +')"';
                        if (op.type) {
                            switch (op.type) {
                            case 'date':
                                if (!op.pattern) op.pattern = 'yyyy-MM-dd'
                                pattern = ' data-pattern="'+ op.pattern +'"'
                                that.inputs.push('<input type="text" name="'+ name +'" data-toggle="datepicker"'+ pattern + rule + attrs +'>')
                                
                                break
                            case 'select':
                                if (!op.items) return
                                
                                $.each(op.items, function(i, n) {
                                    if (op.itemattr) {
                                        selectoptions.push('<option value="'+ n[op.itemattr.value] +'">'+ n[op.itemattr.label] +'</option>')
                                    } else {
                                        $.each(n, function(key, value) {
                                            selectoptions.push('<option value="'+ key +'">'+ value +'</option>')
                                        })
                                    }
                                })
                                
                                that.inputs.push('<select name="'+ name +'" data-toggle="selectpicker"'+ rule + attrs +' data-width="100%">'+ selectoptions.join('') +'</select>')
                                
                                break
                            case 'boolean':
                                that.inputs.push('<input type="checkbox" name="'+ name +'" data-toggle="icheck"'+ rule + attrs +' value="true">')
                                
                                break
                            case 'findgrid':
                                that.inputs.push('<input type="text" name="'+ name +'" data-toggle="findgrid" data-custom-event="true"'+ rule + attrs +'>')
                                
                                break
                            case 'tags':
                                that.inputs.push('<input type="text" name="'+ name +'" data-toggle="tags"'+ attrs +'>')
                                
                                break
                            case 'spinner':
                                that.inputs.push('<input type="text" name="'+ name +'" data-toggle="spinner"'+ rule + attrs +'>')
                                
                                break
                            case 'textarea':
                                that.inputs.push('<textarea data-toggle="autoheight" rows="1"'+ rule + attrs +'></textarea>')
                                
                                break
                            default:
                                that.inputs.push('<input type="text" name="'+ name +'"'+ rule + attrs +'>')
                                break
                            }
                        } else {
                            that.inputs.push('<input type="text" name="'+ name +'"'+ rule + attrs +'>')
                        }
                    } else {
                        that.inputs.push('')
                    }
                })
                
                return that.inputs
            },
            contextmenuH: function() {
                var tools = this
                
                that.$tableH.on('contextmenu', 'tr:not(.datagrid-filter)', function(e) {
                    if (!that.$showhide) tools.createShowhide()
                    
                    var posX = e.pageX, posY = e.pageY, wh = $(window).height(), mh = that.$showhide.data('height')
                    
                    if ($(window).width()  < posX + that.$showhide.width())  posX -= that.$showhide.width()
                    if (posY < 0 || (posY + mh) > wh)
                        posY = 0
                    if (mh > wh)
                        that.$showhide.css({height:wh})
                    else
                        that.$showhide.css({height:''})
                    if (that.$menu) {
                        that.$grid.trigger('click.bjui.datagrid.filter')
                    }
                    
                    that.$showhide
                        .appendTo('body')
                        .css({left:posX, top:posY, opacity:1, 'z-index':9999}).show()
                    
                    $(document).on('click', function(e) {
                        var $showhide = $(e.target).closest('.'+ that.classnames.s_showhide)
                        
                        if (!$showhide.length)
                            that.$showhide.css({left:'50%', top:0, opacity:0.2, 'z-index':''}).hide().appendTo(that.$grid)
                    })
                    
                    e.preventDefault()
                    e.stopPropagation()
                })
            },
            contextmenuB: function($tr, isLock) {
                $tr.contextmenu('show', 
                        {
                            exclude : 'input, .bootstrap-select',
                            items:[
                                {
                                    icon  : 'refresh',
                                    title : BJUI.getRegional('datagrid.refresh'),
                                    func  : function(parent, menu) {
                                        that.refresh()
                                    }
                                },
                                {
                                    title : 'diver'
                                },
                                {
                                    icon  : 'plus',
                                    title : BJUI.getRegional('datagrid.add'),
                                    func  : function(parent, menu) {
                                        that.add()
                                    }
                                },
                                {
                                    icon  : 'edit',
                                    title : BJUI.getRegional('datagrid.edit'),
                                    func  : function(parent, menu) {
                                        var $tr = parent
                                        
                                        if (isLock) $tr = that.$tbody.find('> tr:eq('+ $tr.index() +')')
                                        that.doEditRow($tr)
                                    }
                                },
                                {
                                    icon  : 'undo',
                                    title : BJUI.getRegional('datagrid.cancel'),
                                    func  : function(parent, menu) {
                                        var $tr = parent
                                        
                                        if (isLock) $tr = that.$tbody.find('> tr:eq('+ $tr.index() +')')
                                        
                                        if (!$tr.hasClass(that.classnames.tr_edit)) {
                                            $tr = that.$tbody.find('> tr.'+ that.classnames.tr_edit)
                                        }
                                        that.doCancelEditRow($tr)
                                    }
                                },
                                {
                                    icon  : 'remove',
                                    title : BJUI.getRegional('datagrid.del'),
                                    func  : function(parent, menu) {
                                        var $tr = parent
                                        
                                        if (isLock) $tr = that.$tbody.find('> tr:eq('+ $tr.index() +')')
                                        that.delRows($tr)
                                    }
                                }
                            ]
                        }
                    )
            }
        }
        
        return tools
    }
    
    Datagrid.prototype.init = function() {
        if (!this.$element.isTag('table')) return
        if (this.$element.data('bjui.datagrid.init')) return
        
        this.$element.data('bjui.datagrid.init', true)
        
        var that = this, options = that.options, keys = options.keys, tools = that.tools, $parent = that.$element.parent(), gridHtml = BJUI.StrBuilder()
        
        options.tableWidth = options.tableWidth || ''
        options.width      = options.width || '100%'
        options.height     = options.height || 'auto'
        that.isDom         = false
        that.columnModel   = []
        that.inputs        = []
        that.regional      = BJUI.regional.datagrid
        
        gridHtml
            .add('<div class="bjui-datagrid">')
            .add(options.gridTitle ? '<div class="datagrid-title">'+ options.gridTitle +'</div>' : '')
            .add(options.showToolbar ? '<div class="datagrid-toolbar"></div>' : '')
            .add('<div class="datagrid-box-h"><div class="datagrid-wrap-h"><table class="table table-bordered"><colgroup></colgroup></table></div></div>')
            .add('<div class="datagrid-box-b"><div class="datagrid-wrap-b"></div></div>')
            .add('<div class="datagrid-box-m"></div>')
            .add(options.paging ? '<div class="datagrid-paging-box bjui-paging-box"></div>' : '')
            .add('</div>')
        
        that.$grid    = $(gridHtml.toString()).insertAfter(that.$element).css('height', options.height)
        that.$boxH    = that.$grid.find('> div.datagrid-box-h')
        that.$boxB    = that.$boxH.next()
        that.$boxM    = that.$boxB.next().css('height', options.height)
        that.$boxP    = options.paging ? that.$boxM.next() : null
        that.$boxT    = options.gridTitle ? that.$grid.find('> div.datagrid-title') : null
        that.$toolbar = options.showToolbar ? that.$boxH.prev() : null
        that.$tableH  = that.$boxH.find('> div > table')
        that.$tableB  = that.$element
        // tdtemplate
        that.isTemplate = (options.tdTemplate && options.templateWidth) && options.templateWidth > that.$grid.width() || (options.tdTemplate && !options.templateWidth)
        
        that.$grid.data('bjui.datagrid.table', that.$element.clone())
        that.$boxB.find('> div').append(that.$element)
        
        that.initTop()
        
        if (typeof options.paging === 'string') options.paging = options.paging.toObj()
        that.paging = $.extend({}, {pageSize:30, selectPageSize:'30,60,90', pageNum:1, total:0, showPagenum:5}, (typeof options.paging === 'object') && options.paging)
        that.$thead = that.$element.find('> thead')
        that.$tbody = that.$element.find('> tbody')
        that.attach = {}
        
        that.attach[keys.gridNumber]   = 0
        that.attach[keys.gridCheckbox] = '#checkbox#'
        that.attach[keys.gridEdit]     = '#edit#'
        
        if (that.$tbody && that.$tbody.find('> tr').length) {
            that.isDom = true
            
            that.setColumnModel()
            
            that.$tbody.find('> tr > td').each(function() {
                var $td = $(this), html = $td.html()
                
                $td.html('<div>'+ html +'</div>')
            })
            
            if (!that.paging.total) {
                that.paging.total = that.$tbody.find('> tr').length
                that.paging.pageCount = 1
            } else {
                that.paging.pageCount = tools.getPageCount(that.paging.pageSize, that.paging.total)
            }
            
            that.paging.pageNum = 1
            that.initThead()
        } else {
            that.$tbody = null
            that.$element.find('> tbody').remove()
            
            if (options.columns) {
                if (typeof options.columns === 'string') {
                    if (options.columns.trim().startsWith('[')) {
                        options.columns = options.columns.toObj()
                    } else {
                        options.columns = options.columns.toFunc()
                    }
                }
                if (typeof options.columns === 'function') {
                    options.columns = options.columns.call()
                }
                
                that.$thead = null
                that.$element.find('> thead').remove()
                that.createThead()
            } else {
                if (that.$thead && that.$thead.length && that.$thead.find('> tr').length) {
                    that.setColumnModel()
                } else {
                    BJUI.debug('BJUI.Datagrid: No set options \'columns\' !')
                    that.destroy()
                    return
                }
            }
            if (options.data || options.dataUrl) {
                that.createTbody()
            } else {
                BJUI.debug('BJUI.Datagrid: No options \'data\' or \'dataUrl\'!')
                that.destroy()
            }
        }
    }
    
    // DOM to datagrid - setColumnModel
    Datagrid.prototype.setColumnModel = function() {
        var that = this, options = that.options, $trs = that.$thead.find('> tr'), rows = [], ths = [], trLen = $trs.length
        
        if (!that.isDom) {
            that.tools.appendColumns()
            
            var $th, _rowspan = trLen > 1 ? ' rowspan="'+ trLen +'"' : ''
            
            if (options.showCheckboxcol) {
                that.columnModel.push(that.checkboxColumn)
                if (options.showCheckboxcol === 'lock') that.checkboxColumn.initLock = true
                
                $th = $('<th class="'+ that.classnames.td_checkbox +'"'+ _rowspan +'><input type="checkbox" data-toggle="icheck"></th>')
                $th.prependTo($trs.first())
                if (_rowspan) $th.data('datagrid.column', that.checkboxColumn)
            }
            if (options.showLinenumber) {
                that.columnModel.unshift(that.linenumberColumn)
                if (options.showLinenumber === 'lock') that.linenumberColumn.initLock = true
                
                $th = $('<th class="'+ that.classnames.td_linenumber +'"'+ _rowspan +'>No.</th>')
                $th.prependTo($trs.first())
                if (_rowspan) $th.data('datagrid.column', that.linenumberColumn)
            }
            if (options.showChildcol || (options.showChildcol === undefined && options.hasChild && options.childOptions)) {
                that.columnModel.unshift(that.childColumn)
                
                $th = $('<th class="'+ that.classnames.td_child +'"'+ _rowspan +'>...</th>')
                $th.prependTo($trs.first())
                if (_rowspan) $th.data('datagrid.column', that.childColumn)
            }
            if (options.showEditbtnscol) {
                $th = $('<th'+ _rowspan +'>'+ that.editBtnsColumn.label +'</th>')
                $th.appendTo($trs.first())
                if (_rowspan) $th.data('datagrid.column', that.editBtnsColumn)
                that.columnModel[$th.index()] = that.editBtnsColumn
            }
        }
        
        if ($trs.length && trLen == 1) {
            $trs.find('> th').each(function(i) {
                var $th = $(this).addClass('single-row').data('index', i), op = $th.data('options'), oW = $th.attr('width') || 'auto', label = $th.html()
                
                if (that.columnModel.length && that.columnModel[i]) {
                    op = that.columnModel[i]
                    op.index = i
                } else {
                    if (op && typeof op === 'string') op = op.toObj()
                    if (typeof op !== 'object') op = {}
                    
                    op.index = i
                    op.label = label
                    op.width = (typeof op.width === 'undefined') ? oW : op.width
                    
                    op = that.tools.setOp(op)
                    
                    that.columnModel[i] = op
                }
                
                that.columnModel[i].th = $th
                
                $th.html('<div><div class="datagrid-space"></div><div class="datagrid-label">'+ label +'</div><div class="'+ that.classnames.th_cell +'"><div class="'+ that.classnames.th_resizemark +'"></div></div></div>')
                if (op.menu && options.columnMenu) $th.addClass(that.classnames.th_menu)
                if (options.fieldSortable && op.quicksort) $th.addClass('datagrid-quicksort-th')
                if (op.align) $th.attr('align', op.align)
            })
        } else { // multi headers
            $trs.each(function(len) {
                var next_rows = [], next_ths = [], index = -1, next_index = 0
                
                if (rows.length) {
                    next_rows = rows.concat()
                    next_ths  = ths.concat()
                }
                rows = []
                ths  = []
                
                $(this).find('> th').each(function(i) {
                    var $th = $(this), op = $th.data('options') || $th.data('datagrid.column') || {}, colspan = parseInt(($th.attr('colspan') || 0), 10), rowspan = parseInt(($th.attr('rowspan') || 0), 10), oW = $th.attr('width') || 'auto', label = $th.html()
                    
                    if (op && typeof op === 'string') op = op.toObj()
                    if (typeof op !== 'object') op = {}
                    if (BJUI.isIE(8) && colspan === 1) colspan = 0
                    
                    op.label = label
                    op.th    = $th
                    if (op[options.keys.gridCheckbox]) op.label = 'Checkbox'
                    
                    index++
                    if (colspan) {
                        op.colspan = colspan
                        for (var start_index = (next_rows.length ? next_rows[index] : index), k = start_index; k < (start_index + colspan); k++) {
                            rows[next_index++]  = k
                            ths[next_index - 1] = op
                        }
                        index += (colspan - 1)
                        
                        $th.data('index', index)
                        
                        if (next_rows.length) {
                            op.parent = next_ths[index]
                        }
                    }
                    if (!rowspan || rowspan == 1) $th.addClass('single-row')
                    if (!colspan) {
                        op.width = (typeof op.width === 'undefined') ? oW : op.width
                        
                        op = that.tools.setOp(op)
                        $th.html('<div><div class="datagrid-space"></div><div class="datagrid-label">'+ label +'</div><div class="'+ that.classnames.th_cell +'"><div class="'+ that.classnames.th_resizemark +'"></div></div></div>')
                        
                        if (op.menu && options.columnMenu) $th.addClass(that.classnames.th_menu)
                        if (options.fieldSortable && op.quicksort) $th.addClass('datagrid-quicksort-th')
                        if (op.align) $th.attr('align', op.align)
                        if (!next_rows.length) {
                            op.index = index
                            that.columnModel[index] = op
                        } else {
                            op.index  = next_rows[index]
                            op.parent = next_ths[index]
                            that.columnModel[next_rows[index]] = op
                        }
                        
                        $th.data('index', op.index)
                    } else {
                        $th.html('<div><div class="datagrid-space"></div><div class="datagrid-label">'+ label +'</div><div class="'+ that.classnames.th_cell +'"><div class="'+ that.classnames.th_resizemark +'"></div></div></div>')
                    }
                })
            })
        }
    }
    
    // create thead by columns
    Datagrid.prototype.createThead = function() {
        var that = this, options = that.options, keys = options.keys, columns = options.columns.concat(), rowArr = [], rows = [], label, align, width, colspan, rowspan, resize, menu,
            columns2Arr = function(columns, rowArr, index, parent) {
                if (!rowArr) rowArr = []
                if (!index)   index = 0
                if (!rowArr[index]) rowArr[index] = []
                
                $.each(columns, function(i, n) {
                    var len = rowArr[index].length, colspan
                    
                    if (parent) n.parent = parent
                    if (n.columns) {
                        colspan = n.columns.length
                        if (index && n.parent) {
                            that.tools.setColspan(n.parent, colspan)
                        }
                        
                        n.index     = that.columnModel.length + colspan - 1
                        n.colspan   = colspan
                        n.quicksort = false
                        rowArr[index][len++] = n
                        
                        return columns2Arr(n.columns, rowArr, index + 1, n)
                    } else {
                        n.rowspan = index
                        n.index   = that.columnModel.length
                        
                        n = that.tools.setOp(n)
                        
                        rowArr[index][len++] = n
                        that.columnModel.push(n)
                    }
                })
                
                return rowArr
            }
        
        that.tools.appendColumns()
        
        if (options.showCheckboxcol) {
            columns.unshift(that.checkboxColumn)
            if (options.showCheckboxcol === 'lock') that.checkboxColumn.initLock = true
        }
        if (options.showLinenumber) {
            columns.unshift(that.linenumberColumn)
            if (options.showLinenumber === 'lock') that.linenumberColumn.initLock = true
        }
        if (options.showChildcol || (options.showChildcol === undefined && options.hasChild && options.childOptions)) {
            columns.unshift(that.childColumn)
        }
        if (options.showEditbtnscol) columns.push(that.editBtnsColumn)
        
        rowArr = columns2Arr(columns, rowArr)
        // the last model can't lock
        that.columnModel[that.columnModel.length - (options.showEditbtnscol ? 2 : 1)].lock = false
        // hidden fields
        if (options.hiddenFields) that.hiddenFields = options.hiddenFields
        // create thead
        that.$thead  = $('<thead></thead>')
        $.each(rowArr, function(i, arr) {
            var $tr = $('<tr style="height:25px;"></tr>'), $num = '<th class="datagrid-number"></th>', $th
            
            $.each(arr, function(k, n) {
                label   = n.label || n.name
                align   = n.align ? (' align="'+ n.align +'"') : ''
                width   = n.width ? (' width="'+ n.width +'"') : ''
                colspan = n.colspan ? ' colspan="'+ n.colspan +'"' : ''
                rowspan = (rowArr.length - n.rowspan > 1) ? ' rowspan="'+ (rowArr.length - n.rowspan) +'"' : ''
                resize  = '<div class="'+ that.classnames.th_resizemark +'"></div>'
                menu    = ''
                
                if (n[keys.gridCheckbox]) label = '<input type="checkbox" data-toggle="icheck">'
                if (n.colspan) align = ' align="center"'
                if (n.thalign) align = ' align="'+ n.thalign +'"'
                if (n.menu && options.columnMenu) menu = ' class="'+ that.classnames.th_menu +'"'
                
                $th = $('<th'+ menu + width + align + colspan + rowspan +'><div><div class="datagrid-space"></div><div class="datagrid-label">'+ label +'</div><div class="'+ that.classnames.th_cell +'">'+ resize +'</div></div></th>')
                $th.data('index', n.index).appendTo($tr)
                
                if (!rowspan) $th.addClass('single-row')
                if (n[keys.gridChild]) $th.addClass(that.classnames.td_child)
                if (n[keys.gridNumber]) $th.addClass(that.classnames.td_linenumber)
                if (n[keys.gridCheckbox]) $th.addClass(that.classnames.td_checkbox)
                if (options.fieldSortable && n.quicksort) $th.addClass('datagrid-quicksort-th')
                
                n.th = $th
            })
            
            $tr.appendTo(that.$thead)
        })
        
        that.$thead.appendTo(that.$element).initui()
    }
    
    Datagrid.prototype.createTbody = function() {
        var that = this, options = that.options, data = options.data, model = that.columnModel, cols = []
        
        if (data) {
            if (typeof data === 'string') {
                if (data.trim().startsWith('[') || data.trim().startsWith('{')) {
                    data = data.toObj()
                } else {
                    data = data.toFunc()
                }
            }
            if (typeof data === 'function') {
                data = data.call()
            }
            
            options.data = data
            that.tools.createTrsByData(data)
        } else if (options.dataUrl) {
            var data = {}
            
            if (typeof options.initFilter === 'object' && options.initFilter && options.jsonPrefix) {
                $.each(options.initFilter, function(k, v) {
                    data[options.jsonPrefix +'.'+ k] = v
                })
            }
            
            that.$element.data('filterDatas', data)
            
            that.tools.loadData(data)
        }
    }
    
    Datagrid.prototype.refresh = function(filterFlag) {
        var that = this, options = that.options, tools = that.tools, isDom = that.isDom, pageInfo = BJUI.pageInfo, paging = that.paging, postData = {}
        
        if (!options.dataUrl) {
            if (options.data && options.data.length) {
                tools.initTbody(that.allData, true)
                return
            }
            
            BJUI.debug('BJUI.Datagrid: Not Set the dataUrl option!')
            return
        }
        
        if (!options.postData || !options.postData[pageInfo.pageSize]) {
            postData[pageInfo.pageSize]    = paging.pageSize
            postData[pageInfo.pageNum] = paging.pageNum
        }
        if (options.initFilter && typeof options.initFilter === 'object') {
            if (typeof options.initFilter === 'object' && options.initFilter && options.jsonPrefix) {
                $.each(options.initFilter, function(k, v) {
                    postData[options.jsonPrefix +'.'+ k] = v
                })
            }
            that.doInitFilter = true
        }
        if (filterFlag)
            $.extend(postData, that.$element.data('filterDatas') || {})
        
        tools.loadData(postData, true)
        
        // clear fiter
        if (!filterFlag) {
            that.filterDatas = null
            $.each(that.columnModel, function(i, n) {
                n.th.trigger('filter.bjui.datagrid.th', [false])
                n.isFiltered = false
                if (n.$quickfilter) n.$quickfilter.trigger('clearfilter.bjui.datagrid.thead')
            })
            // clear sort
            that.orders = {}
            that.$thead.find('> tr > th.datagrid-quicksort-th').find('> div > .datagrid-label > i').remove()
        }
    }
    
    Datagrid.prototype.refreshParent = function(filterFlag) {
        var that = this, $parent = that.$element.data('bjui.datagrid.parent')
        
        if ($parent && $parent.length)
            $parent.closest('table').datagrid('refresh', filterFlag)
    }
    
    Datagrid.prototype.refreshChild = function(row, filterFlag) {
        var that = this, $trs = that.$tbody.find('> tr'), $table,
            refresh = function(obj) {
                $table = obj.data('bjui.datagrid.child')
                
                if ($table && $table.length && $table.isTag('table'))
                    $table.datagrid('refresh', filterFlag)
            }
        
        if (row instanceof jQuery) {
            row.each(function() {
                refresh($(this))
            })
        } else if (isNaN(row)) {
            $.each(row.split(','), function(i, n) {
                if (n * 2 < $trs.length)
                    refresh($trs.eq(n * 2))
            })
        } else {
            if (row * 2 < $trs.length)
                refresh($trs.eq(row * 2))
        }
    }
    
    // api
    Datagrid.prototype.showChild = function(row, flag, func) {
        if (typeof flag === 'undefined')
            flag = 'toggle'
        
        var that   = this, options = that.options, $child, $td, $table, index, trData, childOptions, dataUrl, $trs = that.$tbody.find('> tr:not(.'+ that.classnames.tr_child +')'),
            fixedH = function() {
                //if (!options.fullGrid)
                    that.fixedWidth()
                
                that.fixedHeight()
            },
            fixedL = function(index, showorhide, height) {
                if (that.$lockTableB) {
                    var $locktr = that.$lockTableB.find('> tbody > tr:eq('+ index +')')
                    
                    $locktr.toggle(showorhide)
                    
                    if (height)
                        $locktr.height(height)
                    else if (!$locktr.height())
                        $locktr.height($child.height())
                }
            },
            show = function($tr, $child, $table) {
                $td.find('> div').html(BJUI.doRegional(FRAG.gridShrinkBtn, that.regional))
                
                $child.fadeIn('normal', function() {
                    if (!$table.data('bjui.datagrid.init')) {
                        childOptions = $.extend(true, {}, that.childOptions), dataUrl = childOptions.dataUrl
                        
                        if (that.isDom) trData = $tr.data('initData') || that.tools.setDomData($tr)
                        else {
                            trData = that.data[that.tools.getNoChildDataIndex($tr.index())]
                        }
                        
                        if (dataUrl && !dataUrl.isFinishedTm()) {
                            dataUrl = that.tools.replacePlh(dataUrl, trData)
                            
                            if (!dataUrl.isFinishedTm()) {
                                BJUI.debug('BJUI.Datagrid: The datagrid options \'childOptions\' in the \'dataUrl\' options is incorrect: '+ dataUrl)
                            } else {
                                childOptions.dataUrl = dataUrl
                            }
                        }
                        
                        $table
                            .datagrid(childOptions)
                            .data('bjui.datagrid.parent', $tr)
                            .on('completed.bjui.datagrid', $.proxy(function() {
                                fixedH()
                                fixedL(index, true, $child.outerHeight())
                                
                                if (func)
                                    func.apply(that, [$table])
                            }, that))
                            .on('bjui.datagrid.child.resize', function() {
                                $table
                                    .datagrid('fixedWidth')
                                    .datagrid('fixedHeight')
                            })
                        
                        $tr.data('bjui.datagrid.child', $table)
                    } else {
                        fixedH()
                        fixedL(index, true)
                        
                        if (func)
                            func.apply(that, [$table])
                    }
                })
            },
            hide = function($tr, $child, $table) {
                $child.fadeOut('normal', function() {
                    $td.find('> div').html(BJUI.doRegional(FRAG.gridExpandBtn, that.regional))
                    
                    fixedH()
                    fixedL(index, false)
                    
                    if (func)
                        func.apply(that, [$table])
                })
            },
            showhide = function($tr) {
                $child = $tr.next('.'+ that.classnames.tr_child)
                
                if ($child && $child.length) {
                    $td    = $tr.find('> td.'+ that.classnames.td_child)
                    index  = $child.index()
                    $table = $child.find('> td').find('table.table-child')
                    
                    if ($table && $table.length) {
                        if (flag && flag === 'toggle') {
                            $child.is(':hidden') ? show($tr, $child, $table) : hide($tr, $child, $table)
                        } else {
                            flag ? show($tr, $child, $table) : hide($tr, $child, $table)
                        }
                    }
                }
            }
        
        if (func) {
            if (typeof func === 'string')
                func = func.toFunc()
            if (typeof func !== 'function')
                func = false
        }
        
        if (row instanceof jQuery) {
            row.each(function() {
                showhide($(this))
            })
        } else if (isNaN(row)) {
            $.each(row.split(','), function(i, n) {
                var tr = $trs.eq(parseInt(n.trim(), 10))
                
                if (tr && tr.length)
                    showhide(tr)
            })
        } else if (!isNaN(row)) {
            var tr = $trs.eq(row)
            
            if (tr && tr.length)
                showhide(tr)
        }
    }
    
    // api
    Datagrid.prototype.updateRow = function(row, updateData) {
        var that = this, options = that.options, data_index, data, url, $tr,
            doUpdate = function(tr, updateData) {
                $.extend(data, typeof updateData === 'object' && updateData)
                
                that.dialogEditComplete(tr, data)
                
                // refresh child
                if (data['refresh.datagrid.child']) {
                    var $child = tr.data('bjui.datagrid.child')
                    
                    if ($child && $child.length)
                        $child.datagrid('refresh')
                    else
                        that.showChild(row)
                }
                
                // fixedH
                if (options.height === 'auto') {
                    var scrollTop = that.$boxB.scrollTop()
                    
                    that.$boxB.scrollTop(5)
                    if (that.$boxB.scrollTop()) {
                        that.fixedHeight()
                        that.$boxB.scrollTop(scrollTop)
                    }
                }
            }
        
        if (row instanceof jQuery) {
            $tr = row
        } else if (!isNaN(row)) {
            $tr = that.$tbody.find('> tr:not(.'+ that.classnames.tr_child +')').eq(parseInt(row, 10))
        } else {
            BJUI.debug('BJUI.Datagrid: Func \'updateRow\', Parameter \'row\' is incorrect!')
            return
        }
        
        if (that.isDom) data = $tr.data('initData') || that.tools.setDomData($tr)
        else {
            data_index = that.tools.getNoChildDataIndex($tr.index())
            data = that.data[data_index]
        }
        
        if (updateData) {
            if (typeof updateData === 'string') {
                if (updateData.trim().startsWith('{'))
                    updateData = updateData.toObj()
                else
                    updateData = updateData.toFunc()
            }
            if (typeof updateData === 'function')
                updateData = updateData.apply()
                
            if (typeof updateData !== 'object' && !options.updateRowUrl) {
                BJUI.debug('BJUI.Datagrid: Func \'updateRow\', Parameter \'updateData\' is incorrect!')
                return
            }
            
            doUpdate($tr, updateData)
        } else if (options.updateRowUrl) {
            url = that.tools.replacePlh(options.updateRowUrl, data)
            
            if (!url.isFinishedTm()) {
                BJUI.debug('BJUI.Datagrid: The datagrid options \'updateRowUrl\' is incorrect!')
            } else {
                BJUI.ajax('doajax', {
                    url       : url,
                    type      : options.loadType,
                    okCallback: function(json) {
                        doUpdate($tr, json)
                    }
                })
            }
        } else {
            BJUI.debug('BJUI.Datagrid: The datagrid options \'updateRowUrl\' is not set!')
        }
    }
    
    // api
    Datagrid.prototype.doAjaxRow = function(row, opts) {
        var that = this, options = that.options, $tr, data, data_index, url
        
        if (row instanceof jQuery) {
            $tr = row
        } else if (!isNaN(row)) {
            $tr = that.$tbody.find('> tr:not(.'+ that.classnames.tr_child +')').eq(parseInt(row, 10))
        } else {
            BJUI.debug('BJUI.Datagrid: Func \'doAjaxRow\', Parameter \'row\' is incorrect!')
            return
        }
        if (typeof opts === 'object' && opts.url) {
            if (typeof opts.reload === 'undefined')
                opts.reload = false
            if (!opts.callback && !opts.okCallback) {
                opts.okCallback = function(json, options) {
                    that.updateRow($tr, typeof json === 'object' && !json[BJUI.keys.statusCode] && json)
                }
            }
            
            if (that.isDom) data = $tr.data('initData') || that.tools.setDomData($tr)
            else {
                data_index = that.tools.getNoChildDataIndex($tr.index())
                data = that.data[data_index]
            }
            
            url = opts.url
            
            if (!data || data.addFlag)
                url = url.replace(/{\/?[^}]*}/g, '')
            else
                url = that.tools.replacePlh(url, data)
            
            if (!url.isFinishedTm()) {
                BJUI.debug('BJUI.Datagrid: Func \'doAjaxRow\', options \'url\' is incorrect: '+ url)
            }
            
            opts.url = url
            opts.loadingmask = true
            opts.target = that.$boxB
            
            BJUI.ajax('doajax', opts)
        } else {
            BJUI.debug('BJUI.Datagrid: Func \'doAjaxRow\', options is incorrect or the property \'url\' is not set!')
        }
    }
    
    Datagrid.prototype.filter = function(data) {
        var that = this, options = that.options, nodatatr = that.$tbody.find('> tr.datagrid-nodata').length
        
        if (data && typeof data === 'object') {
            if (data.clearOldPostData || !options.postData)
                options.postData = {}
            
            $.extend(options.postData, data)
        }
        
        // reset pageNum
        that.paging.pageNum = 1
        
        that.refresh()
        
        if (nodatatr) {
            that.$element.one('afterLoad.bjui.datagrid', function() {
                that.needfixedWidth = true
                that.fixedWidth()
                that.needfixedWidth = null
            })
        }
    }
    
    Datagrid.prototype.reload = function(option) {
        var that = this, options = that.options, data, $element
        
        if (option && typeof option === 'object') {
            if (option.clearOldPostData)
                delete options.postData
            
            if (option.columns)
                delete options.columns
            
            $.extend(true, options, option)
        }
        
        that.destroy()
        
        $element = that.$element
        $element.data('bjui.datagrid', (data = new Datagrid($element, options)))
        
        if (data)
            data.init()
    }
    
    Datagrid.prototype.destroy = function() {
        var that = this, $element = that.$grid.data('bjui.datagrid.table')
        
        if ($element) {
            that.$element
                .html($element.html())
                .removeData()
                .insertBefore(that.$grid)
            
            that.$grid.remove()
        }
    }
    
    Datagrid.prototype.initTop = function() {
        var that = this, options = that.options, regional = that.regional, hastoolbaritem = false, $group, groupHtml = '<div class="btn-group" role="group"></div>', btnHtml = '<button type="button" class="btn" data-icon=""></button>'
        
        if (options.showToolbar) {
            if (options.toolbarItem || options.toolbarCustom) {
                if (options.toolbarItem) {
                    var itemFunc = options.toolbarItem.toFunc()
                    
                    if (typeof itemFunc === 'function') {
                        options.toolbarItem = itemFunc.apply()
                    }
                    
                    hastoolbaritem = true
                    if (options.toolbarItem.indexOf('all') >= 0) options.toolbarItem = 'add, edit, cancel, save, |, del, |, refresh, |, import, export, exportf'
                    $.each(options.toolbarItem.split(','), function(i, n) {
                        n = n.trim().toLocaleLowerCase()
                        if (!$group || n === '|') {
                            $group = $(groupHtml).appendTo(that.$toolbar)
                            if (n === '|') return true
                        }
                        
                        if (n === 'add') {
                            that.$toolbar_add = $(btnHtml).attr('data-icon', 'plus').addClass('btn-blue').text(options.addName || BJUI.getRegional('datagrid.add'))
                                .appendTo($group)
                                .on('click', function(e) {
                                    that.add()
                                })
                        } else if (n === 'edit') {
                            that.$toolbar_edit = $(btnHtml).attr('data-icon', 'edit').addClass('btn-green').text(options.editName || BJUI.getRegional('datagrid.edit'))
                                .appendTo($group)
                                .on('click', function(e) {
                                    var $selectTrs = that.$tbody.find('> tr.'+ that.classnames.tr_selected)
                                    
                                    if (!options.editMode) return false
                                    if (!$selectTrs.length) {
                                        $(this).alertmsg('info', BJUI.getRegional('datagrid.selectMsg'))
                                    } else {
                                        if (options.inlineEditMult) {
                                            that.doEditRow($selectTrs)
                                        } else {
                                            if (that.$lastSelect) that.doEditRow(that.$lastSelect)
                                            else that.doEditRow($selectTrs.first())
                                        }
                                    }
                                })
                        } else if (n === 'cancel') {
                            that.$toolbar_calcel = $(btnHtml).attr('data-icon', 'undo').addClass('btn-orange').text(options.cancelName || BJUI.getRegional('datagrid.cancel'))
                                .appendTo($group)
                                .on('click', function(e) {
                                    that.doCancelEditRow(that.$tbody.find('> tr.'+ that.classnames.tr_edit))
                                })
                        } else if (n === 'save') {
                            that.$toolbar_save = $(btnHtml).attr('data-icon', 'save').addClass('btn-default').text(options.saveName || BJUI.getRegional('datagrid.save'))
                                .appendTo($group)
                                .on('click', function(e) {
                                    that.doSaveEditRow()
                                })
                        } else if (n === 'del') {
                            that.$toolbar_del = $(btnHtml).attr('data-icon', 'times').addClass('btn-red').text(options.delName || BJUI.getRegional('datagrid.del'))
                                .appendTo($group)
                                .on('click', function(e) {
                                    var $selectTrs = that.$tbody.find('> tr.'+ that.classnames.tr_selected)
                                    
                                    if ($selectTrs.length) {
                                        that.delRows($selectTrs)
                                    } else {
                                        $(this).alertmsg('info', BJUI.getRegional('datagrid.selectMsg'))
                                    }
                                })
                        } else if (n === 'refresh') {
                            that.$toolbar_refresh = $(btnHtml).attr('data-icon', 'refresh').addClass('btn-green').text(options.refreshName || BJUI.getRegional('datagrid.refresh'))
                                .appendTo($group)
                                .on('click', function(e) {
                                    that.refresh()
                                })
                        } else if (n === 'import') {
                            that.$toolbar_add = $(btnHtml).attr('data-icon', 'sign-in').addClass('btn-blue').text(options.importName || BJUI.getRegional('datagrid.import'))
                                .appendTo($group)
                                .on('click', function(e) {
                                    if (options.importOption) {
                                        var opts = options.importOption
                                        
                                        if (typeof opts === 'string')
                                            opts = opts.toObj()
                                        
                                        if (opts.options && opts.options.url) {
                                            if (opts.type === 'dialog') {
                                                that.$grid.dialog(opts.options)
                                            } else if (opts.type === 'navtab') {
                                                that.$grid.navtab(opts.options)
                                            } else {
                                                that.$grid.bjuiajax('doajax', opts.options)
                                            }
                                        }
                                    }
                                })
                        } else if (n === 'export') {
                            that.$toolbar_add = $(btnHtml).attr('data-icon', 'sign-out').addClass('btn-green').text(options.exportName || BJUI.getRegional('datagrid.export'))
                                .appendTo($group)
                                .on('click', function(e) {
                                    if (options.exportOption) {
                                        var opts = options.exportOption
                                        
                                        if (typeof opts === 'string')
                                            opts = opts.toObj()
                                        
                                        if (opts.options && opts.options.url) {
                                            if (!opts.options.data)
                                                opts.options.data = {}
                                            
                                            $.extend(opts.options.data, that.$element.data('filterDatas') || {}, that.sortData || {})
                                            opts.options.type = 'POST'
                                            
                                            if (opts.type === 'dialog') {
                                                BJUI.dialog(opts.options)
                                            } else if (opts.type === 'navtab') {
                                                BJUI.navtab(opts.options)
                                            } else if (opts.type === 'file') {
                                                opts.options.target = that.$boxB
                                                BJUI.ajax('ajaxdownload', opts.options)
                                            } else {
                                                BJUI.ajax('doajax', opts.options)
                                            }
                                        }
                                    }
                                })
                        } else if (n === 'exportf') {
                            that.$toolbar_add = $(btnHtml).attr('data-icon', 'filter').addClass('btn-green').text(options.exportfName || BJUI.getRegional('datagrid.exportf'))
                                .appendTo($group)
                                .on('click', function(e) {
                                    if (options.exportOption) {
                                        var opts = options.exportOption, filterDatas = that.tools.getRemoteFilterData(true)
                                        
                                        if (typeof opts === 'string')
                                            opts = opts.toObj()
                                        
                                        if (opts.options && opts.options.url) {
                                            if (!opts.options.data)
                                                opts.options.data = {}
                                            
                                            $.extend(opts.options.data, filterDatas, that.sortData || {})
                                            
                                            opts.options.type = 'POST'
                                            
                                            if (opts.type === 'dialog') {
                                                BJUI.dialog(opts.options)
                                            } else if (opts.type === 'navtab') {
                                                BJUI.navtab(opts.options)
                                            } else if (opts.type === 'file') {
                                                opts.options.target = that.$boxB
                                                BJUI.ajax('ajaxdownload', opts.options)
                                            } else {
                                                BJUI.ajax('doajax', opts.options)
                                            }
                                        }
                                    }
                                })
                        }
                    })
                }
                
                if (options.toolbarCustom) {
                    var $custom, $custombox = $('<div style="display:inline-block;"></div>')
                    
                    if (typeof options.toolbarCustom === 'string') {
                        var custom = $(options.toolbarCustom)
                        
                        if (custom && custom.length) {
                            $custom = custom
                        } else {
                            custom = custom.toFunc()
                            if (custom) {
                                $custom = custom.call(that)
                                if (typeof $custom === 'string') $custom = $($custom)
                            }
                        }
                    } else if (typeof options.toolbarCustom === 'function') {
                        $custom = options.toolbarCustom.call(that)
                        if (typeof $custom === 'string') $custom = $($custom)
                    } else {
                        $custom = options.toolbarCustom
                    }
                    
                    if ($custom && $custom.length && typeof $custom !== 'string') {
                        if (hastoolbaritem) {
                            $custombox.css('margin-left', '5px')
                        }
                        $custombox.appendTo(that.$toolbar)
                        $custom.appendTo($custombox)
                    }
                }
                
                that.$toolbar.initui()
            }
        }
    }
    
    Datagrid.prototype.initThead = function() {
        var that = this, options = that.options, tools = that.tools, columnModel = that.columnModel, width, cols = []
        
        that.$tableH.append(that.$thead)
        
        that.init_thead    = true
        that.$trsH         = that.$thead.find('> tr')
        that.table_width   = 0
        that.$colgroupH    = that.$tableH.find('> colgroup')
        that.fixtedColumnWidthCount = 0
        
        $.each(that.columnModel, function(i, n) {
            var lockWidth = ''
            
            if (n === that.checkboxColumn || n === that.childColumn || n === that.editBtnsColumn || n.finalWidth)
                lockWidth = ' class="datagrid_col_lockwidth"'
            
            width = n.width
            
            if ((!width || width === 'auto') && !that.hasAutoCol) {
                that.hasAutoCol = true
            }
            
            cols.push('<col style="width:'+ (width && width !== 'auto' ? width +'px' : 'auto') +'"'+ lockWidth +'>')
            n.width = width
        })
        
        that.table_width = that.$grid.width()
        
        that.$colgroupH.html(cols.join(''))
        
        // thead - events
        var $ths = that.$trsH.find('> th')
        // events - quicksort
        $ths.filter('.datagrid-quicksort-th')
            .on('click.bjui.datagrid.quicksort', function(e) {
                var $target = $(e.target)
                
                if (!$target.closest('.'+ that.classnames.th_cell).length && !that.isResize)
                    tools.quickSort(columnModel[$(this).data('index')])
            })
        
        // events - filter
        $ths.filter('.datagrid-column-menu')
            .on('filter.bjui.datagrid.th', function(e, flag) {
                var $th = $(this), $btn = $th.find('> div > .'+ that.classnames.th_cell +'> .'+ that.classnames.btn_menu +'> .btn')
                
                if (flag) {
                    $th.addClass('filter-active')
                    $btn.find('> i').attr('class', 'fa fa-filter')
                } else {
                    $th.removeClass('filter-active')
                    $btn.find('> i').attr('class', 'fa fa-bars')
                }
            })
        
        // events - contextmenu
        if (options.contextMenuH) {
            tools.contextmenuH()
        }
        
        that.initTbody()
        
        if (options.columnResize) that.colResize()
        if (options.columnMenu)   that.colMenu()
        if (options.paging)       that.initPaging()
        if (options.editMode)     that.edit()
        
        var delayFunc = function() {
            if (options.showTfoot) that.initTfoot()
            
            /* render */
            if (that.renderTds && that.renderTds.length) {
                var $trs = that.$tbody.find('> tr:not(.'+ that.classnames.tr_child +', .datagrid-nodata)'), j = that.renderTds && that.renderTds.length, fixedWidthModel = {}
                var $tempTrs = $(), tempDatas = []
                
                for (var i = 0; i < j; i++) {
                    var obj = that.renderTds[i], label = obj.render.call(that, obj.label, obj.data, that.columnModel[obj.tdindex].items, that.columnModel[obj.tdindex].itemattr)
                    var tempData = $.extend({}, obj.data)
                    
                    if (!fixedWidthModel[obj.tdindex] && that.columnModel[obj.tdindex].fixedWidth)
                        fixedWidthModel[obj.tdindex] = that.columnModel[obj.tdindex]
                    
                    if (that.isTemplate) {
                        var tempData = {}, tempIndex = $.inArray($trs.eq(obj.trindex)[0], $tempTrs)
                        
                        if (tempIndex == -1) {
                            $tempTrs = $tempTrs.add($trs.eq(obj.trindex))
                            
                            tempData = $.extend({}, obj.data)
                            tempData[that.columnModel[obj.tdindex]['name']] = label
                            
                            tempDatas.push(tempData)
                        } else {
                            tempDatas[tempIndex][that.columnModel[obj.tdindex]['name']] = label
                        }
                    } else {
                        $trs.eq(obj.trindex).find('> td:eq('+ obj.tdindex +') > div:last').html(label)
                    }
                }
                
                // for tdTemplate
                $.each($tempTrs, function(i) {
                    var $td = $(this).find('> td.datagrid-template-td'), html = $td.html()
                    
                    if ($td.length) {
                        $td.html(tools.replacePlh4Template(html, tempDatas[i]))
                    }
                })
            }
            
            if (that.isTemplate)
                that.$grid.data('bjui.datagrid.trs.template', that.$tbody.html())
            else
                that.$grid.data('bjui.datagrid.trs.normal', that.$tbody.html())
            
            that.initEvents()
            that.$tableB.initui()
            that.$lockTableB && that.$lockTableB.initui()
            
            tools.setBoxbH()
            
            /* tree - collapse */
            if (that.collapseIndex && that.collapseIndex.length) {
                that.expand(that.collapseIndex.join(','), false)
                that.collapseIndex = null
            }
            
            setTimeout(function() {
                that.fixedWidth('init')
                that.initLock()
                that.$element.trigger('completed.bjui.datagrid', {datas:that.data})
                that.$boxM && that.$boxM.trigger('bjui.ajaxStop').hide()
                
                if ((that.options.width.endsWith('%') && 
                    (that.options.flowLayoutWidth && that.$grid.width() < that.options.flowLayoutWidth)
                        || that.options.dialogFilterW && that.$grid.width() < that.options.dialogFilterW)
                        || that.options.dialogFilterW === 0) {
                    $(window).resize()
                }
                
                that.resizeGrid()
            }, 50)
            
            that.delayFilterTimeout && clearInterval(that.delayFilterTimeout)
        }
        
        if (options.filterThead) {
            if (that.delayRender) {
                that.delayFilterTimeout = setInterval(function() {
                    if (!that.delayRender) {
                        that.filterInThead()
                        delayFunc()
                    }
                }, 100)
            } else {
                that.filterInThead()
                delayFunc()
            }
        } else {
            delayFunc()
        }
    }
    
    Datagrid.prototype.fixedWidth = function(isInit) {
        var that = this, options = that.options, bW, excludeW = 0, fixedW, columnModel = that.columnModel, length = columnModel.length
        
        if (isInit && that.initFixedW) return
        that.initFixedW = true
        
        var setNewWidth = function() {
            if (String(that.options.width).endsWith('%'))
                that.$grid.css('width', '')
            
            that.$boxH.find('> div').css('width', '')
            that.$boxB.find('> div').css('width', '')
            that.$boxF && that.$boxF.find('> div').css('width', '')
            that.$boxP && that.$boxP.find('> div.paging-content').css('width', '')
            
            bW = (that.$boxB.find('> div'))[0].clientWidth
            
            if (that.options.hasChild) {
                var scrollTop = that.$boxB.scrollTop()
                
                that.$boxB.scrollTop(1)
                
                if (that.$boxB.scrollTop()) {
                    that.$boxB.scrollTop(scrollTop)
                }
            }
            if (that.$element.hasClass('table-child'))
                bW = bW - 18
            
            that.$boxB.find('> div').width(bW)
            that.$boxH.find('> div').width(bW)
            that.$boxF && that.$boxF.find('> div').width(bW)
            
            if (that.table_width > bW || options.fullGrid)
                that.$boxP && that.$boxP.find('> div.paging-content').width(bW)
            else
                that.$boxP && that.$boxP.find('> div.paging-content').width(that.table_width)
            
            if (options.fullGrid || that.isTemplate || that.needfixedWidth || (that.hasAutoCol && isInit)) {
                $('body').find('> .bjui-datagrid').remove()
                
                var oldTheight = that.$tableH.height(),
                    $grid = $('<div class="bjui-datagrid forwidth"></div>'),
                    $tableB = that.$element.clone().addClass('table table-bordered').appendTo($grid)
                
                $tableB.find('> tbody').before(that.$thead.clone())
                
                $tableB.find('> colgroup > col').each(function(i) {
                    var $col = $(this), dataLength = that.data.length ? String(that.data[that.data.length - 1].gridNumber).length : 2
                    
                    if ($col.hasClass('datagrid_col_lockwidth')) return true
                    if (columnModel[i] === that.linenumberColumn) {
                        dataLength == 1 && (dataLength = 2)
                        $col.width(dataLength * 15)
                    } else if (!columnModel[i].width || columnModel[i].width === 'auto' || that.isTemplate)
                        $col.width('')
                })
                
                $grid.width(bW + 17).height(that.$boxB.height()).prependTo($('body'))
                
                if (!(options.fullGrid || that.isTemplate) && options.hScrollbar) {
                    $grid.width('')
                }
                
                if (that.isTemplate)
                    options.tableWidth = '100%'
                
                $tableB.attr('style', 'width:'+ (options.tableWidth || 'auto') +' !important;')
                $tableB.find('thead th > div').height('')
                
                var $tr = $tableB.find('> tbody > tr:first')
                
                if (!$tr.length || that.isTemplate || $tr.hasClass('datagrid-nodata')) {
                    var trHtml = BJUI.StrBuilder()
                    
                    trHtml.add('<tr>')
                    
                    for (var i = 0, j = $tableB.find('colgroup > col').length; i < j; i++) {
                        trHtml.add('<td></td>')
                    }
                    
                    trHtml.add('</tr>')
                    
                    $tableB.find('> tbody').prepend(trHtml.toString())
                    $tr = $tableB.find('> tbody > tr:first')
                }
                
                if (that.isTemplate) {
                    that.$boxP && that.$boxP.find('> div.paging-content').width('100%')
                } 
                
                var $ths = that.$thead.find('th')
                
                $tableB.find('thead > tr:not(.datagrid-filter) > th').each(function(i) {
                    var $this = $(this), v = $this.is(':hidden')
                    
                    if (v) $this.show()
                    $ths.eq(i).find('> div').height($this.find('> div').height())
                    if (v) $this.hide()
                })
                
                that.$boxB.height(that.$boxB.height() + (oldTheight - $tableB.find('> thead').height()))
                that.$boxM && that.$boxM.height(that.$boxB.height()).css('top', that.$boxB.position().top)
                that.$lockB && that.$lockB.height(that.$boxB.height())
                
                $tr.find('> td').each(function(i) {
                    var $col = that.$colgroupB.find('> col:eq('+ i +')')
                    
                    !($col.hasClass('datagrid_col_lockwidth')) && $col.width($(this).outerWidth())
                })
                
                that.$colgroupH.html(that.$colgroupB.html())
                
                if (!that.options.noremove)
                    $grid.remove()
            }
        }
        
        setNewWidth()
    }
    
    Datagrid.prototype.fixedHeight = function(height) {
        var that = this, options = that.options
        
        if (options.height === 'auto') {
            that.boxH = 'auto'
            that.$grid.css('height', '')
            that.$boxB.css('height', '')
            that.tools.setBoxbH()
        } else
            that.tools.setBoxbH(height)
        
        // if scrollLeft
        var scrollLeft = that.$boxB.scrollLeft()
        
        that.$boxB.scrollLeft(5)
        
        if (that.$boxB.scrollLeft()) {
            that.fixedWidth()
            that.$boxB.scrollLeft(scrollLeft)
        }
    }
    
    Datagrid.prototype.initTbody = function() {
        var that = this, options = that.options, tools = that.tools, $trs = that.$tbody.find('> tr'), $tds = $trs.find('> td'), width = options.tableWidth || '0'
        
        that.init_tbody = true
        that.$colgroupB = that.$colgroupH.clone()
        
        that.$tableB.prepend(that.$colgroupB)
        
        if (options.fullGrid || that.isTemplate) width = '100%'
        
        that.$tableH.css('width', width)
        that.$tableB.css('width', width)
        
        // add class
        that.$tableB.removeAttr('data-toggle width').addClass('table table-bordered').removeClass('table-hover')
        
        that.$boxB
            .scroll(function() {
                that.$boxH.find('> div').prop('scrollLeft', this.scrollLeft)
                that.$boxF && that.$boxF.find('> div').prop('scrollLeft', this.scrollLeft)
                that.$lockB && that.$lockB.prop('scrollTop', this.scrollTop)
            })
        
        // if DOM to datagrid
        if (that.isDom) {
            if (options.showLinenumber) {
                that.showLinenumber(options.showLinenumber)
            }
            if (options.showCheckboxcol) {
                that.showCheckboxcol(options.showCheckboxcol)
            }
            if (options.showEditbtnscol) {
                that.showEditCol(options.showEditbtnscol)
            }
            
            that.$grid.data(that.datanames.tbody, that.$tbody.clone())
        }
    }
    
    // init events(only tbody)
    Datagrid.prototype.initEvents = function($trs) {
        var that = this, options = that.options, trs = that.$tbody.find('> tr')
        
        if (!$trs) $trs = trs
        
        $trs.on('click.bjui.datagrid.tr', function(e, checkbox) {
            var $tr = $(this), index = $tr.index(), data, $selectedTrs = that.$tbody.find('> tr.'+ that.classnames.tr_selected), $last = that.$lastSelect, checked, $lockTrs = that.$lockTbody && that.$lockTbody.find('> tr')
            
            if (checkbox) {
                checked = checkbox.is(':checked')
                if (!checked) that.$lastSelect = $tr
                that.selectedRows($tr, !checked)
            } else {
                if ($tr.hasClass(that.classnames.tr_edit)) return
                if (options.selectMult) {
                    that.selectedRows($tr)
                } else {
                    if (!BJUI.KeyPressed.ctrl && !BJUI.KeyPressed.shift) {
                        if ($selectedTrs.length > 1 && $tr.hasClass(that.classnames.tr_selected)) {
                            that.selectedRows($selectedTrs.not($tr))
                            that.$lastSelect = $tr
                        } else {
                            if ($selectedTrs.length && $selectedTrs[0] != this) that.selectedRows(null)
                            if (!$tr.hasClass(that.classnames.tr_selected)) that.$lastSelect = $tr
                            that.selectedRows($tr)
                        }
                    } else {
                        //window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty() //clear selection
                        
                        if (BJUI.KeyPressed.ctrl) {
                            if (!$tr.hasClass(that.classnames.tr_selected)) that.$lastSelect = $tr
                            that.selectedRows($tr)
                        } else if (BJUI.KeyPressed.shift) {
                            if (!$last) $last = that.$lastSelect = $tr
                            if ($last.length) {
                                that.selectedRows(null)
                                if ($last.index() != index) {
                                    if ($last.index() > index) {
                                        that.selectedRows($tr.nextUntil($last).add($tr).add($last), true)
                                    } else {
                                        that.selectedRows($tr.prevUntil($last).add($tr).add($last), true)
                                    }
                                } else {
                                    that.selectedRows(index)
                                }
                            }
                        }
                    }
                }
            }
            
            if (that.isDom)
                data = that.tools.setDomData($tr)
            else
                data = that.data[that.tools.getNoChildDataIndex(index)]
            
            that.$element.trigger('clicked.bjui.datagrid.tr', {target:e.target, tr:$tr, data:data})
        })
        .on('mouseenter.bjui.datagrid', function(e) {
            var $tr = $(this), index = $tr.index()
            
            if (that.isDrag) return false
            
            $tr.addClass('datagrid-hover')
            that.$lockTbody && that.$lockTbody.find('> tr:eq('+ index +')').addClass('datagrid-hover')
        })
        .on('mouseleave.bjui.datagrid', function(e) {
            var $tr = $(this), index = $tr.index()
            
            if (that.isDrag) return false
            
            $tr.removeClass('datagrid-hover')
            that.$lockTbody && that.$lockTbody.find('> tr:eq('+ index +')').removeClass('datagrid-hover')
        })
        // custom event - delete 
        .on('delete.bjui.datagrid.tr', function(e) {
            e.stopPropagation()
            
            var $tr = $(this), tr_index = $tr.index(), data_index = tr_index, data = that.data, gridIndex, allData = that.allData, $lockTrs = that.$lockTbody && that.$lockTbody.find('> tr')
            
            if ($tr.hasClass('datagrid-nodata')) return false
            
            if (that.options.hasChild && that.options.childOptions) {
                data_index = data_index / 2
                
                // remove child dom
                $tr.next().remove()
                $lockTrs && $lockTrs.eq(tr_index).next().remove()
            }
            
            /* remove tree - child */
            if (that.options.isTree) {
                var $childrens = that.getChildrens($tr, null, true), len = $childrens.length
                
                if (that.options.hasChild && that.options.childOptions)
                    len = len / 2
                
                $childrens.remove()
                
                if (!that.isDom) {
                    gridIndex    = data[data_index].gridIndex
                    
                    that.data.splice(data_index + 1, len)
                    that.allData.splice(gridIndex + 1, len)
                }
            }
            
            if (!that.isDom) {
                gridIndex    = data[data_index].gridIndex
                that.data    = data.remove(data_index)     // remove data in the current page data
                that.allData = allData.remove(gridIndex)   // remove data in allData
                
                that.tools.updateGridIndex()
            }
            
            /* update gridNumber */
            if ($.inArray(that.linenumberColumn, that.columnModel) != -1) {
                $tr.nextAll(':not(.'+ that.classnames.tr_child +')').each(function() {
                    var $td = $(this).find('> td.'+ that.classnames.td_linenumber), num = parseInt($td.text(), 10)
                    
                    $td.text(num - 1)
                })
                
                $lockTrs && $lockTrs.eq(tr_index).trigger('delete.bjui.datagrid.tr', [tr_index])
            }
            
            // remove dom
            $tr.remove()
            $lockTrs && $lockTrs.eq(tr_index).remove()
            
            // no data
            that.tools.createNoDataTr()
        })
        
        // child
        that.$grid.off('click.bjui.datagrid.tr.child').on('click.bjui.datagrid.tr.child', 'td.'+ that.classnames.td_child, function(e) {
            e.stopPropagation()
            
            var $this = $(this), $tr = $this.closest('tr'), $child = $tr.next('.'+ that.classnames.tr_child)
            
            if ($child && $child.length)
                that.showChild($tr, !$child.is(':visible'))
        })
        // td checkbox
        .off('ifClicked').on('ifClicked', 'td.'+ that.classnames.td_checkbox +' input', function(e) {
            e.stopPropagation()
            
            var $this = $(this), $tr = $this.closest('tr'), tr_index = $tr.index()
            
            that.$tbody.find('> tr:eq('+ tr_index +')').trigger('click.bjui.datagrid.tr', [$this])
        })
        // th checkbox - check all
        .off('ifChanged').on('ifChanged', 'th.'+ that.classnames.td_checkbox +' input', function(e) {
            e.stopPropagation()
            
            var checked = $(this).is(':checked'), $trs = that.$tbody.find('> tr:not(".'+ that.classnames.tr_child +'")')
            
            that.selectedRows($trs, checked)
        })
        
        
        //contextmenu
        if (options.contextMenuB) {
            $trs.each(function() {
                that.tools.contextmenuB($(this))
            })
        }
        
        // custom update
        that.$tableB.off('click.bjui.datagrid.refresh').on('click.bjui.datagrid.refresh', 'tbody > tr > td [data-toggle="update.datagrid.tr"]', function(e) {
            e.stopPropagation()
            e.preventDefault()
            
            that.updateRow($(this).closest('tr'))
        })
        // custom edit
        .off('click.bjui.datagrid.edit').on('click.bjui.datagrid.edit', 'tbody > tr > td [data-toggle="edit.datagrid.tr"]', function(e) {
            e.stopPropagation()
            e.preventDefault()
            
            var $this = $(this), opts = $this.data('options'), $tr = $this.closest('tr')
            
            if (opts && typeof opts === 'string') opts = opts.toObj()
            
            if (typeof opts === 'object')
                that.externalEdit($tr, opts)
            else
                that.doEditRow($tr)
        })
        // custom ajax
        .off('click.bjui.datagrid.ajax').on('click.bjui.datagrid.ajax', 'tbody > tr > td [data-toggle="ajax.datagrid.tr"]', function(e) {
            e.stopPropagation()
            e.preventDefault()
            
            var $this = $(this), opts = $this.data()
            
            if (opts.options && typeof opts.options === 'string') opts.options = opts.options.toObj()
            $.extend(opts, typeof opts.options === 'object' && opts.options)
            
            if (!opts.url && $this.attr('href'))
                opts.url = $this.attr('href')
            
            that.doAjaxRow($this.closest('tr'), opts)
        })
        // custom addChild
        .off('click.bjui.datagrid.addchild').on('click.bjui.datagrid.addchild', 'tbody > tr > td [data-toggle="addchild.datagrid.tr"]', function(e) {
            e.stopPropagation()
            e.preventDefault()
            
            var $this = $(this), $tr = $this.closest('tr'), $table = $tr.data('bjui.datagrid.child'), $child = $tr.next('.'+ that.classnames.tr_child), trData, data = $this.data('addData'), addData,
                replaceData = function(data) {
                    return data.replace(/#\/?[^#]*#/g, function($1) {
                        var key = $1.replace(/[##]+/g, ''), val = trData[key]
                        
                        if (typeof val === 'undefined' || val === 'null' || val === null)
                            val = ''
                        
                        return val
                    })
                },
                doAdd = function($table) {
                    if (data) {
                        if (typeof data === 'string') {
                            data = replaceData(data)
                            
                            if (data.trim().startsWith('{'))
                                data = data.toObj()
                            else
                                data = data.toFunc()
                        } else {
                            if (typeof data === 'function') {
                                data = data.toFunc()
                            }
                            if (typeof data === 'object') {
                                data = JSON.stringify(data)
                            }
                            
                            data = replaceData(data).toObj()
                        } 
                        
                        if (typeof data === 'object') {
                            addData = data
                        }
                    }
                    
                    $table.datagrid('add', false, addData)
                }
            
            if ($child && $child.length) {
                if (that.isDom) trData = $tr.data('initData') || tools.setDomData($tr)
                else trData = that.data[that.tools.getNoChildDataIndex($tr.index())]
                
                if ($table && $table.length) {
                    doAdd($table)
                } else {
                    that.showChild($tr, true, doAdd)
                }
            }
        })
        // custom delete
        .off('click.bjui.datagrid.del').on('click.bjui.datagrid.del', 'tbody > tr > td [data-toggle="del.datagrid.tr"]', function(e) {
            e.stopPropagation()
            e.preventDefault()
            
            that.delRows($(this).closest('tr'))
        })
        // tree expand || collapse
        .off('click.bjui.datagrid.tree').on('click.bjui.datagrid.tree', 'tbody > tr > td .datagrid-tree-switch', function(e) {
            e.stopPropagation()
            e.preventDefault()
            
            var $t = $(this), $tr = $t.closest('tr'), childLen = $tr.data('child'), level = $tr.data('level'), isExpand = !$t.hasClass('collapsed')
            
            if (childLen) {
                $tr.data('isExpand', !isExpand)
                    .nextAll('.datagrid-tree-level-'+ (level + 1)).slice(0, childLen).toggleClass('collapsed', isExpand).trigger('switch.child.bjui.datagrid.tree', {isExpand:isExpand})
                $t.toggleClass('collapsed', isExpand).find('> i').attr('class', 'fa '+ (isExpand ? 'fa-plus-square-o' : 'fa-minus-square-o'))
            }
            
            if (options.height === 'auto') {
                that.fixedHeight()
            }
        })
        .off('switch.child.bjui.datagrid.tree').on('switch.child.bjui.datagrid.tree', 'tbody > tr', function(e, data) {
            e.stopPropagation()
            e.preventDefault()
            
            var $tr = $(this), childLen = $tr.data('child'), level = $tr.data('level')
            
            if (childLen) {
                $tr.nextAll('.datagrid-tree-level-'+ (level + 1)).slice(0, childLen)
                    .toggleClass('collapsed-child', data[that.options.treeOptions.isExpand])
                    .trigger('switch.child.bjui.datagrid.tree', {isExpand:data[that.options.treeOptions.isExpand]})
            }
        })
        .off('expand.bjui.datagrid.tree').on('expand.bjui.datagrid.tree', 'tbody > tr', function(e) {
            e.stopPropagation()
            e.preventDefault()
            
            var $tr = $(this).data('isExpand', true), $t = $tr.find('> td.datagrid-tree-td .datagrid-tree-switch')
            
            if (!$t || !$t.length || !$t.hasClass('collapsed')) return false
            
            $t.trigger('click.bjui.datagrid.tree')
            
            if (options.height === 'auto') {
                that.fixedHeight()
            }
        })
        .off('collapse.bjui.datagrid.tree').on('collapse.bjui.datagrid.tree', 'tbody > tr', function(e) {
            e.stopPropagation()
            e.preventDefault()
            
            var $tr = $(this).data('isExpand', false), $t = $tr.find('> td.datagrid-tree-td .datagrid-tree-switch')
            
            if (!$t || !$t.length || $t.hasClass('collapsed')) return false
            
            $t.trigger('click.bjui.datagrid.tree')
            
            if (options.height === 'auto') {
                that.fixedHeight()
            }
        })
        // tree add btn
        .off('mouseover.bjui.datagrid.tree').on('mouseover.bjui.datagrid.tree', 'tbody > tr > td.datagrid-tree-td', function(e) {
            e.stopPropagation()
            e.preventDefault()
            
            if (!options.treeOptions.add || that.isDrag)
                return false
            
            var $td = $(this), $tr = $td.closest('tr'), $add = $td.find('.datagrid-tree-add')
            
            if (!$add || !$add.length)
                $td.find('> div').append('<a href="javascript:;" class="datagrid-tree-add" data-toggle="add.datagrid.tree" title="添加"><i class="fa fa-plus-circle"></i></a>')
            else
                $add.show()
        })
        .off('mouseout.bjui.datagrid.tree').on('mouseout.bjui.datagrid.tree', 'tbody > tr > td.datagrid-tree-td', function(e) {
            e.stopPropagation()
            e.preventDefault()
            
            if (!options.treeOptions.add || that.isDrag)
                return false
            
            var $td = $(this), $add = $td.find('.datagrid-tree-add')
            
            if ($add && $add.length)
                $add.hide()
        })
        // tree add
        .off('click.bjui.datagrid.tree.add').on('click.bjui.datagrid.tree.add', 'tbody > tr > td.datagrid-tree-td [data-toggle="add.datagrid.tree"]', function(e) {
            e.stopPropagation()
            e.preventDefault()
            
            var $add = $(this), $tr = $add.closest('tr'), opts = $add.data()
            
            if (opts.addData) {
                if (typeof opts.addData === 'string')
                    opts.addData = opts.addData.toObj()
            }
            
            that.addTree($tr, opts.addLocation || '', opts.addData || {})
        })
        
        if (options.dropOptions.drop) {
            var $trs = that.$tbody.find('> tr:not(.'+ that.classnames.tr_child +')'), beforeDrag = options.dropOptions.beforeDrag
            
            if (typeof beforeDrag === 'string')
                beforeDrag = beforeDrag.toFunc()
            
            if (typeof beforeDrag !== 'function')
                beforeDrag = false
            
            $trs
                .basedrag('destroy')
                .basedrag({
                    exclude: 'input, button, a, .bjui-lookup, .datagrid-tree-switch, .datagrid-tree-add, .datagrid-child-td',
                    drop: $trs,
                    container : that.$boxB,
                    beforeDrag: beforeDrag,
                    treeData: that.data,
                    drag: function() {
                        that.isDrag = true
                    },
                    stop: function() {
                        that.isDrag = false
                        
                        $(this).find('> td.datagrid-tree-td').trigger('mouseout.bjui.datagrid.tree')
                    }
                })
                .off('dropover.bjui.basedrag').on('dropover.bjui.basedrag', function(e, x, y, target) {
                    trs.removeClass('datagrid-hover datagrid-drop-over-after datagrid-drop-over-before').find('.datagrid-tree-box').removeClass('datagrid-drop-over-append')
                    
                    if (this === target[0] || target.hasClass(that.classnames.tr_edit)) {
                        return false
                    }
                    if (that.options.isTree) {
                        var $childrens = that.getChildrens(target)
                        
                        if ($.inArray(this, $childrens) !== -1)
                            return false
                    }
                    
                    var $this = $(this).addClass('datagrid-hover'), height = $this.outerHeight() / 2, top = $this.offset().top
                    
                    if (that.options.isTree)
                        height = 5
                    
                    if (y < (top + height)) {
                        $this.addClass('datagrid-drop-over-before').prevAll(':visible:first').addClass('datagrid-drop-over-after')
                    } else {
                        if (!that.options.isTree || (that.options.isTree && y > (top + $this.outerHeight() - height)))
                            $this.addClass('datagrid-drop-over-after')
                        else if (that.options.isTree) {
                            $this.find('.datagrid-tree-box').addClass('datagrid-drop-over-append')
                        }
                    }
                })
                .off('dropout.bjui.basedrag').on('dropout.bjui.basedrag', function(e, data) {
                    $trs.removeClass('datagrid-hover datagrid-drop-over-after datagrid-drop-over-before')
                    $trs.find('div.datagrid-drop-over-append').removeClass('datagrid-drop-over-append')
                })
                .off('drop.bjui.basedrag').on('drop.bjui.basedrag', function(e, target) {
                    var $this = $(this), position, beforeDrop = options.dropOptions.beforeDrop, afterDrop = options.dropOptions.afterDrop
                    
                    that.afterDrop = false
                    
                    if ($this.hasClass('datagrid-drop-over-before'))
                        position = 'top'
                    else if ($this.hasClass('datagrid-drop-over-after'))
                        position = 'bottom'
                    else if (that.options.isTree && $this.find('.datagrid-tree-box').hasClass('datagrid-drop-over-append'))
                        position = 'append'
                    
                    if (position) {
                        if (position != 'append')
                            that.insertTr(target, $this, position)
                        else {
                            var $parents = that.getParents(target, null, true)
                            
                            if ($.inArray(this, $parents) !== -1) {
                                $this.find('.datagrid-tree-box').removeClass('datagrid-drop-over-append')
                                
                                return false
                            }
                            
                            that.appendTr(target, $this)
                        }
                    }
                    
                    $trs.removeClass('datagrid-drop-over-after datagrid-drop-over-before').find('.datagrid-tree-box').removeClass('datagrid-drop-over-append')
                    
                    if (afterDrop && that.afterDrop) {
                        if (typeof afterDrop === 'function') {
                            afterDrop.apply(that, [target, $this])
                        } else if (options.dropOptions.dropUrl) {
                            var postData = {pageSize:that.paging.pageSize, pageNum:that.paging.pageNum}, type = options.editType, opts = {url:options.dropOptions.dropUrl, type:'POST', reload:false}
                            
                            postData['list'] = []
                            
                            $.each(that.data, function(i, data) {
                                var _data = $.extend({}, data)
                                
                                if (options.dropOptions.scope !== 'drop' || data[options.keys.dropFlag]) {
                                    for (var key in options.keys)
                                        delete _data[options.keys[key]]
                                }
                                if (options.dropOptions.scope === 'drop') {
                                    if (data[options.keys.dropFlag]) {
                                        postData['list'].push(_data)
                                    }
                                } else {
                                    postData['list'].push(_data)
                                }
                            })
                            
                            if (postData) {
                                postData = JSON.stringify(options.dropOptions.paging && options.paging ? postData : postData['list'])
                                
                                if (type && type === 'raw') {
                                    opts.data = postData
                                    opts.contentType = 'application/json'
                                } else {
                                    opts.data = {json:postData}
                                    type && (opts.type = type)
                                }
                                
                                BJUI.ajax('doajax', opts)
                            }
                        }
                    }
                })
        }
    }
    
    Datagrid.prototype.getChildrens = function(tr, childrens, hasChild, maxLevel) {
        var that = this, childLen = tr.data('child'), level = tr.data('level')
        
        if (maxLevel) maxLevel --
        if (!childrens) childrens = $()
        if (childLen) {
            tr.nextAll('.datagrid-tree-level-'+ (level + 1)).slice(0, childLen).each(function() {
                childrens = childrens.add(this)
                
                if (hasChild && $(this).next().hasClass(that.classnames.tr_child))
                    childrens = childrens.add($(this).next())
                
                if (maxLevel)
                    childrens = childrens.add(that.getChildrens($(this), childrens, hasChild, maxLevel))
            })
        }
        
        return childrens
    }
    
    Datagrid.prototype.getParents = function(tr, parents, onlyParent, hasChild) {
        var that = this, level = tr.data('level'), prev
        
        if (!parents) parents = $()
        if (level) {
            prev = tr.prevAll('.datagrid-tree-level-'+ (level - 1) +':first')
            if (prev.length) {
                parents = parents.add(prev)
                
                if (hasChild && prev.next().hasClass(that.classnames.tr_child))
                    parents = parents.add(prev.next())
                
                if (!onlyParent)
                    parents = parents.add(that.getParents(prev, parents, hasChild))
            }
        }
        
        return parents
    }
    
    // only for tree
    Datagrid.prototype.appendTr = function(sTr, dTr, option) {
        if (!this.options.isTree)
            return
        
        var that = this, options = that.options, sData, dData, sIndex = that.tools.getNoChildDataIndex(sTr.index()), dIndex = that.tools.getNoChildDataIndex(dTr.index()), hasChild = sTr.next().hasClass(that.classnames.tr_child),
            keys = options.treeOptions.keys,
            sParent, sParentData, sLevel = sTr.data('level'), dLevel = (dTr.data('level') + 1) || 0, dChildLen = dTr.data('child') + 1,
            dParent, dTd = dTr.find('> td.datagrid-tree-td'), moveIndex, len,
            _lastDTr
        var beforeDrop = options.dropOptions.beforeDrop
        
        if (hasChild) {
            sTr = sTr.add(sTr.next())
            dTr = dTr.add(dTr.next())
        }
        
        sData = that.data[sIndex]
        dData = that.data[dIndex]
        /* beforeDrop */
        if (beforeDrop && typeof beforeDrop === 'string')
            beforeDrop = beforeDrop.toFunc()
        if (beforeDrop && typeof beforeDrop === 'function') {
            if (!beforeDrop.apply(this, [sData, dData, 'append'])) {
                return
            }
        }
        
        sParent = that.getParents(sTr, null, true)
        if (sParent.length) {
            sParentData = that.data[that.tools.getNoChildDataIndex(sParent.index())]
            
            sParentData[keys.childLen] = sParentData[keys.childLen] - 1
            sParent.data('child', sParentData[keys.childLen]).attr('data-child', sParentData[keys.childLen])
            
            if (!sParentData[keys.childLen]) {
                delete sParentData[keys.isParent]
                delete sParentData[keys.isExpand]
                
                var sParentTd = sParent.find('> td.datagrid-tree-td')
                
                sParentTd.html(that.tools.createTreePlaceholder(sParentData, sParentTd.find('.datagrid-tree-title').html()), sParent.data('isExpand'))
            }
        }
        
        if (dTr.length) {
            dTr   = that.getChildrens(dTr, dTr, true)
            _lastDTr = that.getChildrens(dTr.last(), dTr.last(), true, true).last()
            //dData = that.data[dIndex]
            that.expand(dTr.first(), true)
            
            dData[keys.isParent] = true
            dData[keys.childLen] = dChildLen
            
            dTr.first().data('child', dChildLen).attr('data-child', dChildLen)
            dTd.html(that.tools.createTreePlaceholder(dData, dTd.find('.datagrid-tree-title').html(), dTr.first().data('isExpand')))
        }
        
        sTr = that.getChildrens(sTr, sTr, true)
        sTr.filter(':not(.'+ that.classnames.tr_child +')').each(function() {
            var $tr = $(this), level = $tr.data('level'), newLevel = level + (dLevel - sLevel), $td = $tr.find('> td.datagrid-tree-td'), label = $td.find('.datagrid-tree-title').html(),
                trIndex = $tr.index(), trData = that.data[that.tools.getNoChildDataIndex(trIndex)]
            
            if (option && option.isUp) {
                newLevel = dData[keys.level]
            }
            trData[keys.level] = newLevel
            
            $tr.removeClass('datagrid-tree-level-'+ level).addClass('datagrid-tree-level-'+ newLevel)
                .data('level', newLevel).attr('data-level', newLevel)
            
            $td.html(that.tools.createTreePlaceholder(trData, label, $tr.data('isExpand')))
        })
        
        if (option && option.dIndex)
            moveIndex = option.dIndex
        else {
            moveIndex = dTr.last().index() + 1
            if (hasChild)
                moveIndex = moveIndex / 2
        }
        
        //sData = that.data[sIndex]
        len   = (hasChild ? sTr.length / 2 : sTr.length)
        
        that.data.moveItems(sIndex, moveIndex, len)
        that.allData.moveItems(sData.gridIndex, (sData.gridIndex + (moveIndex - sIndex)), len)
        
        that.tools.updateGridIndex()
        
        if (option && option._dTr) {
            dParent = that.getParents(option._dTr, null, true, false)
            if (option.isBefore)
                sTr.insertBefore(option._dTr)
            else if (option.isUp) {
                sTr.insertAfter(_lastDTr)
            } else {
                sTr.insertAfter(option._dTr)
            }
        } else {
            sTr.insertAfter(_lastDTr)
        }
        
        // update the source seq
        if (sParent) {
            var _childs = that.getChildrens(sParent, null, false)
            
            _childs.each(function(i) {
                var _trData = that.data[that.tools.getNoChildDataIndex($(this).index())]
                
                if (_trData) {
                    _trData[keys.order] = i
                    _trData[options.keys.dropFlag] = true
                }
            })
        }
        
        // update this seq and parentid
        if (!dParent)
            dParent = dTr.first()
        
        if (dParent && dParent.length) {
            var _childs = that.getChildrens(dParent, null, false), dParentData = that.data[that.tools.getNoChildDataIndex(dParent.index())]
            
            sData[keys.parentKey] = dParentData[keys.key]
            
            _childs.each(function(i) {
                var _trData = that.data[that.tools.getNoChildDataIndex($(this).index())]
                
                if (_trData) {
                    _trData[keys.order] = i
                    _trData[options.keys.dropFlag] = true
                }
            })
        } else {
            var _trs = sTr.siblings('.datagrid-tree-level-'+ sData[keys.level]).addBack()
            
            sData[keys.parentKey] = null
            
            _trs.each(function(i) {
                var _trData = that.data[that.tools.getNoChildDataIndex($(this).index())]
                
                if (_trData) {
                    _trData[keys.order] = i
                    _trData[options.keys.dropFlag] = true
                }
            })
        }
        
        that.tools.updateLinenumber()
        
        that.afterDrop = true
    }
    
    Datagrid.prototype.insertTr = function(sTr, dTr, position) {
        var that = this, point, options = that.options, keys = options.treeOptions.keys, sData, dData, moveIndex,
            sIndex = that.tools.getNoChildDataIndex(sTr.index()), dIndex = that.tools.getNoChildDataIndex(dTr.index()), hasChild = sTr.next().hasClass(that.classnames.tr_child),
            _start, _end
        var beforeDrop = options.dropOptions.beforeDrop
        var insertTr = function(sTr, dTr, point) {
            if (position === 'bottom') {
                if (hasChild)
                    dTr = dTr.next()
                sTr.insertAfter(dTr)
            } else {
                sTr.insertBefore(dTr)
            }
        }
        
        sData = that.data[sIndex]
        dData = that.data[dIndex]
        
        /* beforeDrop */
        if (beforeDrop && typeof beforeDrop === 'string')
            beforeDrop = beforeDrop.toFunc()
        if (beforeDrop && typeof beforeDrop === 'function') {
            if (!beforeDrop.apply(this, [sData, dData, position])) {
                return
            }
        }
        
        if (sIndex > dIndex) {
            point = position === 'top' ? 0 : 1
        } else {
            point = position === 'top' ? -1 : 0
        }
        
        moveIndex = dIndex + point
        
        if (moveIndex == sIndex && !options.isTree) return
        
        if (hasChild)
            sTr = sTr.add(sTr.next())
        
        if (that.isDom) {
            insertTr(sTr, dTr, point)
        } else {
            sData = that.data[sIndex]
            dData = that.data[dIndex]
            
            if (options.isTree) {
                var len, option = {}, append = false, sParent = that.getParents(sTr.first(), null, true), dParent = that.getParents(dTr, null, true)
                
                if (dData[keys.level] === sData[keys.level] && dData[keys.order] == sData[keys.order] + (position === 'bottom' ? -1 : 1)) {
                    return
                }
                
                /* to append */
                // if bottom
                if (position === 'bottom' && dData[keys.isParent]) {
                    append        = true
                    option._dTr   = dTr
                    option.dIndex = dIndex + 1
                    option.isUp   = true
                }
                // if different level or not the same parent
                else if (sTr.data('level') != dTr.data('level') || sParent[0] !== dParent[0]) {
                    append        = true
                    option._dTr   = dTr
                    option.dIndex = moveIndex
                    dTr           = dParent
                    
                    if (position === 'top')
                        option.isBefore = true
                    
                    if (sIndex < dIndex) {
                        option.dIndex ++
                    }
                }
                if (append) {
                    that.appendTr(sTr, dTr, option)
                    
                    return
                }
                
                sTr = that.getChildrens(sTr, sTr, true)
                len = (hasChild ? sTr.length / 2 : sTr.length) 
                
                that.data.moveItems(sIndex, moveIndex, len)
                that.allData.moveItems(sData.gridIndex, (dData.gridIndex + point), len)
                
                _start = (sIndex > dIndex ? dIndex : sIndex)
                _end = (sIndex > dIndex ? sIndex : dIndex) + (len - 1)
            } else {
                that.data.move(sIndex, moveIndex)
                that.allData.move(sData.gridIndex, (dData.gridIndex + point))
                
                _start = sIndex > dIndex ? dIndex : sIndex
                _end = sIndex > dIndex ? sIndex : dIndex
            }
            
            that.tools.updateGridIndex()
            
            insertTr(sTr, dTr, point)
            
            // update the seqs
            if (sParent) {
                var _childs = that.getChildrens(sParent, null, false, 1)
                
                _childs.each(function(i) {
                    var _trData = that.data[that.tools.getNoChildDataIndex($(this).index())]
                    
                    if (_trData && (_trData[options.keys.gridIndex] >= _start && _trData[options.keys.gridIndex] <= _end)) {
                        _trData[keys.order] = i
                        _trData[options.keys.dropFlag] = true
                    }
                })
            } else {
                for (var i = _start; i <= _end; i++) {
                    var _trData = that.data[i]
                    
                    _trData[options.keys.dropFlag] = true
                }
            }
            
            that.tools.updateLinenumber()
            
            that.afterDrop = true
        }
    }
    
    Datagrid.prototype.addTree = function(row, addLocation, addData) {
        var that = this, options = that.options, $tr, data, tr_index, index
        
        if (options.isTree) {
            if (!addData || typeof addData !== 'object') {
                addData = {}
            }
            
            if (row instanceof jQuery) {
                $tr = row.first()
            } else {
                $tr = that.$tbody.find('> tr:not(.'+ that.classnames.tr_child +')').eq(parseInt(row, 10))
            }
            
            if ($tr && $tr.length) {
                that.$lastSelect = $tr
                that.add(addLocation, addData)
            }
        }
    }
    
    Datagrid.prototype.expand = function(rows, expandFlag) {
        var that = this, options = that.options, $trs = that.$tbody.find('> tr:not(.'+ that.classnames.tr_child +')'), event
        
        if (typeof expandFlag === 'undefined') expandFlag = true
        
        event = (expandFlag ? 'expand' : 'collapse') +'.bjui.datagrid.tree'
        
        if (options.isTree) {
            if (rows instanceof jQuery) {
                rows.trigger(event)
            } else if (isNaN(rows)) {
                $.each(rows.split(','), function(i, n) {
                    var tr = $trs.eq(parseInt(n.trim(), 10))
                    
                    if (tr && tr.length)
                        tr.trigger(event)
                })
            } else if (!isNaN(rows)) {
                var tr = $trs.eq(rows)
                
                if (tr && tr.length)
                    tr.trigger(event)
            }
        }
    }
    
    Datagrid.prototype.initTfoot = function() {
        var that = this, options = that.options, tools = that.tools, columnModel = that.columnModel, $tr = $('<tr></tr>')
        
        that.$boxF      = $('<div class="datagrid-box-f"></div>')
        that.$colgroupF = that.$colgroupH.clone()
        that.$tableF    = that.$tableH.clone().empty()
        that.$tableF.append(that.$colgroupF)
        that.$boxF.append($('<div class="datagrid-wrap-h"></div>').append(that.$tableF))
        that.$boxF.insertAfter(that.$boxB)
        
        that.$tfoot = $('<thead></thead>')
        $.each(columnModel, function(i, n) {
            var $th = $('<th><div></div></th>')
            
            if (n.calc) {
                var calc_html = '<div><div class="datagrid-calcbox">#tit#</div>#number#</div>'
                
                if (n.calc === 'avg')
                    $th.html(calc_html.replace('#tit#', (n.calcTit || 'AVG')).replace('#number#', (n.calc_sum / n.calc_count).toFixed(n.calcDecimal || 2)))
                else if (n.calc === 'count')
                    $th.html(calc_html.replace('#tit#', (n.calcTit || 'COUNT')).replace('#number#', (n.calc_count)))
                else if (n.calc === 'sum')
                    $th.html(calc_html.replace('#tit#', (n.calcTit || 'SUM')).replace('#number#', (n.calc_sum)))
                else if (n.calc === 'max')
                    $th.html(calc_html.replace('#tit#', (n.calcTit || 'MAX')).replace('#number#', (n.calc_max)))
                else if (n.calc === 'min')
                    $th.html(calc_html.replace('#tit#', (n.calcTit || 'MIN')).replace('#number#', (n.calc_min)))
            }
            
            if (n.hidden) $th.css('display', 'none')
            
            $th.appendTo($tr)
        })
        
        that.$tfoot.append($tr).appendTo(that.$tableF)
        
        // events
        that.$tfoot.on('resizeH.bjui.datagrid.tfoot', function() {
            tools.setBoxbH(options.height)
        })
    }
    
    // selected row
    Datagrid.prototype.selectedRows = function(rows, selected) {
        var that = this, $lockTrs = that.$lockTbody && that.$lockTbody.find('> tr'), $trs = that.$tbody.find('> tr')
        var selectedTr = function(n) {
            if (typeof selected === 'undefined') selected = true
            if ($trs.eq(n).hasClass(that.classnames.tr_child)) return
            
            $trs.eq(n)
                .toggleClass(that.classnames.tr_selected, selected)
                .find('> td.'+ that.classnames.td_checkbox +' input').iCheck(selected ? 'check' : 'uncheck')
            
            $lockTrs && $lockTrs.eq(n)
                .toggleClass(that.classnames.tr_selected, selected)
                .find('> td.'+ that.classnames.td_checkbox +' input').iCheck(selected ? 'check' : 'uncheck')
        }
        
        if (rows === null) {
            $trs.removeClass(that.classnames.tr_selected)
                .find('> td.'+ that.classnames.td_checkbox +' input').iCheck('uncheck')
                
            $lockTrs && $lockTrs.removeClass(that.classnames.tr_selected)
                .find('> td.'+ that.classnames.td_checkbox +' input').iCheck('uncheck')
        } else if (typeof rows === 'object') {
            rows.each(function() {
                var $row = $(this), index = $row.index()
                
                if ($row.hasClass(that.classnames.tr_child)) return true
                
                if (typeof selected !== 'undefined') {
                    selectedTr(index)
                } else {
                    $row.toggleClass(that.classnames.tr_selected)
                        .trigger('bjui.datagrid.tr.selected')
                        .find('> td.'+ that.classnames.td_checkbox +' input').iCheck(($row.hasClass(that.classnames.tr_selected) ? 'check' : 'uncheck'))
                    
                    $lockTrs && $lockTrs.eq(index)
                        .toggleClass(that.classnames.tr_selected)
                        .trigger('bjui.datagrid.tr.selected')
                        .find('> td.'+ that.classnames.td_checkbox +' input').iCheck(($row.hasClass(that.classnames.tr_selected) ? 'check' : 'uncheck'))
                }
            })
        } else if (isNaN(rows)) {
            $.each(rows.split(','), function(i, n) {
                selectedTr(parseInt(n.trim(), 10))
            })
        } else if (!isNaN(rows)) {
            selectedTr(parseInt(rows, 10))
        }
        
        if (that.$lastSelect && !that.$lastSelect.hasClass(that.classnames.tr_selected)) {
            that.$lastSelect = null
        }
        
        // selectedTrs
        var $selectedTrs = that.$tbody.find('> tr.'+ that.classnames.tr_selected), datas = []
        
        $selectedTrs.each(function() {
            var $tr = $(this), data_index = $tr.index(), data
            
            data_index = that.tools.getNoChildDataIndex(data_index)
            
            if (that.isDom) data = $tr.data('initData') || that.tools.setDomData($tr)
            else data = that.data[data_index]
            
            datas.push(data)
        })
        
        that.$element.data('selectedTrs', $selectedTrs).data('selectedDatas', datas)
    }
    
    //lock
    Datagrid.prototype.initLock = function() {
        var that = this, columnModel = that.columnModel
        
        that.col_lock_count = 0
        $.each(that.columnModel, function(i, n) {
            if (n.initLock) that.col_lock_count ++
        })
        
        if (that.col_lock_count) that.doLock()
    }
    
    //api - colLock
    Datagrid.prototype.colLock = function(column, lockFlag) {
        var that = this, $th, index, columnModel 
        
        if (that.isTemplate)
            return
        if ($.type(column) === 'number') {
            index = parseInt(column, 10)
            if (index < 0 || index > that.columnModel.length - 1) return
            columnModel = that.columnModel[index]
            $th         = columnModel.th
        } else {
            $th         = column
            index       = $th.data('index')
            columnModel = that.columnModel[index]
        }
        
        if (columnModel === that.editBtnsColumn) return // edit btn column
        else if (columnModel.index === that.columnModel.length - 1) return // last column
        if (typeof columnModel.locked === 'undefined') columnModel.locked = false
        if (columnModel.locked === lockFlag) return
        
        columnModel.initLock = lockFlag
        
        if (lockFlag) {
            that.col_lock_count ++
        } else {
            that.col_lock_count --
        }
        if (that.col_lock_count < 0) that.col_lock_count = 0
        
        that.doLock()
    }
    
    Datagrid.prototype.fixedLockItem = function(type) {
        var that = this, columnModel = that.columnModel, $filterThs = that.$thead.find('> tr.datagrid-filter > th'), $lockTrs = that.$lockTbody && that.$lockTbody.find('> tr')
        
        // out
        if (!type) {
            var fixedTh = function($th, $lockTh) {
                $lockTh.clone().insertAfter($lockTh)
                $lockTh.hide().insertAfter($th)
                $th.remove()
            }
            
            // filterThead
            if ($filterThs && $filterThs.length) {
                that.$lockThead && that.$lockThead.find('> tr.datagrid-filter > th:visible').each(function() {
                    var $lockTh = $(this), index = $lockTh.index(), $th = $filterThs.eq(index)
                    
                    fixedTh($th, $lockTh)
                })
            }
            
            //thead checkbox
            if (that.$lockThead) {
                // checkbox
                if ($.inArray(that.checkboxColumn, columnModel) != -1 && that.checkboxColumn.locked) {
                    var $lockTh = that.$lockThead.find('> tr:first > th.'+ that.classnames.td_checkbox), index = that.checkboxColumn.index, $th = that.$thead.find('> tr:first > th:eq('+ index +')')
                    
                    fixedTh($th, $lockTh)
                }
            }
            
            // inline edit && checkbox td
            if ($lockTrs && $lockTrs.length) {
                $lockTrs.each(function() {
                    var $lockTr = $(this), tr_index = $lockTr.index(), $tr, $td,
                        fixedTd = function($lockTd, tr_index, td_index) {
                            $tr = that.$tbody.find('> tr:eq('+ tr_index +')')
                            $td = $tr.find('> td:eq('+ td_index +')')
                            $lockTd.clone().insertAfter($lockTd)
                            $lockTd.hide().insertAfter($td)
                            $td.remove()
                        }
                    
                    if ($lockTr.hasClass(that.classnames.tr_edit)) {
                        var $lockTd = $lockTr.find('> td:eq('+ columnModel.lockIndex +')'), td_index = $lockTd.index()
                        
                        if ($lockTd.hasClass(that.classnames.td_edit)) {
                            fixedTd($lockTd, tr_index, td_index)
                        }
                    }
                    
                    if ($.inArray(that.checkboxColumn, columnModel) != -1 && that.checkboxColumn.locked) {
                        $lockTr.find('> td.'+ that.classnames.td_checkbox).each(function() {
                            var $lockTd = $(this), td_index = that.checkboxColumn.index
                            
                            fixedTd($lockTd, tr_index, td_index)
                        })
                    }
                })
            }
        } else { //in
            var fixedTh = function($th, $lockTh) {
                $th.clone().html('').insertAfter($th)
                $th.show().insertAfter($lockTh)
                $lockTh.remove()
            }
            
            // filterThead
            if ($filterThs && $filterThs.length) {
                that.$lockThead.find('> tr.datagrid-filter > th:visible').each(function() {
                    var $lockTh = $(this), index = $lockTh.index(), $th = $filterThs.eq(index)
                    
                    fixedTh($th, $lockTh)
                })
            }
            
            //thead checkbox
            if (that.$lockThead) {
                // checkbox
                if ($.inArray(that.checkboxColumn, columnModel) != -1 && that.checkboxColumn.locked) {
                    var $lockTh = that.$lockThead.find('> tr:first > th.'+ that.classnames.td_checkbox), index = that.checkboxColumn.index, $th = that.$thead.find('> tr:first > th:eq('+ index +')')
                    
                    fixedTh($th, $lockTh)
                }
            }
            
            // inline edit && checkbox td
            if ($lockTrs && $lockTrs.length) {
                $lockTrs.each(function() {
                    var $lockTr = $(this), tr_index = $lockTr.index(), $tr, $td,
                        fixedTd = function($lockTd, tr_index, td_index) {
                            $tr = that.$tbody.find('> tr:eq('+ tr_index +')')
                            $td = $tr.find('> td:eq('+ td_index +')')
                            $td.clone().insertAfter($td)
                            $td.show().insertAfter($lockTd)
                            $lockTd.remove()
                        }
                    
                    if ($lockTr.hasClass(that.classnames.tr_edit)) {
                        $lockTr.find('> td.'+ that.classnames.td_edit +':visible').each(function() {
                            var $lockTd = $(this), td_index = $lockTd.index(), model = columnModel[td_index]
                            
                            if (model.locked) {
                                fixedTd($lockTd, tr_index, td_index)
                            }
                        })
                    }
                    if ($.inArray(that.checkboxColumn, columnModel) != -1 && that.checkboxColumn.locked) {
                        $lockTr.find('> td.'+ that.classnames.td_checkbox).each(function() {
                            var $lockTd = $(this), td_index = that.checkboxColumn.index
                            
                            fixedTd($lockTd, tr_index, td_index)
                        })
                    }
                })
            }
        }
    }
    
    //locking
    Datagrid.prototype.doLock = function() {
        var that = this, options = that.options, tools = that.tools, columnModel = that.columnModel, tableW = that.$tableH.width(), width = 0, $trs, $lockTrs, lockedLen = 0
        var hasFoot = that.$boxF && true, top = 0
        
        if (!that.$lockBox || !that.$lockBox.length) {
            that.$lockBox = $('<div class="datagrid-box-l"></div>')
            that.$lockH   = $('<div class="datagrid-box-h"></div>')
            that.$lockB   = $('<div class="datagrid-box-b"></div>')
            that.$lockF   = $('<div class="datagrid-box-f"></div>')
            
            that.$lockTableH = $('<table class="table table-bordered"></table>')
            that.$lockTableB = $('<table></table>').addClass(that.$tableB.attr('class'))
            that.$lockTableF = $('<table class="table table-bordered"></table>')
            
            that.$lockH.append(that.$lockTableH)
            that.$lockB.append(that.$lockTableB)
            that.$lockF.append(that.$lockTableF)
            
            that.$lockBox.append(that.$lockH).append(that.$lockB).prependTo(that.$grid)
            if (hasFoot) {
                that.$lockBox.append(that.$lockF)
                that.$lockF.css('margin-top', (that.$boxB.outerHeight() - that.$boxB[0].clientHeight)).height(that.$boxF.outerHeight())
            }
        } else {
            that.fixedLockItem()
            that.$lockTableH.empty()
            that.$lockTableB.empty()
            that.$lockTableF && that.$lockTableF.empty()
        }
        
        if (that.$boxT)    top += that.$boxT.outerHeight()
        if (that.$toolbar) top += that.$toolbar.outerHeight()
        if (top) that.$lockBox.css({top:top})
        
        // display initLock columns, hide other
        $.each(columnModel, function(i, n) {
            n.lockShow = false
            n.lockHide = false
            if (n.initLock) {
                if (n.hidden) tools.showhide(n, true)
                n.lockHide  = true
                n.locked    = true
                n.lockIndex = lockedLen ++
                width      += n.width
            } else {
                n.lockShow = true
                if (!n.hidden) tools.showhide(n, false)
                else n.lockShow = false
                if (n.locked) n.lockShow = true
                n.locked   = false
            }
        })
        
        that.$lockThead     = that.$thead.clone(true)
        that.$lockTbody     = that.$tbody.clone()
        that.$lockColgroupH = that.$colgroupH.clone()
        that.$lockColgroupB = that.$colgroupB.clone()
        
        that.$lockTableH.append(that.$lockColgroupH).append(that.$lockThead).css('width', width)
        that.$lockTableB.append(that.$lockColgroupB).append(that.$lockTbody).css('width', width)
        
        if (hasFoot) {
            that.$lockTfoot     = that.$tableF.find('> thead').clone()
            that.$lockColgroupF = that.$colgroupF.clone()
            that.$lockTableF.append(that.$lockColgroupF).append(that.$lockTfoot).css('width', width)
        }
        
        // display unlock columns, hide locked columns
        $.each(that.columnModel, function(i, n) {
            if (n.lockShow) tools.showhide(n, true)
            if (n.lockHide) tools.showhide(n, false)
        })
        
        that.$boxH.find('> div').css('width', '')
        that.$boxB.find('> div').css('width', '')
        that.$boxF && that.$boxF.find('> div').css('width', '')
        
        setTimeout(function() {
            var bw = that.$boxB.find('> div').width()
            
            that.$boxB.find('> div').width(bw)
            that.$boxH.find('> div').width(bw)
            that.$boxF && that.$boxF.find('> div').width(bw)
        }, 50)
        
        if (!that.col_lock_count) that.$lockBox.hide()
        else that.$lockBox.show()
        
        // colspan for child tr && nodata tr
        that.$tbody.find('> .'+ that.classnames.tr_child +', .datagrid-nodata').each(function() {
            $(this).find('> td').attr('colspan', that.columnModel.length - that.col_lock_count)
        })
        
        if (width > 1) width = width - 1
        that.$boxH.css('margin-left', width)
        that.$boxB.css('margin-left', width)
        if (hasFoot) that.$boxF.css('margin-left', width)
        
        // fixed height
        that.$lockB.height(that.$boxB[0].clientHeight)
        that.$lockB.prop('scrollTop', that.$boxB[0].scrollTop)
        
        var lockH = that.$lockTableH.height(), H = that.$thead.height(), lockFH = that.$lockTableF && that.$lockTableF.height(), HF = that.$tableF && that.$tableF.height()
        
        if (lockH != H) {
            if (lockH < H) that.$lockTableH.height(H)
            else that.$tableH.height(lockH)
        }
        
        if (lockFH && HF && (lockFH != HF)) {
            if (lockFH < HF) that.$lockTableF.find('> thead > tr:first-child > th:visible:first').height(HF)
            else that.$tableF.find('> thead > tr:first-child > th:visible:first').height(lockFH)
        }
        
        $lockTrs = that.$lockTbody.find('> tr')
        $trs     = that.$tbody.find('> tr')
        
        setTimeout(function() {
            var lockBH = that.$lockTableB.height(), HB = that.$tableB.height()
            
            if (lockBH != HB) {
                if (lockBH > HB) {
                    $lockTrs.each(function(tr_index) {
                        var $lockTr = $(this), $lockTd = $lockTr.find('> td:visible:first'), newH = $lockTd.outerHeight()
                        
                        if (newH > 30) {
                            $lockTr.height(newH)
                            $trs.eq(tr_index).height(newH)
                        }
                    })
                } else {
                    $trs.each(function(tr_index) {
                        var $tr = $(this), $td = $tr.find('> td:visible:first'), newH = $td.outerHeight()
                        
                        if (newH > 30) {
                            $tr.height(newH)
                            $lockTrs.eq(tr_index).height(newH)
                        }
                    })
                }
            }
        }, 20)
        
        that.fixedLockItem(1)
        
        // remove hidden tds
        $lockTrs.find('> td:hidden').remove()
        
        // events
        that.initLockEvents($lockTrs)
    }
    
    // init lockTr Events
    Datagrid.prototype.initLockEvents = function($locktrs) {
        if (!this.$lockTbody) return
        
        var that = this, options = that.options
        
        if (!$locktrs) $locktrs = that.$lockTbody.find('> tr')
        
        $locktrs
            .on('click.bjui.datagrid.tr', function(e) {
                var index = $(this).index(), $td = $(e.target).closest('td')
                
                that.$tbody.find('> tr:eq('+ index +')').trigger('click.bjui.datagrid.tr')
            })
            .on('delete.bjui.datagrid.tr', function(e, index) {
                var $tr = $(this)
                
                if (that.linenumberColumn && that.linenumberColumn.locked) {
                    $tr.nextAll(':not(.'+ that.classnames.tr_child +')').each(function() {
                        var $td = $(this).find('> td.'+ that.classnames.td_linenumber), num = parseInt($td.text(), 10)
                        
                        $td.text(num - 1)
                    })
                }
            })
            .on('mouseenter.bjui.datagrid', function(e) {
                var $tr = $(this), index = $tr.index()
                
                $tr.addClass('datagrid-hover')
                that.$tbody.find('> tr:eq('+ index +')').addClass('datagrid-hover')
            })
            .on('mouseleave.bjui.datagrid', function(e) {
                var $tr = $(this), index = $tr.index()
                
                $tr.removeClass('datagrid-hover')
                that.$tbody.find('> tr:eq('+ index +')').removeClass('datagrid-hover')
            })
        
        //contextmenu
        if (options.contextMenuB) {
            $locktrs.each(function() {
                that.tools.contextmenuB($(this), true)
            })
        }
    }
    
    //api - filterInThead
    Datagrid.prototype.filterInThead = function(isDialog) {
        var that = this, options = that.options, tools = that.tools, regional = that.regional, columnModel = that.columnModel, filterData = {}
        var $tr = isDialog ? $('<ul class="datagrid-thead-dialog-view-ul"></ul>') : $('<tr class="datagrid-filter"></tr>')
        var onFilter = function($input, model, $th) {
            var type = model.type, $others
            
            if ($th.isTag('th')) {
                $others = that.$headFilterUl && that.$headFilterUl.find('> li.li-'+ model.index)
            } else if ($th.isTag('li')) {
                $others = that.$thead.find('> tr.datagrid-filter > th:eq('+ model.index +')')
            }
            
            if ($others) {
                $input.val($others.find('input').val())
                if ($input.isTag('select'))
                    $input.val($others.find('select').val()).selectpicker('refresh')
            }
            
            if (type === 'date') {
                $input.change(function() {
                    doFilter(model, $input.val())
                })
            } else if (type === 'findgrid') {
                $input.change(function() {
                    doFilter(model, $input.val())
                })
            } else if (type === 'tags') {
                $th.on('aftercreated.bjui.tags', '[data-toggle="tags"]', function(e, data) {
                    doFilter(model, data.value)
                })
                
                $input.change(function() {
                    doFilter(model, $input.val())
                })
            } else {
                $input.change(function() {
                    doFilter(model, $input.val())
                })
            }
            
            $input.change(function() {
                if ($th.isTag('th') && !$others) {
                    $others = that.$headFilterUl && that.$headFilterUl.find('> li.li-'+ model.index)
                }
                
                $others && $others.find('input').val($input.val())
                if ($input.isTag('select'))
                    $others && $others.find('select').val($input.val()).selectpicker('refresh')
            })
        }
        var doFilter = function(model, val) {
            tools.quickFilter(model, val ? {operatorA:'like', valA:val} : null)
        }
        var initFilter = (typeof options.initFilter === 'object') && options.initFilter
        
        if (!that.inputs || !that.inputs.length) tools.initEditInputs()
        
        $.each(columnModel, function(i, n) {
            if (isDialog) {
                if (n === that.linenumberColumn || n === that.checkboxColumn || n === that.editBtnsColumn || n === that.childColumn)
                    return true
            }
            
            var $input = $(that.inputs[i]), $th = isDialog ? $('<li></li>') : $('<th></th>'), attrs = ''
            
            if (!n.quickfilter) {
                $th.appendTo($tr)
                return true
            }
            else if (n.type === 'findgrid') $input.data('context', $tr)
            else if (n.type === 'spinner') $input = $('<input type="text" name="'+ n.name +'">')
            else if (n.type === 'boolean') $input = $(BJUI.doRegional('<select name="'+ n.name +'" data-toggle="selectpicker"><option value="">#all#</option><option value="true">#true#</option><option value="false">#false#</option></select>', regional))
            else if (n.type === 'select') {
                if (n.attrs && typeof n.attrs === 'object') {
                    $.each(n.attrs, function(i, n) {
                        attrs += ' '+ i +'='+ n
                    })
                }
                if ($input.find('> option:first-child').val() && (!n.attrs || !n.attrs.multiple)) {
                    $input = $('<select name="'+ n.name +'" data-toggle="selectpicker"'+ attrs +'></select>')
                        .append(BJUI.doRegional('<option value="">#all#</option>', regional))
                        .append($input.html())
                        
                    $input.val('') // for IE8
                }
            }
            
            if (isDialog)
                $th.data('index', i).addClass('li-'+ i).append('<a href="javascript:;" class="datagrid-thead-dialog-sort" title="'+ BJUI.getRegional('datagrid.asc') +'/'+ BJUI.getRegional('datagrid.desc') +'">'+ n.label +'</a>')
            
            $th.append($input)
            
            if (n.hidden) $th.hide()
            if (n.type === 'boolean' && !isDialog) $th.attr('align', 'center')
            $th.appendTo($tr)
            
            $input.data('clearFilter', false)
            
            onFilter($input, n, $th)
            
            // events - clear filter
            $input.on('clearfilter.bjui.datagrid.thead', function() {
                $input.val('')
                if (n.type === 'boolean' || n.type === 'select') $input.selectpicker('refresh')
            })
            
            n.$quickfilter = $input
            
            // init filter
            if (initFilter && typeof initFilter[n.name] !== 'undefined') {
                that.tools.initFilter($input, n)
            }
        })
        
        if (isDialog) {
            $tr.prepend('<li><label>'+ BJUI.getRegional('datagrid.asc') +'/'+ BJUI.getRegional('datagrid.desc') +'</label><span class="quicksort-title">'+ BJUI.getRegional('datagrid.filter') +'</span></li>')
            $tr.hide().appendTo(that.$grid).initui()
            
            that.$headFilterUl = $tr
            // for thead
            that.sortModels = !that.sortModels ? [] : that.sortModels
            
            $tr.off('click.datagrid.thead.quicksort').on('click.datagrid.thead.quicksort', 'a.datagrid-thead-dialog-sort', function(e) {
                var $this = $(this), model = that.columnModel[$this.closest('li').data('index')], html = []
                
                $this.find('> i').remove()
                
                that.tools.quickSort(model)
                
                if (model.sortDesc) {
                    $this.append('<i class="fa fa-long-arrow-down"></i>')
                    that.sortModels[model.index] = model
                } else if (model.sortAsc) {
                    $this.append('<i class="fa fa-long-arrow-up"></i>')
                    that.sortModels[model.index] = model
                } else {
                    delete that.sortModels[model.index]
                }
                
                if (!that.sortData || $.isEmptyObject(that.sortData))
                    that.sortModels = []
                
                $.each(that.sortModels, function(i, n) {
                    if (n)
                        html.push('<i class="datagrid-sort-i fa fa-long-arrow-'+ (n.sortAsc ? 'up' : 'down') +'"></i> '+ n.label)
                })
                
                that.$boxH.find('.datagrid-thead-dialog-filter-msg > .msg-sort')
                    .html(html.length > 0 ? html.join('<em>&nbsp;&gt;&nbsp;</em>') : '')
            })
        } else
            $tr.appendTo(that.$thead).initui()
    }
    
    //api - showhide linenumber column
    Datagrid.prototype.showLinenumber = function(flag) {
        var that = this, options = that.options, model = that.columnModel, numberModel, modelOrder = -1, data = that.data, numberModel_index = $.inArray(that.linenumberColumn, model)
        
        if (numberModel_index != -1)
            numberModel = model[numberModel_index]
        
        if (numberModel) {
            if (typeof flag === 'string' && (flag === 'lock' || flag === 'unlock')) {
                that.colLock(numberModel.th, flag === 'lock' ? true : false)
            } else {
                that.showhideColumn(numberModel.th, flag ? true : false)
            }
        } else if (flag) {
            modelOrder = $.inArray(that.childColumn, model)
            
            modelOrder ++
            numberModel = that.linenumberColumn
            numberModel.index = modelOrder
            model.splice(modelOrder, 0, numberModel)
            
            if (that.inputs && that.inputs.length)
                that.inputs = that.inputs.splice(modelOrder, 0, '')
            
            var $trsH = that.$thead.find('> tr'), col = '<col style="width:30px;">', $th, $filterTr = $trsH.filter('.datagrid-filter'), rowspan = $trsH.length - $filterTr.length
            
            $th = $('<th align="center"'+ (rowspan > 1 ? ' rowspan="'+ rowspan +' "' : '') +'class="'+ that.classnames.td_linenumber + (rowspan == 1 ? ' single-row' : '') +'"><div><div class="datagrid-space"></div><div class="datagrid-label">'+ that.linenumberColumn.label +'</div></div></th>')
            
            that.$colgroupH.find('> col:eq('+ modelOrder +')').before(col)
            that.$colgroupB.find('> col:eq('+ modelOrder +')').before(col)
            that.$colgroupF && that.$colgroupF.find('> col:eq('+ modelOrder +')').before(col)
            $filterTr.length && $filterTr.find('> th:eq('+ modelOrder +')').before('<th></th>')
            $trsH.first().find('> th:eq('+ modelOrder +')').before($th)
            that.$tableF && that.$tableF.find('> thead > tr > th:eq('+ modelOrder +')').before('<th></th>')
            
            numberModel.th    = $th
            numberModel.width = 30
            
            that.$tbody.find('> tr').each(function(i) {
                var $tr = $(this), colspan = that.columnModel.length, linenumber = i, paging = that.paging
                
                if ($tr.hasClass(that.classnames.tr_child) || $tr.hasClass('datagrid-nodata'))
                    $tr.find('> td').attr('colspan', colspan)
                else {
                    linenumber = that.tools.getNoChildDataIndex(linenumber)
                    if (options.linenumberAll)
                        linenumber = ((paging.pageNum - 1) * paging.pageSize + (linenumber))
                    
                    $tr.find('> td:eq('+ modelOrder +')').before('<td align="center" class="'+ that.classnames.td_linenumber +'">'+ (linenumber + 1) +'</td>')
                }
            })
            
            that.$tableF && that.$tableF.find('> thead > tr > th:eq('+ modelOrder +')').before('<th></th>')
            
            $.each(model, function(i, n) {
                n.index = i
                if (n.th) n.th.data('index', i)
            })
            
            $th.find('> div').height($th.outerHeight())
            
            if (flag === 'lock') {
                that.colLock($th, true)
            }
            if (that.$showhide) {
                that.$showhide.remove()
                that.colShowhide(options.columnShowhide)
            }
        }
    }
    
    //api - showhide checkbox column
    Datagrid.prototype.showCheckboxcol = function(flag) {
        var that = this, options = that.options, model = that.columnModel, numberModel = model[0], checkModel, modelOrder = -1, checkModel_index = $.inArray(that.checkboxColumn, model)
        
        if (checkModel_index != -1)
            checkModel = that.columnModel[checkModel_index]
        
        if (checkModel) {
            if (typeof flag === 'string' && (flag === 'lock' || flag === 'unlock')) {
                that.colLock(checkModel.th, flag === 'lock' ? true : false)
            } else {
                that.showhideColumn(checkModel.th, flag)
            }
        } else if (flag) {
            modelOrder = $.inArray(that.linenumberColumn, model)
            if (modelOrder == -1)
                modelOrder = $.inArray(that.childColumn, model)
            
            modelOrder ++
            checkModel = that.checkboxColumn
            checkModel.index = modelOrder
            model.splice(modelOrder, 0, checkModel)
            
            if (that.inputs && that.inputs.length)
                that.inputs = that.inputs.splice(modelOrder, 0, '')
                
            var $trsH = that.$thead.find('> tr'), col = '<col style="width:30px;">', $th, $td, $filterTr = $trsH.filter('.datagrid-filter'), rowspan = $trsH.length - $filterTr.length
            
            $th = $('<th align="center"'+ (rowspan > 1 ? ' rowspan="'+ rowspan +' "' : '') +'class="'+ that.classnames.td_checkbox + (rowspan == 1 ? ' single-row' : '') +'"><div><div class="datagrid-space"></div><div class="datagrid-label"><input type="checkbox" data-toggle="icheck"></div></th>')
            
            that.$colgroupH.find('> col:eq('+ modelOrder +')').before(col)
            that.$colgroupB.find('> col:eq('+ modelOrder +')').before(col)
            that.$colgroupF && that.$colgroupF.find('> col:eq('+ modelOrder +')').before(col)
            $filterTr.length && $filterTr.find('> th:eq('+ modelOrder +')').before('<th></th>')
            $trsH.first().find('> th:eq('+ modelOrder +')').before($th)
            that.$tableF && that.$tableF.find('> thead > tr > th:eq('+ modelOrder +')').before('<th></th>')
            $th.initui()
            
            checkModel.th    = $th
            checkModel.width = 30
            
            that.$tbody.find('> tr').each(function(i) {
                var $tr = $(this), colspan = that.columnModel.length
                
                if ($tr.hasClass(that.classnames.tr_child) || $tr.hasClass('datagrid-nodata'))
                    $tr.find('> td').attr('colspan', colspan)
                else {
                    $td = $('<td align="center" class="'+ that.classnames.td_checkbox +'"><input type="checkbox" data-toggle="icheck" name="datagrid.checkbox"></td>')
                    $tr.find('> td:eq('+ modelOrder +')').before($td)
                    $td.initui()
                }
            })
            
            $.each(model, function(i, n) {
                n.index = i
                if (n.th) n.th.data('index', i)
            })
            
            $th.find('> div').height($th.outerHeight())
            
            if (flag === 'lock') {
                that.colLock($th, true)
            }
            if (that.$showhide) {
                that.$showhide.remove()
                that.colShowhide(options.columnShowhide)
            }
        }
    }
    
    //api - showhide checkbox column
    Datagrid.prototype.showEditCol = function(flag) {
        var that = this, options = that.options, model = that.columnModel, editModel = model[model.length - 1], data = that.data
        
        if (editModel === that.editBtnsColumn) {
            that.showhideColumn(editModel.th, flag ? true : false)
        } else if (flag) {
            var $trsH = that.$thead.find('> tr'), col = '<col style="width:110px;">', $th, $td, $filterTr = $trsH.filter('.datagrid-filter'), rowspan = $trsH.length - $filterTr.length
            
            editModel = that.editBtnsColumn
            model.push(editModel)
            
            that.$colgroupH.append(col)
            that.$colgroupB.append(col)
            that.$colgroupF && that.$colgroupF.append(col)
            $th = $('<th align="center" rowspan="'+ rowspan +'">'+ that.editBtnsColumn.label +'</th>')
            $trsH.first().append($th)
            $filterTr.length && $filterTr.append('<th></th>')
            $th.initui().data('index', model.length - 1)
            editModel.th    = $th
            editModel.width = 110
            editModel.index = model.length - 1
            
            that.$tbody.find('> tr').each(function(i) {
                var $tr = $(this), colspan = that.columnModel.length
                
                if ($tr.hasClass(that.classnames.tr_child) || $tr.hasClass('datagrid-nodata'))
                    $tr.find('> td').attr('colspan', colspan)
                else {
                    $td = $('<td align="center" class="'+ that.classnames.s_edit +'">'+ BJUI.doRegional(FRAG.gridEditBtn, that.regional) +'</td>')
                    $tr.append($td)
                    $td.initui()
                }
            })
            
            that.edit(that.$tbody.find('> tr'))
            
            that.$tableF && that.$tableF.find('> thead > tr').append('<th></th>')
            
            if (that.$showhide) {
                that.$showhide.remove()
                that.colShowhide(options.columnShowhide)
            }
        }
    }
    
    //resize
    Datagrid.prototype.colResize = function() {
        var that        = this,
            tools       = that.tools,
            columnModel = that.columnModel,
            $thead      = that.$thead,
            $resizeMark = that.$grid.find('> .resizeProxy')
        
        if (!$resizeMark.length) {
            $resizeMark = $('<div class="resizeProxy" style="left:0; display:none;"></div>')
            $resizeMark.appendTo(that.$grid)
        }
        
        $thead.find('> tr > th').each(function(i) {
            var $th = $(this),  $resize = $th.find('> div > .'+ that.classnames.th_cell +'> .'+ that.classnames.th_resizemark)
            
            $resize.on('mousedown.bjui.datagrid.resize', function(e) {
                var ofLeft = that.$boxH.scrollLeft(), marginLeft = parseInt(that.$boxH.css('marginLeft') || 0, 10), left, index = $th.data('index'), model = columnModel[index], width = model.th.width()
                    , $trs = that.$tbody.find('> tr'), $lockTrs = that.$lockTbody && that.$lockTbody.find('> tr'), lockH = that.$lockTableB && that.$lockTableB.height(), H = that.$tableB.height(), lockH_new, H_new
                
                if (isNaN(marginLeft)) marginLeft = 0
                left = tools.getRight($th) - ofLeft + marginLeft
                
                that.isResize = true
                
                if (model.locked) {
                    left = tools.getRight4Lock(model.lockIndex)
                    if (model.lockWidth) width = model.lockWidth
                }
                
                $resizeMark
                    .show()
                    .css({
                        left   : left,
                        bottom : (that.$boxP ? that.$boxP.outerHeight() : 0),
                        cursor : 'col-resize'
                    })
                    .basedrag({
                        scop  : true, cellMinW:20, relObj:$resizeMark,
                        move  : 'horizontal',
                        event : e,
                        stop  : function() {
                            var new_left = $resizeMark.position().left,
                                move     = new_left - left,
                                newWidth = move + width,
                                tableW   = that.$tableH.width() + move,
                                lockW    = that.$lockTableH && that.$lockTableH.width() + move
                            
                            if (newWidth < 5) newWidth = 20
                            if (model.minWidth && newWidth < model.minWidth) newWidth = model.minWidth
                            if (newWidth != width + move) {
                                tableW   = tableW - move + (newWidth - width)
                                lockW    = lockW - move + (newWidth - width)
                            }
                            
                            model.width = newWidth
                            
                            if (model.locked) {
                                if (lockW < (that.$grid.width() * 0.75)) {
                                    model.lockWidth = newWidth
                                    that.$lockColgroupH.find('> col:eq('+ index +')').width(newWidth)
                                    that.$lockColgroupB.find('> col:eq('+ index +')').width(newWidth)
                                    that.$lockColgroupF && that.$lockColgroupF.find('> col:eq('+ index +')').width(newWidth)
                                    
                                    that.$lockTableH.width(lockW)
                                    that.$lockTableB.width(lockW)
                                    that.$lockTableF && that.$lockTableF.width(lockW)
                                    
                                    var margin = that.$lockBox.width()
                                    
                                    that.$boxH.css('margin-left', margin - 1)
                                    that.$boxB.css('margin-left', margin - 1)
                                    that.$boxH.find('> div').width(that.$boxH.width())
                                    that.$boxB.find('> div').width(that.$boxH.width())
                                    that.$boxF && that.$boxF.css('margin-left', margin - 1)
                                    
                                    that.$colgroupH.find('> col:eq('+ index +')').width(newWidth)
                                    that.$colgroupB.find('> col:eq('+ index +')').width(newWidth)
                                    that.$colgroupF && that.$colgroupF.find('> col:eq('+ index +')').width(newWidth)
                                }
                            } else {
                                setTimeout(function() {
                                    that.$colgroupH.find('> col:eq('+ index +')').width(newWidth)
                                    that.$colgroupB.find('> col:eq('+ index +')').width(newWidth)
                                    that.$colgroupF && that.$colgroupF.find('> col:eq('+ index +')').width(newWidth)
                                }, 1) //setTimeout for chrome
                            }
                            
                            /* fixed height */
                            setTimeout(function() {
                                $trs.css('height', '')
                                H_new = that.$tableB.height()
                                
                                if (that.$lockTbody) {
                                    $lockTrs.css('height', '')
                                    lockH_new = that.$lockTableB.height()
                                    if (lockH_new != lockH || H_new != H) {
                                        if (lockH_new > H_new) {
                                            $lockTrs.each(function(tr_index) {
                                                var $lockTr = $(this), $lockTd = $lockTr.find('> td:eq('+ model.lockIndex +')'), newH = $lockTd.outerHeight()
                                                
                                                if (newH > 30) {
                                                    $lockTr.height(newH)
                                                    $trs.eq(tr_index).height(newH)
                                                }
                                            })
                                        } else {
                                            $trs.each(function(tr_index) {
                                                var $tr = $(this), $td = $tr.find('> td:eq('+ index +')'), newH = $td.outerHeight()
                                                
                                                if (newH > 30) {
                                                    $tr.height(newH)
                                                    $lockTrs.eq(tr_index).height(newH)
                                                }
                                            })
                                        }
                                    }
                                    
                                    that.$lockB.height(that.$boxB[0].clientHeight)
                                }
                                
                                if (model.calc) that.$tfoot && that.$tfoot.trigger('resizeH.bjui.datagrid.tfoot')
                                
                                that.isResize = false
                            }, 10)
                            
                            $resizeMark.hide()
                            that.resizeFlag = true
                        }
                    })
            })
        })
    }
    
    //column - add menu button
    Datagrid.prototype.colMenu = function() {
        var that = this, options = that.options, tools = that.tools, regional = that.regional, $ths = that.$trsH.find('> th.'+ that.classnames.th_menu), $menu = that.$grid.find('> .'+ that.classnames.s_menu)
        
        if (!$menu.legnth) {
            $menu = $(BJUI.doRegional(FRAG.gridMenu, regional))
            $menu.hide().appendTo(that.$grid)
            that.$menu = $menu
        }
        that.colShowhide(options.columnShowhide)
        
        $ths.each(function() {
            var $th     = $(this),
                index   = $th.data('index'),
                model   = that.columnModel[index],
                $cell   = $th.find('> div > .'+ that.classnames.th_cell),
                $btnBox = $cell.find('> .'+ that.classnames.btn_menu),
                $btn
            
            if (!$btnBox.length) {
                $btn    = $('<button type="button" class="btn btn-default"><i class="fa fa-bars"></button>'),
                $btnBox = $('<div class="'+ that.classnames.btn_menu +'"></div>').append($btn)
                
                $btnBox.appendTo($cell)
                
                $btn.click(function() {
                    var $tr = $th.closest('tr'), rowspan = parseInt(($th.attr('rowspan') || 1), 10), left = $(this).offset().left - that.$grid.offset().left - 1, top = (that.$trsH.length - rowspan) * 25 + (13 * rowspan) + 11, $showhide = $menu.find('> ul > li.datagrid-li-showhide'), menu_width, submenu_width 
                    var $otherBtn = $menu.data('bjui.datagrid.menu.btn')
                    
                    if ($otherBtn && $otherBtn.length) $otherBtn.removeClass('active')
                    $(this).addClass('active')
                    if ($showhide.length && that.$showhide) {
                        that.$showhide.appendTo($showhide)
                        submenu_width = that.$showhide.data('width')
                    }
                    $menu
                        .css({position:'absolute', top:top, left:left})
                        .show()
                        .data('bjui.datagrid.menu.btn', $btn)
                        .siblings('.'+ that.classnames.s_menu).hide()
                    
                    menu_width = $menu.outerWidth()
                    
                    var position = function(left) {
                        if (that.$boxH.width() - left < menu_width) {
                            $menu.css({left:left - menu_width + 18}).addClass('position-right')
                        } else {
                            $menu.css({left:left}).removeClass('position-right')
                        }
                    }
                    var fixedLeft = function($btn) {
                        that.$boxB.scroll(function() {
                            var left = $btn.offset().left - that.$grid.offset().left - 1
                            
                            position(left)
                        })
                    }
                    
                    position(left)
                    fixedLeft($btn)
                    
                    if (options.columnFilter) that.colFilter($th)
                    else $menu.find('> ul > li.'+ that.classnames.li_filter).hide()
                    
                    tools.locking($th)
                    
                    // quick sort
                    var $asc  = $menu.find('> ul > li.'+ that.classnames.li_asc),
                        $desc = $asc.next()
                    
                    $asc.off('click.bjui.datagrid.sort').on('click.bjui.datagrid.sort', function() {
                        if (model.sortDesc)
                            model.sortDesc = false
                        else {
                            model.sortAsc  = false
                        }
                        tools.quickSort(model)
                    })
                    
                    $desc.off('click.bjui.datagrid.sort').on('click.bjui.datagrid.sort', function() {
                        if (model.sortAsc) {
                            model.sortDesc = false
                        } else {
                            model.sortAsc  = true
                        }
                        tools.quickSort(model)
                    })
                    
                    $menu.on('sort.bjui.datagrid.th', function(e, asc) {
                        $asc.toggleClass('sort-active', asc)
                        $desc.toggleClass('sort-active', !asc)
                    })
                })
            }
        })
        
        /* hide filterbox */
        that.$grid.on('click.bjui.datagrid.filter', function(e) {
            var $target = $(e.target), $menu = that.$grid.find('.'+ that.classnames.s_menu +':visible')
            
            if ($menu.length && !$target.closest('.'+ that.classnames.btn_menu).length) {
                if (!$target.closest('.'+ that.classnames.s_menu).length) {
                    $menu.hide().data('bjui.datagrid.menu.btn').removeClass('active')
                }
            }
        })
    }
    
    // show or hide columns on btn menu
    Datagrid.prototype.colShowhide = function(showFlag) {
        var that = this, options = that.options, tools = that.tools, $menu = that.$menu, $ul = $menu.find('> ul'), $showhideli = $ul.find('> li.'+ that.classnames.li_showhide)
        
        if (showFlag) {
            if (!that.$showhide) {
                tools.createShowhide()
                tools.showSubMenu($showhideli, $menu, that.$showhide)
            }
        } else {
            $showhideli.hide()
        }
    }
    
    // api - show or hide column
    Datagrid.prototype.showhideColumn = function(column, showFlag) {
        var that = this, tools = that.tools, index, model
        
        if ($.type(column) === 'number') {
            index = parseInt(column, 10)
            if (index < 0) return
        } else {
            index = column.data('index')
        }
        
        model = that.columnModel[index]
        
        if (model) {
            if (model.locked) {
                if (showFlag) return
                else that.colLock(model.th, showFlag)
            }
            tools.showhide(model, showFlag)
        }
    }
    
    // filter
    Datagrid.prototype.colFilter = function($th, filterFlag) {
        var that  = this, options = that.options, tools = that.tools, regional = that.regional, $filter = $th.data('bjui.datagrid.filter'), $menu = that.$menu, $filterli = $menu.find('> ul > li.'+ that.classnames.li_filter)
        var model = that.columnModel[$th.data('index')]
        
        if (!that.inputs || !that.inputs.length) tools.initEditInputs()
        if (model.quickfilter) {
            $filterli.show().find('.'+ that.classnames.s_filter).addClass('hide')
            
            if (!$filter || !$filter.length) {
                $filter = $(BJUI.doRegional(FRAG.gridFilter.replaceAll('#label#', $th.text()), regional)).hide().appendTo(that.$grid)
                
                var index = $th.data('index'), model = that.columnModel[index], type = model.type || 'string', operator = model.operator || [],
                    $filterA = $filter.find('span.filter-a'),
                    $filterB = $filter.find('span.filter-b'),
                    $select  = $('<select data-toggle="selectpicker" data-container="true"></select>'),
                    $input   = $(that.inputs[index]),
                    $valA, $valB
                
                $input.removeAttr('data-rule').attr('size', 10).addClass('filter-input')
                
                if (type === 'string' || type === 'findgrid' || type === 'tags') {
                    if (!operator.length) operator = ['=', '!=', 'like']
                    if (type === 'findgrid') {
                        $input.data('context', $filter)
                    }
                } else if (type === 'number' || type === 'int' || type === 'spinner') {
                    if (type === 'spinner') $input.removeAttr('data-toggle')
                    if (!operator.length) operator = ['=', '!=', '>', '<', '>=', '<=']
                } else if (type === 'date') {
                    if (!operator.length) operator = ['=', '!=']
                } else if (type === 'boolean') {
                    if (!operator.length) operator = ['=', '!=']
                    $input = $(BJUI.doRegional('<select name="'+ model.name +'" data-toggle="selectpicker"><option value="">#all#</option><option value="true">#true#</option><option value="false">#false#</option></select>', regional))
                } else if (type === 'select') {
                    if (!operator.length) operator = ['=', '!=']
                    $input.attr('data-width', '80')
                    if ($input.find('> option:first-child').val()) {
                        $input = $('<select name="'+ model.name +'" data-toggle="selectpicker" data-width="80"></select>')
                            .append(BJUI.doRegional('<option value="">#all#</option>', regional))
                            .append($input.html())
                    }
                }
                
                for (var i = 0, l = operator.length; i < l; i++) {
                    $select.append('<option value="'+ (operator[i]) +'">'+ (operator[i]) +'</option>')
                }
                
                $valA = $input
                $valB = $valA.clone()
                
                $filterA.append($select).append($input)
                $filterB.append($select.clone()).append($valB)
                
                $th.data('bjui.datagrid.filter', $filter)
                
                $filter.appendTo($filterli)
                $filter.data('width', $filter.outerWidth()).hide().initui()
                
                /* events */
                var $ok      = $filter.find('button.ok'),
                    $clear   = $filter.find('button.clear'),
                    $selects = $filter.find('select'),
                    $selA    = $selects.first(),
                    $selB    = $selects.last(),
                    $andOr   = $selects.eq(1)
                    
                $ok.click(function() {
                    var operatorA = $selA.val(), valA = $valA.val().trim(), operatorB = $selB.val(), valB = $valB.val().trim(), andor = $andOr.val()
                    var filterDatas = {}
                    
                    if (valA.length) {
                        $.extend(filterDatas, {operatorA:operatorA, valA:valA})
                    }
                    if (valB.length) {
                        if (valA.length) $.extend(filterDatas, {andor:andor})
                        $.extend(filterDatas, {operatorB:operatorB, valB:valB})
                    }
                    if (!$.isEmptyObject(filterDatas)) {
                        tools.quickFilter(that.columnModel[$th.data('index')], filterDatas)
                        that.$grid.trigger('click')
                        $filterli.trigger('hidesubmenu.bjui.datagrid.th', [$menu, $filter])
                    } else {
                        $clear.trigger('click')
                    }
                })
                
                $clear.click(function() {
                    var model = that.columnModel[$th.data('index')]
                    
                    $selects.find('> option:first').prop('selected', true)
                    $selects.selectpicker('refresh')
                    $valA.val('')
                    $valB.val('')
                    if (model.isFiltered) {
                        tools.quickFilter(model, null)
                        that.$grid.trigger('click')
                        $filterli.trigger('hidesubmenu.bjui.datagrid.th', [$menu, $filter])
                    }
                })
            }
            
            tools.showSubMenu($filterli, $menu, $filter.removeClass('hide'))
            
            $menu.find('> ul > li:not(".'+ that.classnames.li_filter +'")').on('mouseover', function() {
                if ($filterli.hasClass('active'))
                    $filterli.trigger('hidesubmenu.bjui.datagrid.th', [$menu, $filter])
            })
        } else {
            $filterli.hide()
        }
    }
    
    // paging
    Datagrid.prototype.initPaging = function() {
        var that = this, tools = that.tools, options = that.options, paging = that.paging, pr = BJUI.regional.pagination, btnpaging = FRAG.gridPaging, pageNums = [], pageCount = paging.pageCount, interval, selectPages = [], pagingHtml = BJUI.StrBuilder()
        
        interval = tools.getPageInterval(pageCount, paging.pageNum, paging.showPagenum)
        
        for (var i = interval.start; i < interval.end; i++) {
            pageNums.push(FRAG.gridPageNum.replace('#num#', i).replace('#active#', (paging.pageNum == i ? ' active' : '')))
        }
        
        btnpaging = BJUI.doRegional(btnpaging.replaceAll('#pageNum#', paging.pageNum).replaceAll('#count#', paging.total +'/'+ parseInt((pageCount || 0), 10)), pr)
        
        pagingHtml
            .add('<div class="paging-content" style="width:'+ that.$boxB.width() +'px;">')
            .add('<span></span><div class="paging-pagesize"><button type="button" class="btn-default btn-refresh" title="'+ pr.refresh +'" data-icon="refresh"></button>')
            .add('<select data-toggle="selectpicker" style="display: none;" class="pageSelect"></select>')
            .add('</div>')
            .add('<div class="paging-box">')
            .add(btnpaging.replace('#pageNumFrag#', pageNums.join('')))
            .add('</div>')
            .add('</div>')
        
        that.$boxP.html(pagingHtml.toString())
        that.$boxP.initui()
        
        //events
        var $select    = that.$boxP.find('div.paging-pagesize > select'),
            $pagenum   = that.$boxP.find('ul.pagination'),
            $pagetotal = $pagenum.find('> li.page-total'),
            $jumpto    = $pagetotal.next(),
            $first     = $jumpto.next(),
            $prev      = $first.next(),
            $next      = $prev.nextAll('.page-next'),
            $last      = $next.next()
        
        var disablePrev = function() {
            $first.addClass('disabled')
            $prev.addClass('disabled')
        }
        var enablePrev = function() {
            $first.removeClass('disabled')
            $prev.removeClass('disabled')
        }
        var disableNext = function() {
            $next.addClass('disabled')
            $last.addClass('disabled')
        }
        var enableNext = function() {
            $next.removeClass('disabled')
            $last.removeClass('disabled')
        }
        var pageFirst = function() {
            disablePrev()
            enableNext()
        }
        var pageLast = function() {
            enablePrev()
            disableNext()
        }
        var setPageSize = function(pageSize) {
            $select= that.$boxP.find('.paging-pagesize').find('select');
            $select.empty()
            
            if (!pageSize) pageSize = that.paging.pageSize
            
            selectPages = paging.selectPageSize.split(',')
            selectPages.push(String(pageSize))
            
            $.unique(selectPages).sort(function(a, b) { return a - b })
            
            var opts = []
            $.each(selectPages, function(i, n) {
                opts.push('<option value="'+ n +'"'+ (n == paging.pageSize && 'selected') +'>'+ n +'/'+ pr.page +'</option>')
            })
            $select.html(opts.join('')).selectpicker('refresh')
        }
        
        if (paging.pageNum == 1) pageFirst()
        if (paging.pageNum == paging.pageCount) {
            pageLast()
            if (paging.pageNum == 1) disablePrev()
        }
        if (!paging.total) disableNext()
        setPageSize()
        
        that.$boxP.on('click.datagrid.pagenum', 'li.page-num', function(e) {
            var $num = $(this)
            
            if (!$num.hasClass('active')) {
                that.jumpPage($num.text())
            }
            
            e.preventDefault()
        }).on('click.datagrid.refresh', 'button.btn-refresh', function() {
            that.refresh()
        }).on('bjui.datagrid.paging.jump', function(e) {
            var pageNum = that.paging.pageNum, interval = tools.getPageInterval(that.paging.pageCount, pageNum, paging.showPagenum), pageNums = []
            
            for (var i = interval.start; i < interval.end; i++) {
                pageNums.push(FRAG.gridPageNum.replace('#num#', i).replace('#active#', (pageNum == i ? ' active' : '')))
            }
            
            $pagenum.find('> li.page-num').remove()
            $prev.after(pageNums.join(''))
            
            if (pageNum == 1) {
                pageFirst()
                if (pageNum == that.paging.pageCount) disableNext()
                if (!that.paging.total) disableNext()
            } else if (pageNum == that.paging.pageCount) {
                pageLast()
            } else {
                enablePrev()
                enableNext()
            }
            
            $jumpto.find('input').val(pageNum)
            $pagetotal.find('> span').html(that.paging.total +'/'+ that.paging.pageCount)
        }).on('bjui.datagrid.paging.pageSize', function(e, pageSize) {
            setPageSize(pageSize)
        }).on('change', 'div.paging-pagesize > select', function() {
            var pageSize = $(this).val()
            
            that.jumpPage(null, pageSize)
        })
        
        $jumpto.find('input').on('keyup', function(e) {
            if (e.which === BJUI.keyCode.ENTER) {
                var page = $(this).val()
                
                if (page) that.jumpPage(page)
            }
        })
        
        $first.on('click', function() {
            if (that.paging.pageNum > 1)
                that.jumpPage(1)
        })
        
        $prev.on('click', function() {
            if (that.paging.pageNum > 1)
                that.jumpPage(that.paging.pageNum - 1)
        })
        
        $next.on('click', function() {
            if (that.paging.pageNum < that.paging.pageCount)
                that.jumpPage(that.paging.pageNum + 1)
        })
        
        $last.on('click', function() {
            if (that.paging.pageNum < that.paging.pageCount)
                that.jumpPage(that.paging.pageCount)
        })
    }
    
    Datagrid.prototype.jumpPage = function(pageNum, pageSize) {
        var that = this, paging = that.paging, pageCount = paging.pageCount
        
        if (pageNum && isNaN(pageNum)) return
        if (pageSize && isNaN(pageSize))       return
        if (pageNum) {
            pageNum = parseInt(pageNum, 10)
            
            if (pageNum < 1)         pageNum = 1
            if (pageNum > pageCount) pageNum = pageCount
            if (pageNum == paging.pageNum) return
        }
        if (pageSize) {
            pageSize = parseInt(pageSize, 10)
            
            if (that.options.local != 'remote') {
                if (paging.pageSize > paging.total) return
            }
        }
        
        that.tools.jumpPage(pageNum, pageSize)
    }
    
    // api - add
    Datagrid.prototype.add = function(addLocation, addData, noEdit) {
        if (!this.tools.beforeEdit() && !noEdit) return
        
        if (!this.options.editUrl && !noEdit) {
            BJUI.debug('BJUI.Datagrid: Edit url is not set!')
            return
        }
        
        if (!this.options.editMode && !noEdit) return
        if (!this.options.inlineEditMult) {
            this.doCancelEditRow(this.$tbody.find('> tr.'+ this.classnames.tr_edit))
        } else if (!noEdit && this.options.editMode != 'inline' && this.$tbody.find('> tr.'+ this.classnames.tr_add).length) {
            return
        }
        
        if (!addData) {
            addData = {}
        } else {
            if (typeof addData === 'string') {
                addData = addData.toObj()
            }
            if (typeof addData !== 'object') {
                addData = {}
            }
        }
        
        var that = this, options = that.options, keys = options.keys, tools = that.tools, paging = that.paging, trs, obj = {}, data = [], addObj, startNumber = (paging.pageNum - 1) * paging.pageSize, linenumber
        
        var addTr = function() {
            var $tr = $('<tr></tr>').addClass(that.classnames.tr_add), $lockTr = $tr.clone()
            
            if (that.isTemplate) {
                var tdTemplate = options.tdTemplate, tempcolspan = that.columnModel.length
                
                if (typeof tdTemplate === 'function')
                    tdTemplate = tdTemplate.apply(that, [{}])
                
                if (that.options.hasChild && that.options.childOptions) {
                    $tr.append('<td data-title="..." align="center" class="datagrid-child-td"><div>'+ BJUI.doRegional(FRAG.gridExpandBtn, that.regional) +'</div></td>')
                    tempcolspan --
                }
                if (that.options.showLinenumber) {
                    $tr.append('<td data-title="No." align="center" class="datagrid-linenumber-td">0</td>')
                    tempcolspan --
                }
                if (that.options.showCheckboxcol) {
                    $tr.append('<td data-title="Checkbox" align="center" class="datagrid-checkbox-td"><div><input type="checkbox" data-toggle="icheck" name="datagrid.checkbox" value="true"></div></td>')
                    tempcolspan --
                }
                
                $tr.append('<td class="datagrid-template-td" colspan="'+ tempcolspan +'">'+ tdTemplate +'</td>')
            } else {
                $.each(that.columnModel, function(i, n) {
                    var label = '', $td = $('<td></td>')
                    
                    if (n[keys.gridChild])
                        $td.addClass(that.classnames.td_child).html('<div>'+ BJUI.doRegional(FRAG.gridExpandBtn, that.regional) +'</div>')
                    else if (n[keys.gridNumber])
                        $td.addClass(that.classnames.td_linenumber).text(0)
                    else if (n[keys.gridCheckbox])
                        $td.addClass(that.classnames.td_checkbox).html('<div><input type="checkbox" data-toggle="icheck" name="datagrid.checkbox" value="true"></div>')
                    else if (n[keys.gridEdit])
                        $td.addClass(that.classnames.s_edit).data('isAdd', true).html(BJUI.doRegional(FRAG.gridEditBtn, that.regional))
                    else $td.text('')
                    
                    if (n.hidden) $td.css('display', 'none')
                    if (n.align)  $td.attr('align', n.align)
                    
                    if (n.name) obj[n.name] = ''
                    
                    if (n.locked) {
                        if (n[keys.gridCheckbox]) {
                            $td.clone().hide().appendTo($tr)
                            $td.show().appendTo($lockTr)
                        } else {
                            $td.clone().show().appendTo($lockTr)
                            $td.hide().appendTo($tr)
                        }
                    } else {
                        $td.appendTo($tr)
                    }
                })
            }
            
            obj = $.extend({}, that.attach, obj)
            if (!that.emptyData) that.emptyData = obj
            
            return {tr:$tr, lockTr:$lockTr.find('> td').length ? $lockTr : null}
        }
        
        if (!addLocation) addLocation = options.addLocation || 'first'
        if (!that.$lastSelect) {
            if (addLocation === 'prev') addLocation = 'first'
            else if (addLocation === 'next') addLocation = 'last'
        }
        if ($.inArray(addLocation, ['first', 'last', 'prev', 'next']) === -1)
            addLocation = 'first'
        
        if (options.isTree && that.$lastSelect) {
            if (!(addLocation === 'first' || addLocation === 'last'))
                addLocation = 'first'
            
            var parentData = that.data[that.tools.getNoChildDataIndex(that.$lastSelect.index())]
            
            if (parentData) {
                addData[options.treeOptions.keys.level]     = parentData[options.treeOptions.keys.level] + 1
                addData[options.treeOptions.keys.parentKey] = parentData[options.treeOptions.keys.key]
                addData[options.keys.treePTr]               = that.$lastSelect
                addData[options.keys.treePData]             = parentData
            } else {
                addData['level'] = 0
            }
        }
        
        if (addLocation === 'first') {
            linenumber = 0
            trs = addTr()
            
            if (options.isTree && that.$lastSelect) {
                linenumber = that.tools.getNoChildDataIndex(that.$lastSelect.index()) + 1
                
                if (that.$lastSelect.next().hasClass(that.classnames.tr_child)) {
                    trs.tr.insertAfter(that.$lastSelect.next())
                    if (trs.lockTr) trs.lockTr.insertAfter(that.$lockTbody.find('> tr:eq('+ that.$lastSelect.next().index() +')'))
                } else {
                    trs.tr.insertAfter(that.$lastSelect)
                    if (trs.lockTr) trs.lockTr.insertAfter(that.$lockTbody.find('> tr:eq('+ that.$lastSelect.index() +')'))
                }
            } else {
                trs.tr.prependTo(that.$tbody)
                if (trs.lockTr) trs.lockTr.prependTo(that.$lockTbody)
            }
        } else if (addLocation === 'last') {
            linenumber = that.$tbody.find('> tr').length
            trs = addTr()
            
            if (options.isTree && that.$lastSelect) {
                var child = that.$lastSelect.data('child') || 0, level = that.$lastSelect.data('level'), $lastTr, hasChild = that.$lastSelect.next().hasClass(that.classnames.tr_child)
                
                $lastTr = that.getChildrens(that.$lastSelect, that.$lastSelect).last()
                
                if (hasChild) {
                    trs.tr.insertAfter($lastTr.next())
                    if (trs.lockTr) trs.lockTr.insertAfter(that.$lockTbody.find('> tr:eq('+ $lastTr.next().index() +')'))
                } else {
                    trs.tr.insertAfter($lastTr)
                    if (trs.lockTr) trs.lockTr.insertAfter(that.$lockTbody.find('> tr:eq('+ $lastTr.index() +')'))
                }
                
                linenumber = that.tools.getNoChildDataIndex($lastTr.index()) + 1
                
                addData[options.treeOptions.keys.order] = child
            } else {
                trs.tr.appendTo(that.$tbody)
                if (trs.lockTr) trs.lockTr.appendTo(that.$lockTbody)
            }
        } else if (addLocation === 'prev') {
            linenumber = that.tools.getNoChildDataIndex(that.$lastSelect.index())
            trs = addTr()
            
            trs.tr.insertBefore(that.$lastSelect)
            if (trs.lockTr) trs.lockTr.insertBefore(that.$lockTbody.find('> tr:eq('+ that.$lastSelect.index() +')'))
        } else if (addLocation === 'next') {
            linenumber = that.tools.getNoChildDataIndex(that.$lastSelect.index()) + 1
            trs = addTr()
            
            if (that.$lastSelect.next().hasClass(that.classnames.tr_child)) {
                trs.tr.insertAfter(that.$lastSelect.next())
                if (trs.lockTr) trs.lockTr.insertAfter(that.$lockTbody.find('> tr:eq('+ that.$lastSelect.next().index() +')'))
            } else {
                trs.tr.insertAfter(that.$lastSelect)
                if (trs.lockTr) trs.lockTr.insertAfter(that.$lockTbody.find('> tr:eq('+ that.$lastSelect.index() +')'))
            }
        }
        
        addData = $.extend({}, that.emptyData, addData, {addFlag:true})
        
        if (!that.data) that.data = []
        if (!that.allData) that.allData = []
        if (that.allData.length) {
            that.allData.splice(linenumber + startNumber, 0, addData)
        } else {
            that.allData.push(addData)
        }
        
        if (that.data.length) {
            that.data.splice(linenumber, 0, addData)
        } else {
            that.data.push(addData)
        }
        
        that.tools.updateGridIndex()
        
        trs.tr.initui()
        trs.lockTr && trs.lockTr.initui()
        
        if (addData[options.keys.treePTr])
            trs.tr.data(options.keys.treePTr, addData[options.keys.treePTr])
        if (options.showNoDataTip)
            that.$tbody.find('> tr.datagrid-nodata').remove()
        if (options.height === 'auto')
            that.fixedHeight()
        
        setTimeout(function() {
            that.initEvents(trs.tr)
        }, 20)
        
        if (trs.lockTr) that.initLockEvents(trs.lockTr)
        that.edit(trs.tr)
        
        if (options.hasChild && options.childOptions)
            trs.tr.after('<tr class="'+ that.classnames.tr_child +'"></tr>')
        
        if (noEdit) {
            that.inlineEditComplete(trs.tr, addData)
            if (that.data.length == 1)
                that.needfixedWidth = true
            that.tools.afterSave(trs.tr, addData)
        } else {
            if (options.editMode != 'dialog') {
                that.doEditRow(trs.tr, 'inline', true)
            } else {
                that.dialogEdit(trs.tr, true)
            }
        }
    }
    
    // edit
    Datagrid.prototype.edit = function($trs) {
        var that = this, options = that.options, tools = that.tools, type = options.editMode, columnModel = that.columnModel, $editTd
        
        that.editInit = false
        
        if (!type) return
        if (typeof type === 'object') {
            var editOptions = {}, types = ['dialog', 'navtab', 'div'], editFlag = false
            
            that.editOptions = null
            
            for (var key in type) {
                if ($.inArray(key, types) != -1) {
                    editOptions.type    = key
                    editOptions.options = type[key]
                    
                    editFlag = true
                    
                    break
                }
            }
            
            if (!editFlag) {
                BJUI.debug('Dialog Plugn: The options \'editModel\' set error!')
                return
            }
            
            if (!$.isEmptyObject(editOptions))
                that.editOptions = editOptions
            
        } else {
            if (that.options.editUrl)
                that.options.editUrl = that.options.editUrl.replace(/{\/?[^}]*}/g, '')
            
            if (type != 'dialog')
                type = 'inline'
        }
        
        if (!$trs) $trs = that.$tbody.find('> tr')
        
        $editTd = $trs.find('> td.'+ that.classnames.s_edit)
        
        that.editInit = true
        
        /* events */
        $editTd.each(function() {
            var $td = $(this), $btns = $td.find('button.bjui-datagrid-btn'), $edit = $btns.first(), $update = $edit.next(), $save = $update.next(), $cancel = $save.next(), $delete = $cancel.next()
            
            $edit.on('click', function(e, data) {
                var $btn = $(this), $tr = $btn.closest('tr'), data_index = $tr.index(), isAdd = $td.data('isAdd')
                
                data_index = that.tools.getNoChildDataIndex(data_index)
                
                if (!data) {
                    if (that.isDom) data = $tr.data('initData') || tools.setDomData($tr)
                    else data = that.data[data_index]
                }
                if (!tools.beforeEdit($tr, data)) {
                    return false
                }
                if (that.editOptions) {
                    that.externalEdit($tr, null, data)
                    return false
                }
                if (type != 'dialog') {
                    that.inlineEdit($tr, isAdd)
                    
                    $btns.hide()
                    $update.show()
                    $cancel.show()
                    
                    if (isAdd) {
                        $update.hide()
                        $save.show()
                    }
                } else {
                    that.dialogEdit($tr, isAdd)
                }
                
                e.stopPropagation()
            })
            
            $save.on('click', function(e) {
                var $btn = $(this), $tr = $btn.closest('tr')
                
                that.updateEdit($tr, $btn)
                
                e.stopPropagation()
            }).on('bjui.datagrid.update.tr', function() {
                $btns.hide()
                $edit.show()
                $delete.show()
            })
            
            $update.on('click', function(e) {
                var $btn = $(this), $tr = $btn.closest('tr')
                
                that.updateEdit($tr, $btn)
                
                e.stopPropagation()
            }).on('bjui.datagrid.update.tr', function() {
                $btns.hide()
                $edit.show()
                $delete.show()
            })
            
            $cancel.on('click', function(e) {
                var $btn = $(this), $tr = $btn.closest('tr')
                
                that.cancelEdit($tr)
                
                $btns.hide()
                $edit.show()
                $delete.show()
                
                e.stopPropagation()
            })
            
            $delete.on('click', function(e) {
                var $btn = $(this), $tr = $btn.closest('tr')
                
                that.delRows($tr)
                
                e.stopPropagation()
            })
        })
    }
    
    Datagrid.prototype.externalEdit = function(row, editOpts, data) {
        var that = this, options = that.options, editOptions = {}, $tr, data_index, editUrl, type, types = ['dialog', 'navtab', 'div']
        
        if (editOpts && typeof editOpts === 'object') {
            for (var key in editOpts) {
                if ($.inArray(key, types) != -1) {
                    editOptions.type    = key
                    editOptions.options = editOpts[key]
                    
                    break
                }
            }
        } else
            editOptions = $.extend({}, that.editOptions) 
        
        if (row instanceof jQuery) {
            $tr = row
        } else if (!isNaN(row)) {
            $tr = that.$tbody.find('> tr:not(.'+ that.classnames.tr_child +')').eq(parseInt(row, 10))
        } else {
            BJUI.debug('BJUI.Datagrid: Func \'externalEdit\', Parameter \'row\' is incorrect!')
            return
        }
        
        if (typeof editOptions === 'undefined') {
            BJUI.debug('BJUI.Datagrid: Func \'externalEdit\', Parameter \'editOptions\' is incorrect!')
            return
        }
        
        if (!$.isEmptyObject(editOptions)) {
            if (!data) {
                if (that.isDom) data = $tr.data('initData') || that.tools.setDomData($tr)
                else {
                    data_index = that.tools.getNoChildDataIndex($tr.index())
                    data = that.data[data_index]
                }
            }
            if (!editOptions.options.url || editOptions.options['datagrid.nourl']) {
                editOptions.options['datagrid.nourl'] = true
                editOptions.options.url = options.editUrl
            }
            
            editUrl = editOptions.options.url
            
            if (editUrl && !editUrl.isFinishedTm()) {
                if (!data || data.addFlag)
                    editUrl = editUrl.replace(/{\/?[^}]*}/g, '')
                else
                    editUrl = that.tools.replacePlh(editUrl, data)
                
                if (!editUrl.isFinishedTm()) {
                    BJUI.debug('BJUI.Datagrid: Func \'externalEdit\', the property \'url\' of options \'editOptions\' is incorrect: '+ editUrl)
                } else {
                    editUrl = editUrl
                }
            }
            
            if (editUrl) {
                editOptions.options.url = editUrl
                type = editOptions.type
                
                if (typeof data === 'object' && data) {
                    if (editOptions.options.data)
                        $.extend(editOptions.options.data, data)
                    else
                        editOptions.options.data = $.extend({}, data)
                }
                
                for (var key in options.keys)
                    delete editOptions.options.data[key]
                
                if (!editOptions.options.id)
                    editOptions.options.id = 'datagrid-external-edit'+ (new Date().getTime())
                if (!editOptions.options.type)
                    editOptions.options.type = options.editType
                
                // onClose
                if (typeof options.extOnClose === 'undefined') {
                    options.extOnClose = (editOptions.options.onClose && editOptions.options.onClose.toFunc()) || false
                }
                // for dialog && navtab (if not save)
                editOptions.options.onClose = function() {
                    if ($tr.hasClass(that.classnames.tr_add))
                        that.cancelEdit($tr)
                    
                    if (typeof options.extOnClose !== 'undefined') {
                        if (options.extOnClose) {
                            options.extOnClose.apply(that)
                        }
                    }
                }
                
                var okCallback = function(json) {
                    var complete = false, returnData, fixedWidth = false
                    
                    if (editOptions.options.data['addFlag'] && that.data.length == 1)
                        that.needfixedWidth = true
                    if ($.type(json) === 'array') {
                        complete   = true
                        returnData = json[0]
                    } else if (typeof json === 'object') {
                        complete = true
                        returnData = json
                    }
                    
                    if (complete) {
                        $.extend(data, typeof returnData === 'object' && returnData)
                        
                        if (that.allData && that.allData[data.gridIndex]) {
                            $.extend(that.allData[data.gridIndex], data)
                        }
                        
                        // update allData for filter
                        if (that.oldAllData) that.oldAllData = that.allData.concat()
                        
                        if (data.addFlag) data.addFlag = false
                        
                        that.dialogEditComplete($tr, data)
                        
                        if (type === 'dialog') {
                            if (editOptions.options.message)
                                BJUI.alertmsg('ok', editOptions.options.message)
                            if (typeof editOptions.options.closeCurrent === 'undefined' || editOptions.options.closeCurrent)
                                BJUI.dialog('close', editOptions.options.id)
                        }
                        else if (type === 'navtab')
                            BJUI.navtab('closeTab', editOptions.options.id)
                            
                        that.tools.afterSave($tr, data)
                        
                        // refresh child
                        if (data['refresh.datagrid.child']) {
                            var $child = $tr.data('bjui.datagrid.child')
                            
                            if ($child && $child.length)
                                $child.datagrid('refresh')
                            else
                                that.showChild($tr)
                        }
                    }
                }
                
                editOptions.options.onLoad = function($box) {
                    var $form = $box.find('form.datagrid-edit-form')
                    
                    if ($form && $form.length) {
                        $form = $form.first()
                        
                        $form
                            .removeAttr('okCallback')
                            .data('okCallback', $.proxy(okCallback, that))
                    }
                }
                
                if (type === 'dialog')
                    BJUI.dialog(editOptions.options)
                else if (type === 'navtab')
                    BJUI.navtab(editOptions.options)
                else if (type === 'div')
                    BJUI.ajax('doload', editOptions.options)
                
            }
        }
    }
    
    // Api - inline edit tr
    Datagrid.prototype.doEditRow = function(rows, type, isAdd) {
        if (!this.editInit) return
        
        var that = this, $trs, $editBtn, datas = []
        
        type = type || that.options.editMode
        
        if (typeof rows === 'object') {
            $trs = rows
        } else if (isNaN(rows)) {
            var $myTrs = that.$tbody.find('> tr:not(.'+ that.classnames.tr_child +')'), $editTrs, rows = rows.split(',')
            
            rows = rows.unique()
            rows.sort(function(a, b) {return a.trim() - b.trim()})
            
            $.each(rows, function(i, n) {
                var row = parseInt(n.trim(), 10), tr
                
                tr = $myTrs.eq(row)
                
                if (tr && tr.length) {
                    if (!$editTrs) $editTrs = tr
                    else $editTrs = $editTrs.add(tr)
                }
            })
            
            $trs = $editTrs
        } else if (!isNaN(rows)) {
            $trs = that.$tbody.find('> tr:not(.'+ that.classnames.tr_child +')').eq(rows)
        }
        
        if (!$trs.length) return
        
        $trs.each(function() {
            var $tr = $(this), data_index = $tr.index(), data
            
            data_index = that.tools.getNoChildDataIndex(data_index)
            
            if (that.isDom) data = $tr.data('initData') || tools.setDomData($tr)
            else data = that.data[data_index]
            
            datas.push(data)
        })
        
        if (!that.tools.beforeEdit($trs, datas)) {
            return
        }
        
        if (!that.options.editUrl) {
            BJUI.debug('BJUI.Datagrid: Edit url is not set!')
            return
        }
        
        if (that.editOptions) {
            that.externalEdit($trs.last(), null, datas[$trs.length - 1])
        } else {
            $trs.each(function(i) {
                var $tr = $(this)
                
                $editBtn = $tr.find('> td.'+ that.classnames.s_edit +' button.bjui-datagrid-btn.edit')
                
                if (type != 'dialog') {
                    if ($editBtn.length) $editBtn.trigger('click', [datas[i]])
                    else that.inlineEdit($tr, isAdd, datas[i])
                } else {
                    that.dialogEdit($tr, isAdd, datas[i])
                    return false
                }
            })
        }
    }
    
    // Api - cancel edit
    Datagrid.prototype.doCancelEditRow = function(row) {
        var that = this, $trs
        
        if ($.type(row) === 'number') {
            $trs = this.$tbody.find('> tr').eq(row)
        } else {
            $trs = row
        }
        
        $trs.each(function() {
            var $tr = $(this), $cancelBtn = $tr.find('> td.'+ that.classnames.s_edit +' > button.bjui-datagrid-btn.cancel')
            
            if ($cancelBtn.length) {
                $cancelBtn.trigger('click')
            } else {
                that.cancelEdit($tr)
            }
        })
    }
    
    // Api - save edit tr
    Datagrid.prototype.doSaveEditRow = function(row) {
        var that = this, options = that.options, $tr
        
        if ($.type(row) === 'number') {
            $tr = this.$tbody.find('> tr').eq(row)
        } else if (row) {
            $tr = row
        } else {
            $tr = that.$tbody.find('> tr.'+ that.classnames.tr_edit)
        }
        
        if (!$tr.length) {
            that.$grid.alertmsg('info', BJUI.getRegional('datagrid.saveMsg'))
            return
        }
        if ($tr.length == 1) {
            if ($tr.hasClass(that.classnames.tr_edit))
                this.updateEdit($tr)
        } else {
            if (options.saveAll) {
                that.saveAll($tr)
            } else {
                $tr.each(function() {
                    that.updateEdit($(this))
                })
            }
        }
    }
    
    // Api - del tr
    Datagrid.prototype.delRows = function(rows) {
        var that  = this, options = that.options, keys = options.keys, beforeDelete = options.beforeDelete, confirmMsg = options.delConfirm, $trs
        
        if (beforeDelete) {
            if (typeof beforeDelete === 'string') beforeDelete = beforeDelete.toFunc()
            if (typeof beforeDelete === 'function') {
                if (!beforeDelete.call(this)) {
                    return
                }
            }
        }
        
        if (typeof rows === 'object') {
            $trs = rows
        } else if (isNaN(rows)) {
            var $myTrs = that.$tbody.find('> tr:not(.'+ that.classnames.tr_child +')'), $delTrs, rows = rows.split(',')
            
            rows = rows.unique()
            rows.sort(function(a, b) {return a.trim() - b.trim()})
            
            $.each(rows, function(i, n) {
                var tr = $myTrs.eq(parseInt(n.trim(), 10))
                
                if (tr && tr.length) {
                    if (!$delTrs) $delTrs = tr
                    else $delTrs = $delTrs.add(tr)
                }
            })
            
            $trs = $delTrs
        } else if (!isNaN(rows)) {
            $trs = this.$tbody.find('> tr:not(.'+ that.classnames.tr_child +')').eq(rows)
        }
        
        if (!$trs || !$trs.length) return
        
        var delEnd = function() {
            $trs.each(function() {
                var $tr = $(this), childUpdate = that.options.childUpdate, $parent = that.$element.data('bjui.datagrid.parent'),
                    updateParent = function($parent) {
                        $parent.closest('table').datagrid('updateRow', $parent)
                    }
                // update child parent
                if ($parent && childUpdate) {
                    if (typeof childUpdate === 'string') {
                        if (childUpdate.indexOf('all') !== -1 || childUpdate.indexOf('del') !== -1)
                            updateParent($parent)
                    } else {
                        updateParent($parent)
                    }
                }
                
                $tr.trigger('delete.bjui.datagrid.tr')
            })
            
            that.tools.afterDelete()
            
            if (options.height === 'auto')
                that.fixedHeight()
        }
        
        var doDel = function() {
            var $addTrs = $trs.filter('.'+ that.classnames.tr_add)
            
            if ($addTrs.length) {
                that.cancelEdit($addTrs)
                
                if (!$trs.not($addTrs).length)
                    return
            }
            
            // remote delete
            if (options.delUrl) {
                var postData = [], callback = options.delCallback
                
                $trs.not($addTrs).each(function() {
                    var $tr = $(this), index = $tr.index(), data, delData
                    
                    if (that.isDom) data = $tr.data('initData') || that.tools.setDomData($tr)
                    else data = that.data[that.tools.getNoChildDataIndex(index)]
                    
                    if (options.delPK) {
                        postData.push(data[options.delPK])
                    } else {
                        if (options.jsonPrefix) {
                            delData = {}
                            
                            $.each(data, function(name, value) {
                                if (!that.tools.isGridData(name))
                                    delData[options.jsonPrefix +'.'+ name] = value
                            })
                        } else {
                            delData = $.extend({}, data)
                            for (var key in keys)
                                delete delData[keys[key]]
                        }
                        
                        postData.push(delData)
                    }
                })
                
                if (typeof callback === 'string') callback = callback.toFunc()
                
                var type = options.delType, opts = {url:options.delUrl, data:(options.delPK ? [{ name:options.delPK, value:postData.join(',') }] : JSON.stringify(postData)), type:'POST', okCallback:callback || function(json) { delEnd() }}
                
                if (type && type === 'raw' && !options.delPK) {
                    opts.contentType = 'application/json'
                } else {
                    !options.delPK && (opts.data = {json:opts.data})
                    type && type !== 'raw' && (opts.type = type)
                }
                
                BJUI.ajax('doajax', opts)
            } else { // local delete
                delEnd()
            }
        }
        
        if (confirmMsg) {
            if (typeof confirmMsg !== 'string') confirmMsg = $trs.length == 1 ? BJUI.getRegional('datagrid.delMsg') : BJUI.getRegional('datagrid.delMsgM')
            
            that.$grid.alertmsg('confirm', confirmMsg, {
                okCall:function() {
                    doDel()
                }
            })
        } else {
            doDel()
        }
    }
    
    // inline edit
    Datagrid.prototype.inlineEdit = function($tr, isAdd, data) {
        if (!this.tools.beforeEdit($tr, data)) {
            return false
        }
        
        var that = this, options = that.options, tools = that.tools, columnModel = that.columnModel, $tds = $tr.find('> td'), tds_length = $tds.length, tr_index = $tr.index(), data_index = tr_index
        
        data_index = tools.getNoChildDataIndex(data_index)
        
        if (!data) {
            if (that.isDom) data = $tr.data('initData') || tools.setDomData($tr)
            else data = that.data[data_index]
        }
        
        if ($tr.hasClass(that.classnames.tr_edit)) return false
        if (!that.inputs || !that.inputs.length) tools.initEditInputs()
        
        $tr.addClass(that.classnames.tr_edit).data(that.datanames.changeData, {})
        if ($tr.data('validator')) $tr.validator('destroy') //remove old validate
        
        if (!options.inlineEditMult) {
            that.doCancelEditRow($tr.siblings('.'+ that.classnames.tr_edit))
        }
        
        that.$lastEditTr = $tr
        
        $tds.each(function(i) {
            var $td = $(this), op = columnModel[i], val = op && op.name && data[op.name], html = $td.html(), input = that.inputs[i], $input
            var onChange = function($el, $td, val) {
                var changeData = $tr.data(that.datanames.changeData), jsontype = op.jsontype, defaultVal = (typeof op.defaultVal === 'undefined') ? null : op.defaultVal
                
                switch (op.type) {
                case 'date':
                    $el
                        .change(function() {
                            $td.addClass(that.classnames.td_changed)
                            if ($el.val() == val) $td.removeClass(that.classnames.td_changed)
                            changeData[op.name] = $el.val()
                        })
                    
                    break
                case 'select':
                    $el.change(function() {
                        var value = $(this).val()
                        
                        $td.addClass(that.classnames.td_changed)
                        
                        if (value == String(val)) $td.removeClass(that.classnames.td_changed)
                        
                        if ($el.prop('multiple')) {
                            $.isArray(value) && (value = value.join(','))
                        } else if (jsontype) {
                            if (jsontype === 'boolean') {
                                value = Boolean(value)
                            } else if (jsontype === 'number') {
                                if (value.length)
                                    !isNaN(Number(value)) && (value = Number(value))
                                else
                                    value = null
                            }
                        }
                        
                        changeData[op.name] = value
                    })
                    
                    break
                case 'boolean':
                    $el.on('ifChanged', function() {
                        $td.toggleClass(that.classnames.td_changed)
                        
                        var checked = $(this).is(':checked')
                        
                        if (checked == val)
                            $td.removeClass(that.classnames.td_changed)
                        
                        changeData[op.name] = checked
                    })
                    
                    break
                case 'findgrid':
                    changeData[op.name] = $el.val()
                    
                    $el.change(function() {
                        var value = $(this).val()
                        
                        $td.addClass(that.classnames.td_changed)
                        
                        if (value == val)
                            $td.removeClass(that.classnames.td_changed)
                        if (jsontype && jsontype === 'number') {
                            if (value.length)
                                !isNaN(Number(value)) && (value = Number(value))
                            else
                                value = null
                        }
                        
                        changeData[op.name] = value
                    })
                    
                    $td.off('afterchange.bjui.findgrid').on('afterchange.bjui.findgrid', '[data-toggle="findgrid"]', function(e, data) {
                        var include = op.attrs && op.attrs['data-options'] && op.attrs['data-options']['include']
                        
                        if (include) {
                            $.each(include.split(','), function(i, n) {
                                var obj = n.trim().split(':'), name = obj[0], key = obj.length > 1 ? obj[1] : obj[0]
                                
                                data['data'] && (changeData[name] = data['data'][key])
                            })
                        }
                    })
                    
                    break
                case 'spinner':
                    $el.change(function() {
                        $td.addClass(that.classnames.td_changed)
                        if ($el.val() == val) $td.removeClass(that.classnames.td_changed)
                        changeData[op.name] = Number($el.val())
                    })
                    
                    break
                default:
                    $el.change(function() {
                        var value = $(this).val()
                        
                        $td.addClass(that.classnames.td_changed)
                        
                        if (value == val)
                            $td.removeClass(that.classnames.td_changed)
                        if (jsontype && jsontype === 'number') {
                            if (value.length)
                                !isNaN(Number(value)) && (value = Number(value))
                            else
                                value = null
                        }
                        
                        changeData[op.name] = value
                    })
                    
                    break
                }
                
                if (isAdd) {
                    if (op.type === 'boolean') {
                        defaultVal = Boolean(defaultVal)
                        changeData[op.name] = defaultVal
                        $el.prop('checked', defaultVal)
                    } else {
                        if (defaultVal != null) {
                            if ($el.isTag('select') && $el.prop('multiple')) {
                                $el.val($.isArray(defaultVal) ? defaultVal : defaultVal.split(','))
                            } else {
                                $el.val(String(defaultVal))
                            }
                            if (jsontype) {
                                if (jsontype === 'number') {
                                    if (defaultVal.length)
                                        !isNaN(Number(defaultVal)) && (defaultVal = Number(defaultVal))
                                    else
                                        defaultVal = null
                                }
                                else if (jsontype === 'boolean')
                                    defaultVal = Boolean(defaultVal)
                            }
                            
                            changeData[op.name] = defaultVal
                        } else {
                            if (($el.isTag('select') && !$el.prop('multiple'))) {
                                var $clone = $el.clone().appendTo('body'), val = $clone.val()
                                
                                changeData[op.name] = val
                                $clone.remove()
                            }
                        }
                    }
                } else if (jsontype) {
                    $el.trigger('change')
                }
            }
            
            $td.data(that.datanames.td_html, html)
            
            if (isAdd) {
                if (!op.add) input = ''
            } else {
                if (data.addFlag) data.addFlag = false
                if (!op.edit) input = ''
            }
            
            if (input) {
                $input = $(input)
                
                if (typeof val === 'undefined' || val === 'null' || val === null)
                    val = ''
                
                if (op.type === 'boolean')
                    $input.prop('checked', val)
                else if (op.type === 'findgrid')
                    $input.data('context', $tr).val(String(val))
                else {
                    $input.val(String(val))
                    
                    if ($input.isTag('select') && $input.prop('multiple') && val && !$.isArray(val)) {
                        $input.val(val.split(','))
                    }
                }
                
                if (isAdd) {
                    if (op.addAttrs && typeof op.addAttrs === 'object') {
                        $.each(op.addAttrs, function(i, n) {
                            $input.attr(i, n)
                        })
                    }
                } else {
                    if (op.editAttrs && typeof op.editAttrs === 'object') {
                        $.each(op.editAttrs, function(i, n) {
                            $input.attr(i, n)
                        })
                    }
                }
                
                $td
                    .empty()
                    .append($input)
                    .addClass(that.classnames.td_edit)
                
                if (that.treeColumn && that.treeColumn === op) {
                    var treeInput = that.tools.createTreePlaceholder(data, '')
                    
                    $td.attr('align', 'left').html(treeInput)
                    
                    $input.appendTo($td.find('.datagrid-tree-title'))
                }
                
                onChange($input, $td, val)
                
                if (op.locked) {
                    var $lockTr = that.$lockTbody.find('tr:eq('+ tr_index +')')
                    var $lockTd = $lockTr.find('> td:eq('+ op.lockIndex +')')
                    
                    $td.clone().html(html).insertAfter($td)
                    $td.show().insertAfter($lockTd).initui()
                    $lockTd.remove()
                }
            }
            
            if (!--tds_length) {
                $tr
                    .initui()
                    .validator({
                        msgClass : 'n-bottom',
                        theme    : 'red_bottom_effect_grid'
                    })
            }
        })
    }
    
    Datagrid.prototype.saveAll = function($trs) {
        var that = this, options = that.options, keys = options.keys, callback = options.editCallback, $tr, data, data_index, datas = [], changeData, tempData, postData = [], returnData = [], len = $trs && $trs.length
        
        if (!$trs || $trs.length) {
            $trs = that.$tbody.find('> tr.'+ that.classnames.tr_edit)
            len  = $trs.length
        }
        
        if (!len) return
        
        $trs.each(function() {
            $tr = $(this)
            
            data_index = that.tools.getNoChildDataIndex($tr.index())
            data = that.isDom ? $tr.data('initData') : that.data[data_index]
            datas.push(data)
            
            $tr.isValid(function(v) {
                if (v) {
                    // Update data
                    changeData = $tr.data(that.datanames.changeData)
                    $.extend(data, changeData)
                    // Specification post data
                    if (options.jsonPrefix) {
                        tempData = {}
                        
                        $.each(data, function(name, value) {
                            if (!that.tools.isGridData(name))
                                tempData[options.jsonPrefix +'.'+ name] = value
                        })
                    } else {
                        tempData = $.extend({}, data)
                        
                        for (var key in keys)
                            delete tempData[keys[key]]
                    }
                    
                    len --
                    postData.push(tempData)
                } else {
                    postData = []
                    
                    return false
                }
            })
        })
        
        // do save
        if (!len) {
            // Callback
            if (callback) {
                callback = callback.toFunc()
            } else {
                callback = function(json) {
                    if ($.type(json) === 'array') {
                        returnData = json
                    } else if (typeof json === 'object') {
                        returnData.push(json)
                    }
                    
                    $trs.each(function(i) {
                        $tr = $(this)
                        data_index = $tr.index()
                        
                        if (that.columnModel[0] === that.childColumn)
                            data_index = data_index / 2
                        
                        data = that.isDom ? $tr.data('initData') : that.data[data_index]
                        
                        $.extend(data, typeof returnData[i] === 'object' && returnData[i])
                        
                        if (that.allData && that.allData[data.gridIndex]) {
                            $.extend(that.allData[data.gridIndex], data)
                        }
                        
                        // update allData for filter
                        if (that.oldAllData) that.oldAllData = that.allData.concat()
                        
                        that.inlineEditComplete($tr, data)
                    })
                    
                    that.tools.afterSave($trs, postData)
                }
            }
            if (that.options.saveLocal) {
                callback(postData)
            } else {
                // Do ajax
                if (that.tools.beforeSave($trs, datas)) {
                    var type = options.editType, opts = {url:options.editUrl, data:JSON.stringify(postData), type:'POST', okCallback:callback}
                    
                    if (type && type === 'raw') {
                        opts.contentType = 'application/json'
                    } else {
                        opts.data = {json:opts.data}
                        type && (opts.type = type)
                    }
                    
                    BJUI.ajax('doajax', opts)
                }
            }
        }
    }
    
    // update - inline edit
    Datagrid.prototype.updateEdit = function($tr, $btn) {
        var that = this, options = that.options, keys = options.keys, callback = options.editCallback, data, datas = [], changeData, tempData, postData = [], returnData, data_index = $tr.index()
        
        data_index = that.tools.getNoChildDataIndex(data_index)
        
        if (that.isDom) data = $tr.data('initData')
        else data = that.data[data_index]
        
        if ($tr.hasClass(that.classnames.tr_edit)) {
            // validate
            $tr.isValid(function(v) {
                if (v) {
                    // Update data
                    changeData = $tr.data(that.datanames.changeData)
                    $.extend(data, changeData)
                    // Specification post data
                    if (options.jsonPrefix) {
                        tempData = {}
                        $.each(data, function(name, value) {
                            if (!that.tools.isGridData(name))
                                tempData[options.jsonPrefix +'.'+ name] = value
                        })
                    } else {
                        tempData = $.extend({}, data)
                        
                        for (var key in keys) {
                            delete tempData[keys[key]]
                        }
                    }
                    // Callback
                    if (callback) {
                        callback = callback.toFunc()
                    } else {
                        callback = function(json) {
                            if ($.type(json) === 'array') {
                                returnData = json[0]
                            } else if (typeof json === 'object') {
                                returnData = json
                            }
                            
                            $.extend(data, typeof returnData === 'object' && returnData)
                            
                            if (that.allData && that.allData[data.gridIndex]) {
                                $.extend(that.allData[data.gridIndex], data)
                            }
                            
                            // update allData for filter
                            if (that.oldAllData) that.oldAllData = that.allData.concat()
                            
                            that.inlineEditComplete($tr, data, $btn)
                            that.tools.afterSave($tr, data)
                        }
                    }
                    // Do ajax
                    datas.push(data)
                    if (that.tools.beforeSave($tr, datas)) {
                        postData.push(tempData)
                        
                        var type = options.editType, opts = {url:options.editUrl, data:JSON.stringify(postData), type:'POST', okCallback:callback}
                        
                        if (type && type === 'raw') {
                            opts.contentType = 'application/json'
                        } else {
                            opts.data = {json:opts.data}
                            type && (opts.type = type)
                        }
                        
                        BJUI.ajax('doajax', opts)
                    }
                }
            })
        }
    }
    
    /* cancel - inline edit */
    Datagrid.prototype.cancelEdit = function($trs) {
        var that = this, columnModel = that.columnModel
        
        $trs.each(function() {
            var $tr = $(this), tr_index = $tr.index(), data_index = tr_index
            
            if ($tr.hasClass(that.classnames.tr_edit)) {
                $tr
                    .removeClass(that.classnames.tr_edit)
                    .find('> td.'+ that.classnames.td_edit).each(function() {
                        var $td = $(this), td_index = $td.index(), model = columnModel[td_index], html = $td.data(that.datanames.td_html)
                        
                        $td.removeClass(that.classnames.td_edit).removeClass(that.classnames.td_changed).html(html)
                        if (model.locked) {
                            var $lockTr = that.$lockTbody.find('tr:eq('+ tr_index +')')
                            var $lockTd = $lockTr.find('> td:eq('+ model.lockIndex +')')
                            
                            html = $lockTd.data(that.datanames.td_html)
                            
                            $lockTr.removeClass(that.classnames.tr_edit)
                            $lockTd.removeClass(that.classnames.td_edit).removeClass(that.classnames.td_changed).html(html)
                        }
                    })
            }
            
            if ($tr.hasClass(that.classnames.tr_add)) {
                data_index = that.tools.getNoChildDataIndex(data_index)
                
                if (!that.isDom) {
                    that.allData = that.allData.remove(that.data[data_index].gridIndex)   // remove data in allData
                    that.data    = that.data.remove(data_index)
                    
                    that.tools.updateGridIndex()
                    that.$element.data('allData', that.allData)
                }
                
                if ($tr.next().hasClass(that.classnames.tr_child)) {
                    $tr.next().remove()
                    that.$lockTbody && that.$lockTbody.find('> tr:eq('+ tr_index +')').next().remove()
                }
                
                that.$lockTbody && that.$lockTbody.find('> tr:eq('+ tr_index +')').remove()
                $tr.remove()
                
                that.tools.createNoDataTr()
                
                if (that.options.height === 'auto')
                    that.fixedHeight()
            }
        })
    }
    
    // inline editComplete
    Datagrid.prototype.inlineEditComplete = function($tr, trData, $btn) {
        var that = this, columnModel = that.columnModel, tr_index = $tr.index(), $tds = $tr.find('> td'), hasLinenumber = false, $lockTr = that.$lockTbody && that.$lockTbody.find('> tr:eq('+ tr_index +')')
        var tdTemplate = that.options.tdTemplate, tempData = $.extend({}, trData)
        
        $.each(columnModel, function(i, n) {
            if (n === that.linenumberColumn) hasLinenumber = true
            if (that.tools.isGridModel(n)) return true
            
            var label = n.name ? trData[n.name] : '', render_label, $td = $tds.eq(n.index)
            
            if (that.isTemplate)
                $td = null
            if (typeof label === 'undefined' || label === 'null' || label === null)
                label = ''
            
            $td && ($td.text(label).removeClass(that.classnames.td_edit).removeClass(that.classnames.td_changed))
            
            if (n.render && typeof n.render === 'function') {
                if (n.items) {
                    render_label = n.render.call(that, label, trData, n.items, n.itemattr)
                    tempData[n.name] = render_label
                    $td && $td.html(render_label)
                } else {
                    render_label = n.render.call(that, label, trData)
                    tempData[n.name] = render_label
                    $td && $td.html(render_label)
                }
            } else if (n.items) {
                render_label = Datagrid.renderItem.call(that, label, trData, n.items, n.itemattr)
                tempData[n.name] = render_label
                $td && $td.html(render_label)
            }
            
            if (that.options.isTree && n.hasTree) {
                $td && ($td.attr('align', 'left').addClass('datagrid-tree-td').html(that.tools.createTreePlaceholder(trData, (render_label || label))))
            }
            
            if (n.locked && $lockTr) {
                var $lockTd = $lockTr.find('> td:eq('+ n.lockIndex +')')
                
                $lockTd.removeClass(that.classnames.td_changed).html($td.html())
            }
        })
        
        if (that.isTemplate) {
            if (typeof tdTemplate === 'function')
                tdTemplate = tdTemplate.apply(that, [trData])
            
            tdTemplate = that.tools.replacePlh4Template(tdTemplate, tempData)
            
            $tr.find('> td.datagrid-template-td').html(tdTemplate)
        }
        
        $tr.removeClass(that.classnames.tr_edit).initui()
        if ($lockTr)
            $lockTr.removeClass(that.classnames.tr_edit).initui()
        
        if (!$btn) $btn = $tds.filter('.'+ that.classnames.s_edit).find('button.update')
        if ($btn && $btn.length)
            $btn.trigger('bjui.datagrid.update.tr')
        
        if ($tr.hasClass(that.classnames.tr_add)) {
            $tr.removeClass(that.classnames.tr_add)
            $tr.find('> td.'+ that.classnames.s_edit).removeData('isAdd')
            
            // update linenumber
            if (hasLinenumber) {
                that.tools.updateLinenumber()
            }
            
            // tree
            if (that.options.isTree) {
                var $parentTr = trData[that.options.keys.treePTr], parentData = trData[that.options.keys.treePData], keys = that.options.treeOptions.keys, $treePTd
                
                if ($parentTr && parentData) {
                    if (!parentData[keys.isParent]) {
                        parentData[keys.isParent] = true
                        $treePTd = $parentTr.find('> td.datagrid-tree-td')
                        $treePTd.html(that.tools.createTreePlaceholder(parentData, $treePTd.find('span.datagrid-tree-title').html()))
                    }
                    if (!parentData[keys.childLen]) {
                        parentData[keys.childLen] = 1
                    } else {
                        parentData[keys.childLen] ++
                    }
                    
                    $tr.data(that.options.keys.treePTr).data('child', parentData[keys.childLen]).attr('data-child', parentData[keys.childLen])
                }
                
                $tr.addClass('datagrid-tree-tr datagrid-tree-level-'+ trData[keys.level]).attr('data-child', 0).attr('data-level', trData[keys.level])
            }
            
            // child
            $tr.next('.'+ that.classnames.tr_child).remove()
            that.tools.createChildTr($tr, trData)
        }
    }
    
    // inline edit
    Datagrid.prototype.dialogEdit = function($tr, isAdd, data) {
        if (!this.tools.beforeEdit($tr, data)) {
            return false
        }
        
        var that = this, options = that.options, tools = that.tools, columnModel = that.columnModel, tr_index = $tr.index(), data_index = tr_index, $dialog, $form, html = '', title
        
        if (!data) {
            data_index = tools.getNoChildDataIndex(data_index)
            
            if (that.isDom) data = $tr.data('initData') || tools.setDomData($tr)
            else data = that.data[data_index]
        }
        
        if (!that.inputs || !that.inputs.length) tools.initEditInputs()
        
        title = options.gridTitle || 'datagrid'
        
        if (isAdd) {
            title += ' - '+ BJUI.getRegional('datagrid.add')
        } else {
            if (data.addFlag) data.addFlag = false
            title += ' - '+ BJUI.getRegional('datagrid.edit')
        }
        
        $dialog = $('<div><div class="bjui-pageContent"></div><div class="bjui-pageFooter"></div></div>')
        $form   = $('<form class="datagrid-dialog-edit-form"></form>')
        
        var onChange = function($tr, $form, $el, model) {
            var changeData = $tr.data(that.datanames.changeData), jsontype = model.jsontype, defaultVal = (typeof model.defaultVal === 'undefined') ? null : model.defaultVal
            
            switch (model.type) {
            case 'date':
                $el.change(function() {
                    changeData[model.name] = $(this).val()
                })
                
                break
            case 'select':
                $el.change(function() {
                    var $element = $(this), val = $element.val(), multiple = $element.prop('multiple')
                    
                    if (multiple && $.isArray(val)) {
                        val = val.join(',')
                    }
                    if (!multiple && jsontype) {
                        if (jsontype === 'boolean') {
                            val = Boolean(val)
                        } else if (jsontype === 'number') {
                            if (val.length)
                                !isNaN(Number(val)) && (val = Number(val))
                            else
                                val = null
                        }
                    }
                    
                    changeData[model.name] = val
                })
                
                break
            case 'boolean':
                $el.on('ifChanged', function() {
                    changeData[model.name] = $(this).is(':checked')
                })
                
                break
            case 'findgrid':
                $el.change(function() {
                    var val = data.value
                    
                    if (jsontype && jsontype === 'number') {
                        if (val.length)
                            !isNaN(Number(val)) && (val = Number(val))
                        else
                            val = null
                    }
                    
                    changeData[model.name] = $(this).val()
                })
                
                $form.off('afterchange.bjui.findgrid').on('afterchange.bjui.findgrid', '[data-toggle="findgrid"]', function(e, data) {
                    var include = model.attrs && model.attrs['data-options'] && model.attrs['data-options']['include']
                    
                    if (include) {
                        $.each(include.split(','), function(i, n) {
                            var obj = n.trim().split(':'), name = obj[0], key = obj.length > 1 ? obj[1] : obj[0]
                            
                            data['data'] && (changeData[name] = data['data'][key])
                        })
                    }
                })
                
                break
            case 'spinner':
                $el.change(function() {
                    changeData[model.name] = Number($(this).val())
                })
                
                break
            default:
                $el.change(function() {
                    var val = $(this).val()
                    
                    if (jsontype && jsontype === 'number') {
                        if (val.length)
                            !isNaN(Number(val)) && (val = Number(val))
                        else
                            val = null
                    }
                    
                    changeData[model.name] = val
                })
                
                break
            }
            
            if (isAdd) {
                if (model.type === 'boolean') {
                    defaultVal = Boolean(defaultVal)
                    changeData[model.name] = defaultVal
                    $el.prop('checked', defaultVal)
                } else {
                    if (defaultVal != null) {
                        if ($el.isTag('select') && $el.prop('multiple')) {
                            $el.val($.isArray(defaultVal) ? defaultVal : defaultVal.split(','))
                        } else {
                            $el.val(String(defaultVal))
                        }
                        if (jsontype) {
                            if (jsontype === 'number')
                                !isNaN(Number(defaultVal)) && (defaultVal = Number(defaultVal))
                            else if (jsontype === 'boolean')
                                defaultVal = Boolean(defaultVal)
                        }
                        
                        changeData[model.name] = defaultVal
                    } else {
                        //($el.isTag('select') && !$el.prop('multiple')) && (changeData[model.name] = $el.val())
                        if (($el.isTag('select') && !$el.prop('multiple'))) {
                            var $clone = $el.clone().appendTo('body'), val = $clone.val()
                            
                            changeData[model.name] = val
                            $clone.remove()
                        }
                    }
                }
            } else if (jsontype) {
                $el.trigger('change')
            }
        }
        
        var onLoad = function($dialog) {
            var $form   = $dialog.find('form.datagrid-dialog-edit-form'),
                $btns   = $dialog.find('div.bjui-pageFooter button'),
                $prev   = $btns.first(),
                $next   = $btns.eq(1),
                $cancel = $btns.eq(2),
                $save   = $btns.last(),
                trindex, dataindex
            
            var createForm = function(data, $form, $tr) {
                $form.empty()
                if (!$tr.data(that.datanames.changeData)) $tr.data(that.datanames.changeData, {})
                
                if ($form.data('validator')) $form.validator('destroy')
                
                $.each(columnModel, function(i, n) {
                    if (!n.name || that.tools.isGridModel(n)) return true
                    
                    var input = that.inputs[i], $input, $p = $('<p></p>'), id = 'datagrid-dialog-edit-column-'+ i, val = data[n.name]
                    
                    if (n.hide) $p.addClass('hide')
                    if (isAdd) {
                        if (!n.add) input = ''
                    } else {
                        if (!n.edit) input = ''
                    }
                    
                    if (typeof val === 'undefined' || val === 'null' || val === null)
                        val = ''
                    
                    if (input) {
                        $input = $(input).attr('id', id)
                        if ($input.isTag('select')) $input.attr('data-width', 'auto')
                        else if (!$input.isTag('checkbox')) $input.attr('size', 30)
                        
                        if (n.type === 'boolean') {
                            $input.prop('checked', val)
                        } else if (n.type === 'findgrid') {
                            $input.val(String(val)).data('context', $form)
                        } else {
                            $input.val(String(val))
                        }
                        
                        if ($input.isTag('select') && $input.prop('multiple') && val && !$.isArray(val)) {
                            $input.val(val.split(','))
                        }
                        
                        if (isAdd) {
                            if (n.addAttrs && typeof n.addAttrs === 'object') {
                                $.each(n.addAttrs, function(k, v) {
                                    $input.attr(k, v)
                                })
                            }
                        } else {
                            if (n.editAttrs && typeof n.editAttrs === 'object') {
                                $.each(n.editAttrs, function(k, v) {
                                    $input.attr(k, v)
                                })
                            }
                        }
                    } else if (!isAdd) {
                        if (!n.edit)
                            input = val
                    }
                    
                    $p
                        .append('<label class="control-label x120" for="'+ id +'">'+ n.label +'：</label>')
                        .append($('<span class="datagrid-dialog-column-span"></span>').append($input || input))
                        .appendTo($form)
                    
                    if ($input)
                        onChange($tr, $form, $input, n)
                })
                
                $form
                    .initui()
                    .validator({
                        msgClass : 'n-bottom',
                        theme    : 'red_bottom_effect_grid'
                    })
            }
            
            if ($form.is(':empty')) createForm(data, $form, $tr)
            
            trindex = $tr.index()
            
            if (that.columnModel[0] === that.childColumn)
                trindex = trindex * 2
            
            if (!trindex) $prev.addClass('disabled')
            if (trindex == that.data.length - 1) $next.addClass('disabled')
            
            $prev.click(function() {
                var $tr_prev = $tr.prev(), data
                
                if (that.options.hasChild && that.options.childOptions)
                    $tr_prev = $tr_prev.prev()
                if ($tr_prev.length) {
                    dataindex = that.tools.getNoChildDataIndex($tr_prev.index())
                        
                    if (that.isDom) {
                        data = $tr_prev.data('initData') || tools.setDomData($tr_prev)
                    } else {
                        data = that.data[dataindex]
                    }
                    
                    $tr = $tr_prev
                    createForm(data, $form, $tr)
                    $next.removeClass('disabled')
                    
                    if (!$tr_prev.prev().length) $prev.addClass('disabled')
                } else {
                    $prev.addClass('disabled')
                }
            })
            
            $next.click(function() {
                var $tr_next = $tr.next(), data, $next_next
                
                if (that.options.hasChild && that.options.childOptions)
                    $tr_next = $tr_next.next()
                if ($tr_next.length) {
                    $next_next = $tr_next.next()
                    dataindex  = that.tools.getNoChildDataIndex($tr_next.index())
                    
                    if (that.options.hasChild && that.options.childOptions)
                        $next_next = $next_next.length && $next_next.next()
                    if (that.isDom) {
                        data = $tr_next.data('initData') || tools.setDomData($tr_next)
                    } else {
                        data = that.data[dataindex]
                    }
                    
                    $tr = $tr_next
                    createForm(data, $form, $tr)
                    $form.initui()
                    $prev.removeClass('disabled')
                    
                    if (!$next_next || !$next_next.length) $next.addClass('disabled')
                } else {
                    $next.addClass('disabled')
                }
            })
            
            $save.click(function() {
                var changeData, data, datas = [], postData, returnData, callback = options.editCallback
                
                dataindex = that.tools.getNoChildDataIndex($tr.index())
                
                if (that.isDom) data = $tr.data('initData')
                else data = that.data[dataindex]
                
                $form.isValid(function(v) {
                    if (v) {
                        changeData = $tr.data(that.datanames.changeData)
                        $.extend(data, changeData)
                        
                        if (options.jsonPrefix) {
                            postData = {}
                            $.each(data, function(name, value) {
                                if (!that.tools.isGridData(name))
                                    postData[options.jsonPrefix +'.'+ name] = value
                            })
                        } else {
                            postData = $.extend({}, data)
                            
                            for (var key in that.options.keys)
                                delete postData[that.options.keys[key]]
                        }
                        
                        // Callback
                        if (callback) {
                            callback = callback.toFunc()
                        } else {
                            callback = function(json) {
                                if ($.type(json) === 'array') {
                                    returnData = json[0]
                                } else if (typeof json === 'object') {
                                    returnData = json
                                }
                                
                                $.extend(data, typeof returnData === 'object' && returnData)
                                
                                that.dialogEditComplete($tr, data)
                                that.$grid.dialog('close', 'datagrid-dialog-edit')
                                that.tools.afterSave($tr, data)
                            }
                        }
                        
                        // Do ajax
                        datas.push(data)
                        if (that.tools.beforeSave($tr, datas)) {
                            var type = options.editType, opts = {url:options.editUrl, data:JSON.stringify(postData), type:'POST', okCallback:callback}
                            
                            if (type && type === 'raw') {
                                opts.contentType = 'application/json'
                            } else {
                                opts.data = {json:opts.data}
                                type && (opts.type = type)
                            }
                            
                            BJUI.ajax('doajax', opts)
                        }
                    }
                })
            })
            
            $cancel.click(function() {
                that.$grid.dialog('close', 'datagrid-dialog-edit')
            })
        }
        
        var onClose = function() {
            var addRemove = false
            
            that.$tbody.find('> tr.'+ that.classnames.tr_add).each(function() {
                var $tr = $(this), trindex = $tr.index(), dataindex = trindex
                
                dataindex = that.tools.getNoChildDataIndex(dataindex)
                
                that.data = that.data.remove(dataindex)
                
                if ($tr.next().hasClass(that.classnames.tr_child)) {
                    $tr.next().remove()
                    that.$lockTbody && that.$lockTbody.find('> tr:eq('+ trindex +')').next().remove()
                }
                
                that.$lockTbody && that.$lockTbody.find('> tr:eq('+ trindex +')').remove()
                $tr.remove()
                
                addRemove = true
            })
            
            if (addRemove && that.options.height === 'auto')
                that.fixedHeight()
        }
        
        $dialog.find('> div:first')
            .append($form)
            .next().append(BJUI.doRegional(FRAG.gridDialogEditBtns, that.regional))
        
        var dialog_options = $.extend({}, {id:'datagrid-dialog-edit', fresh:true, target:$dialog[0], width:520, height:400, mask:true, title:title, onLoad:onLoad, onClose:onClose}, (typeof options.editDialogOp === 'object' && options.editDialogOp))
        
        that.$grid.dialog(dialog_options)
    }
    
    // dialog editComplete
    Datagrid.prototype.dialogEditComplete = function($tr, trData) {
        var that = this, columnModel = that.columnModel, tr_index = $tr.index(), $tds = $tr.find('> td'), hasLinenumber = false, $trs = that.$tbody.find('> tr'), $lockTr = that.$lockTbody && that.$lockTbody.find('> tr:eq('+ tr_index +')')
        var tdTemplate = that.options.tdTemplate, tempData = $.extend({}, trData), treeOptions = that.options.treeOptions, treePData, treePTr, treePTd
        
        $.each(columnModel, function(i, n) {
            if (n === that.linenumberColumn) hasLinenumber = true
            if (that.tools.isGridModel(n)) return true
            
            var label = n.name ? trData[n.name] : '', render_label, $td = $tds.eq(n.index)
            
            if (that.isTemplate)
                $td = null
            if (typeof label === 'undefined' || label === 'null' || label === null)
                label = ''
            
            $td && ($td.text(label).removeClass(that.classnames.td_edit).removeClass(that.classnames.td_changed))
            
            if (n.render && typeof n.render === 'function') {
                if (n.items) {
                    render_label = n.render.call(that, label, trData, n.items, n.itemattr)
                    tempData[n.name] = render_label
                    $td && $td.html(render_label)
                } else {
                    render_label = n.render.call(that, label, trData)
                    tempData[n.name] = render_label
                    $td && $td.html(render_label)
                }
            } else if (n.items) {
                render_label = Datagrid.renderItem.call(that, label, trData, n.items, n.itemattr)
                tempData[n.name] = render_label
                $td && $td.html(render_label)
            }
            
            if (that.options.isTree && n.hasTree) {
                $td && ($td.attr('align', 'left').addClass('datagrid-tree-td').html(that.tools.createTreePlaceholder(trData, (render_label || label))))
            }
            
            if (n.locked && $lockTr && $td) {
                var $lockTd = $lockTr.find('> td:eq('+ n.lockIndex +')')
                
                $lockTd.removeClass(that.classnames.td_edit).removeClass(that.classnames.td_changed).html($td.html())
            }
        })
        
        if (that.isTemplate) {
            if (typeof tdTemplate === 'function')
                tdTemplate = tdTemplate.apply(that, [trData])
            
            tdTemplate = that.tools.replacePlh4Template(tdTemplate, tempData)
            
            $tr.find('> td.datagrid-template-td').html(tdTemplate)
        }
        
        $tr.initui()
        if ($lockTr)
            $lockTr.initui()
        
        if ($tr.hasClass(that.classnames.tr_add)) {
            $tr.removeClass(that.classnames.tr_add)
            
            // update linenumber
            if (hasLinenumber) {
                that.tools.updateLinenumber()
            }
            
            // tree
            if (that.options.isTree) {
                var $parentTr = trData[that.options.keys.treePTr], parentData = trData[that.options.keys.treePData], keys = that.options.treeOptions.keys, $treePTd
                
                if ($parentTr && parentData) {
                    if (!parentData[keys.isParent]) {
                        parentData[keys.isParent] = true
                        $treePTd = $parentTr.find('> td.datagrid-tree-td')
                        $treePTd.html(that.tools.createTreePlaceholder(parentData, $treePTd.find('span.datagrid-tree-title').html()))
                    }
                    if (!parentData[keys.childLen]) {
                        parentData[keys.childLen] = 1
                    } else {
                        parentData[keys.childLen] ++
                    }
                    
                    $tr.data(that.options.keys.treePTr).data('child', parentData[keys.childLen]).attr('data-child', parentData[keys.childLen])
                }
                
                $tr.addClass('datagrid-tree-tr datagrid-tree-level-'+ trData[keys.level]).attr('data-child', 0).attr('data-level', trData[keys.level])
            }
            
            // child
            $tr.next('.'+ that.classnames.tr_child).remove()
            that.tools.createChildTr($tr, trData)
        }
    }
    
    /* resize */
    Datagrid.prototype.resizeGrid = function() {
        var that = this, $target = that.$grid.getPageTarget(), parentW, parentH
        var _resizeGrid = function() {
            var ww = that.$grid.width(), $headDiv = that.$tableH.next('.datagrid-thead-dialog-div'),
                newTemplate = ((that.options.tdTemplate && that.options.templateWidth) && that.options.templateWidth > ww) || that.options.templateWidth === 0
            
            // tdtemplate
            if (newTemplate !== that.isTemplate) {
                that.isTemplate = newTemplate
                that.tools.coverTemplate()
                return
            }
            if ((that.options.dialogFilterW && ww < that.options.dialogFilterW)
                || that.options.dialogFilterW === 0) {
                
                that.$tableH.hide()
                
                if (!$headDiv.length) {
                    that.$tableH.after('<div class="datagrid-thead-dialog-div" style="padding:5px;"><button type="button" class="btn btn-orange datagrid-thead-dialog-view">'+ BJUI.getRegional('datagrid.fAndS') +'</button><span class="datagrid-thead-dialog-filter-msg"><span class="msg-sort"></span><span class="msg-filter"></span></span></div>')
                } else {
                    $headDiv.show()
                }
                
                if (!that.$headFilterUl)
                    that.filterInThead(true)
                
                that.$grid.off('click.datagrid.thead.view').on('click.datagrid.thead.view', '.datagrid-thead-dialog-view', function(e) {
                    BJUI.dialog({id:'datagrid-thead-view', html:'<div class="bjui-pageContent"></div><div class="bjui-pageFooter"><ul><li><button type="button" class="btn btn-close">关闭</button></li></ul></div>', width:360, height:300, title:'datagrid - thead - columns', 
                        onLoad: function($dialog) {
                            that.$headFilterUl.show().appendTo($dialog.find('.bjui-pageContent'))
                        },
                        beforeClose:function($dialog) {
                            that.$headFilterUl.hide().appendTo(that.$grid)
                            return true
                        }
                    })
                })
            } else {
                that.$grid.removeClass('datagrid-flowlayout')
                that.$tableH.show()
                $headDiv.hide()
                
                if (that.$colgroupB.is(':hidden')) {
                    that.$colgroupB.show()
                }
            }
            
            if (that.initFixedW && String(that.options.width).endsWith('%')) {
                parentW = that.$grid.parent().width()
                that.fixedWidth()
                
                if (that.options.hasChild && that.options.childOptions) {
                    that.$tbody.find('> tr.'+ that.classnames.tr_child +':visible').each(function() {
                        var $child = $(this), $tr = $child.prev(), $table = $tr.data('bjui.datagrid.child')
                        
                        if ($table && $table.length) {
                            $table.datagrid('fixedWidth')
                        }
                    })
                }
            }
            
            if (String(that.options.height).endsWith('%')) {
                that.tools.setBoxbH()
            }
        }
        
        // for tab
        $('a[data-toggle="tab"]').on('shown.bs.tab', $.proxy(function(e) {
            if (!that.$element.data('bjui.datagrid.init.tab')) {
                var $target = $(e.target), $box = $target.data('target'), href = $target.attr('href')
                
                if (!$box)
                    $box = $(href)
                
                if ($box && $box.length) {
                    if ($box.find(that.$element).length) {
                        that.$element.data('bjui.datagrid.init.tab', true)
                        that.$element.datagrid('fixedHeight')
                    }
                }
            }
        }, that))
        
        $(window).on(BJUI.eventType.resizeGrid, $.proxy(_resizeGrid, that))
    }
    
    
    // DATAGRID PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args     = arguments,
            property = option
        
        return this.each(function () {
            var $this   = $(this),
                options = $.extend(true, {}, Datagrid.DEFAULTS, typeof option === 'object' && option),
                data    = $this.data('bjui.datagrid')
            
            if (!data) $this.data('bjui.datagrid', (data = new Datagrid(this, options)))
            if (typeof property === 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                data.init()
            }
        })
    }

    var old = $.fn.datagrid

    $.fn.datagrid             = Plugin
    //$.fn.datagrid.Constructor = Datagrid
    $.datagrid                = Datagrid
    
    // DATAGRID NO CONFLICT
    // =================
    
    $.fn.datagrid.noConflict = function () {
        $.fn.datagrid = old
        return this
    }
    
    // DATAGRID DATA-API
    // ==============
    
    $(document).on(BJUI.eventType.initUI, function(e) {
        $(e.target).find('table[data-toggle="datagrid"]').each(function() {
            var $this = $(this), options = $this.data()
            
            if (!$this.length) return
            
            if (options.options && typeof options.options === 'string') options.options = options.options.toObj()
            $.extend(options, typeof options.options === 'object' && options.options)
            
            Plugin.call($this, options)
        })
    })

    exports('BJUIdatagrid',new Datagrid());
});