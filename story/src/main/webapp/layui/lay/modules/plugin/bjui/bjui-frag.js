/* ========================================================================
 * B-JUI: bjui-frag.js  V1.31
 * @author K'naan
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-frag.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

layui.define(['BJUIcore','BJUIregional'], function(exports){
    "use strict";
    var BJUI = layui.BJUIcore;
    
    BJUI.setRegional('alertmsg', {
        title  : {error : 'Error', info : 'Info', warn : 'Warning', correct : 'Correct', confirm : 'Confirm', prompt:'Prompt'},
        btnMsg : {ok    : 'OK',    yes  : 'YES',  no   : 'NO',      cancel  : 'Cancel'}
    })
    
    BJUI.setRegional('dialog', {
        close    : 'Close',
        maximize : 'Maximize',
        restore  : 'Restore',
        minimize : 'Minimize',
        title    : 'Popup window'
    })
    
    BJUI.setRegional('orderby', {
        asc  : 'Asc',
        desc : 'Desc'
    })
    
    BJUI.setRegional('pagination', {
        first  : 'First page',
        last   : 'Last page',
        prev   : 'Prev page',
        next   : 'Next page',
        jumpto : 'Jump page number',
        jump   : 'Jump',
        page :'页'
    })
    
    BJUI.setRegional('datagrid', {
        asc       : 'ASC',
        desc      : 'DESC',
        showhide  : 'Show/Hide columns',
        filter    : 'Filter',
        clear     : 'Clear',
        lock      : 'Lock',
        unlock    : 'Unlock',
        add       : 'Add',
        edit      : 'Edit',
        save      : 'Save',
        update    : 'Update',
        cancel    : 'Cancel',
        del       : 'Delete',
        prev      : 'Prev',
        next      : 'Next',
        refresh   : 'Refresh',
        query     : 'Query',
        'import'  : 'Import',
        'export'  : 'Export',
        exportf   : 'Export filter',
        all       : 'All',
        'true'    : 'True',
        'false'   : 'False',
        noData    : '无数据!',
        fAndS     : 'Filter && Sort!',
        expandMsg : 'Click here to expand the tr!',
        shrinkMsg : 'Click here to shrink the tr!',
        selectMsg : '未选择数据！',
        saveMsg   : '无可保存数据!',
        editMsg   : '请先保存正在编辑的数据!',
        delMsg    : '确定删除?',
        delMsgM   : '确定删除所选数据?',
        errorData : '未取得正确数据!',
        failData  : '请求数据失败!'
    })
    
    BJUI.setRegional('findgrid', {
        choose : 'Choose the selected item',
        append : 'Append choose the selected item',
        empty  : 'Empty existing values'
    })
    
    BJUI.setRegional('progressmsg', '数据加载中，请稍候……')
    
    BJUI.setRegional('datepicker', {
        close      : 'Close',
        prev       : 'Prev month',
        next       : 'Next month',
        clear      : 'Clear',
        ok         : 'OK',
        dayNames   : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        monthNames : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    })
    
    BJUI.setRegional('navtabCM', {
        refresh    : 'Refresh navtab',
        close      : 'Close navtab',
        closeother : 'Close other navtab',
        closeall   : 'Close all navtab'
    })
    
    BJUI.setRegional('dialogCM', {
        refresh    : 'Refresh dialog',
        close      : 'Close dialog',
        closeother : 'Close other dialog',
        closeall   : 'Close all dialog'
    })
    
    BJUI.setRegional('statusCode_503', 'HTTP status 503, the current server load is too large or is down for maintenance!')
    
    BJUI.setRegional('ajaxnosend', 'Communication with the server is interrupted, please check the URL link or server status!')
    
    BJUI.setRegional('sessiontimout', 'Session timeout, please login!')
    
    BJUI.setRegional('plhmsg', 'Placeholder corresponding selector None Valid!')
    
    BJUI.setRegional('nocheckgroup', 'Undefined group name selected item [check box "data-group"]!')
    
    BJUI.setRegional('notchecked', 'Unchecked any one!')
    
    BJUI.setRegional('selectmsg', 'Please select one option!')
    
    BJUI.setRegional('validatemsg', 'Submitted form data has [{0}] field an error, please after modified submitting!')
    
    BJUI.setRegional('idChecked', 'is not standardized, ID need to start with a letter, components include (0-9, letters, hyphens, underscore)')
    
    BJUI.setRegional('uititle', 'B-JUI')
    
    BJUI.setRegional('maintab', 'My home')
    
    
    window.FRAG = {
        dialog: '<div class="bjui-dialog bjui-dialog-container" style="top:150px; left:300px;">' +
                '    <div class="dialogHeader" onselectstart="return false;" oncopy="return false;" onpaste="return false;" oncut="return false;">' +
                '        <a class="close" href="javascript:;" title="#close#"><i class="fa fa-times"></i></a>' +
                '        <a class="maximize" href="javascript:;" title="#maximize#"><i class="fa fa-square-o"></i></a>' +
                '        <a class="restore" href="javascript:;" title="#restore#"><i class="fa fa-clone fa-rotate-90"></i></a>' +
                '        <a class="minimize" href="javascript:;" title="#minimize#"><i class="fa fa-minus"></i></a>' +
                '        <h1><span><i class="fa fa-th-large"></i></span> <span class="title">#title#</span></h1>' +
                '    </div>' +
                '    <div class="dialogContent unitBox"></div>' +
                '    <div class="resizable_h_l" tar="nw"></div>' +
                '    <div class="resizable_h_r" tar="ne"></div>' +
                '    <div class="resizable_h_c" tar="n"></div>' +
                '    <div class="resizable_c_l" tar="w" style="height:100%;"></div>' +
                '    <div class="resizable_c_r" tar="e" style="height:100%;"></div>' +
                '    <div class="resizable_f_l" tar="sw"></div>' +
                '    <div class="resizable_f_r" tar="se"></div>' +
                '    <div class="resizable_f_c" tar="s"></div>' +
                '</div>'
        ,
        taskbar: '<div id="bjui-taskbar" style="left:0px; display:none;">' +
                 '    <div class="taskbarContent">' +
                 '        <ul></ul>' +
                 '    </div>' +
                 '    <div class="taskbarLeft taskbarLeftDisabled"><i class="fa fa-angle-double-left"></i></div>' +
                 '    <div class="taskbarRight"><i class="fa fa-angle-double-right"></i></div>' +
                 '</div>'
        ,
        splitBar: '<div id="bjui-splitBar"></div>',
        splitBarProxy: '<div id="bjui-splitBarProxy"></div>',
        resizable: '<div id="bjui-resizable" class="bjui-resizable"></div>',
        alertBackground: '<div class="bjui-alertBackground"></div>',
        maskBackground: '<div class="bjui-maskBackground bjui-ajax-mask"></div>',
        maskProgress: '<div class="bjui-maskProgress bjui-ajax-mask"><i class="fa fa-cog fa-spin"></i>&nbsp;&nbsp;#progressmsg#<div class="progressBg"><div class="progress"></div></div></div>',
        progressBar_custom: '<div id="bjui-progressBar-custom" class="progressBar"><i class="fa fa-cog fa-spin"></i> <span></span></div>',
        dialogMask: '<div class="bjui-dialogBackground"></div>',
        orderby: '<a href="javascript:;" class="order asc" data-order-direction="asc" title="#asc#"><i class="fa fa-angle-up"></i></a>' +
                 '<a href="javascript:;" class="order desc" data-order-direction="desc" title="#desc#"><i class="fa fa-angle-down"></i></a>'
        ,
        slidePanel: '<div class="panel panel-default">' +
                    '    <div class="panel-heading">' +
                    '        <h4 class="panel-title"><a data-toggle="collapse" data-parent="#bjui-accordionmenu" href="##id#" class="#class#">#icon#&nbsp;#title#<b>#righticon#</b></a></h4>' +
                    '    </div>' +
                    '    <div id="#id#" class="panel-collapse collapse#bodyclass#">' +
                    '        <div class="panel-body">' +
                    '        </div>' +
                    '    </div>' +
                    '</div>'
        ,
        gridPaging: '<ul class="pagination">' +
        '    <li class="page-total">' +
        '        <span title="#total#">#count#</span>' +
        '    </li>' +
        '    <li class="page-jumpto"><span class="page-input"><input class="form-control input-sm-pages" type="text" size="3.2" value="#pageNum#" title="#jumpto#"></span></li>' +
        '    <li class="page-first btn-nav">' +
        '        <a href="javascript:;" title="#first#"><i class="layui-icon">&#xea4d;</i></a>' +
        '    </li>' +
        '    <li class="page-prev btn-nav">' +
        '        <a href="javascript:;" title="#prev#"><i class="layui-icon">&#xea49;</i></a>' +
        '    </li>' +
        '    #pageNumFrag#' +
        '    <li class="page-next btn-nav">' +
        '        <a href="javascript:;" title="#next#"><i class="layui-icon">&#xea4e;</i></a>' +
        '    </li>' +
        '    <li class="page-last btn-nav">' +
        '        <a href="javascript:;" title="#last#"><i class="layui-icon">&#xea4a;</i></a>' +
        '    </li>' +
        '</ul>'
        ,
        gridpageNum : '<li class="page-num#active#"><a href="javascript:;">#num#</a></li>',
        gridMenu : '<div class="datagrid-menu-box">'
                 + '    <ul>'
                 + '        <li class="datagrid-li-asc"><a href="javascript:;"><span class="icon"><i class="fa fa-sort-amount-asc"></i></span><span class="title">#asc#</span></a></li>'
                 + '        <li class="datagrid-li-desc"><a href="javascript:;"><span class="icon"><i class="fa fa-sort-amount-desc"></i></span><span class="title">#desc#</span></a></li>'
                 + '        <li class="datagrid-li-filter"><a href="javascript:;"><span class="icon"><i class="fa fa-filter"></i></span><span class="title">#filter#</span><span class="arrow"></span></a></li>'
                 + '        <li class="datagrid-li-showhide"><a href="javascript:;"><span class="icon"><i class="fa fa-check-square-o"></i></span><span class="title">#showhide#</span><span class="arrow"></span></a></li>'
                 + '        <li class="datagrid-li-lock"><a href="javascript:;"><span class="icon"><i class="fa fa-lock"></i></span><span class="title">#lock#</span></a></li>'
                 + '        <li class="datagrid-li-unlock disable"><a href="javascript:;"><span class="icon"><i class="fa fa-unlock"></i></span><span class="title">#unlock#</span></a></li>'
                 + '    </ul>'
                 + '</div>'
        ,
        gridFilter: '<div class="datagrid-filter-box">'
                  + '<fieldset>'
                  + '<legend>#label#</legend>'
                  + '<span class="filter-a"></span>'
                  + '<span class="filter-and"><select data-toggle="selectpicker" data-container="true" data-width="100%"><option value="and">AND</option><option value="or">OR</option></select></span>'
                  + '<span class="filter-b"></span>'
                  + '<span class="filter-ok"><button type="button" class="btn-green ok" data-icon="check">#filter#</button><button type="button" class="btn-orange clear" data-icon="remove">#clear#</button></span>'
                  + '</fieldset>'
                  + '</div>'
        ,
        gridShowhide: '<li data-index="#index#" class="datagrid-col-check"><a href="javascript:;"><i class="fa fa-check-square-o"></i>#label#</a></li>',
        gridEditBtn : '<button type="button" class="btn btn-green bjui-datagrid-btn edit"><i class="fa fa-edit"></i> #edit#</button>'
                    + '<button type="button" class="btn btn-green bjui-datagrid-btn update"><i class="fa fa-edit"></i> #update#</button>'
                    + '<button type="button" class="btn btn-green bjui-datagrid-btn save"><i class="fa fa-check"></i> #save#</button>'
                    + '<button type="button" class="btn btn-orange bjui-datagrid-btn cancel"><i class="fa fa-undo"></i> #cancel#</button>'
                    + '<button type="button" class="btn btn-red bjui-datagrid-btn delete"><i class="fa fa-remove"></i> #del#</button>'
        ,
        gridDialogEditBtns: '<ul>'
                          + '    <li class="pull-left"><button type="button" class="btn btn-orange prev" data-icon="arrow-up">#prev#</button></li>'
                          + '    <li class="pull-left"><button type="button" class="btn btn-orange next" data-icon="arrow-down">#next#</button></li>'
                          + '    <li><button type="button" class="btn btn-red cancel" data-icon="remove">#cancel#</button></li>'
                          + '    <li><button type="button" class="btn btn-default save" data-icon="save">#save#</button></li>'
                          + '</ul>'
        ,
        gridExpandBtn: '<span title="#expandMsg#"><i class="fa fa-plus"></i></span>',
        gridShrinkBtn: '<span title="#shrinkMsg#"><i class="fa fa-minus"></i></span>',
        alertBoxFrag: '<div id="bjui-alertMsgBox" class="bjui-alert"><div class="alertContent"><div class="#type#"><div class="alertInner"><h1><i class="fa #fa#"></i>#title#</h1><div class="msg">#message##prompt#</div></div><div class="toolBar clearfix"><ul>#btnFragment#</ul></div></div></div></div>',
        alertBtnFrag: '<li><button class="btn btn-#class#" rel="#callback#" type="button">#btnMsg#</button></li>',
        calendarFrag: '<div id="bjui-calendar">' +
                      '    <div class="main">' +
                      '        <a class="close" href="javascript:;" title="#close#"><i class="fa fa-times-circle"></i></a>' +
                      '        <div class="head">' +
                      '            <table width="100%" border="0" cellpadding="0" cellspacing="2">' +
                      '                <tr>' +
                      '                    <td width="20"><a class="prev" href="javascript:;" title="#prev#"><i class="fa fa-arrow-left"></i></a></td>' +
                      '                    <td><select name="year"></select></td>' +
                      '                    <td><select name="month"></select></td>' +
                      '                    <td width="20"><a class="next" href="javascript:;" title="#next#"><i class="fa fa-arrow-right"></i></a></td>' +
                      '                </tr>' +
                      '            </table>' +
                      '        </div>' +
                      '        <div class="body">' +
                      '            <dl class="dayNames"><dt>7</dt><dt>1</dt><dt>2</dt><dt>3</dt><dt>4</dt><dt>5</dt><dt>6</dt></dl>' +
                      '            <dl class="days"><!-- date list --></dl>' +
                      '            <div style="clear:both;height:0;line-height:0"></div>' +
                      '        </div>' +
                      '        <div class="foot">' +
                      '            <table class="time">' +
                      '                <tr>' +
                      '                    <td>' +
                      '                        <input type="text" class="hh" maxlength="2" data-type="hh" data-start="0" data-end="23">:<input' +
                      '                         type="text" class="mm" maxlength="2" data-type="mm" data-start="0" data-end="59">:<input' +
                      '                         type="text" class="ss" maxlength="2" data-type="ss" data-start="0" data-end="59">' +
                      '                    </td>' +
                      '                    <td><ul><li class="up" data-add="1">&and;</li><li class="down">&or;</li></ul></td>' +
                      '                </tr>' +
                      '            </table>' +
                      '            <button type="button" class="clearBtn btn btn-orange">#clear#</button>' +
                      '            <button type="button" class="okBtn btn btn-default">#ok#</button>' +
                      '        </div>' +
                      '        <div class="tm">' +
                      '            <ul class="hh">' +
                      '                <li>0</li>' +
                      '                <li>1</li>' +
                      '                <li>2</li>' +
                      '                <li>3</li>' +
                      '                <li>4</li>' +
                      '                <li>5</li>' +
                      '                <li>6</li>' +
                      '                <li>7</li>' +
                      '                <li>8</li>' +
                      '                <li>9</li>' +
                      '                <li>10</li>' +
                      '                <li>11</li>' +
                      '                <li>12</li>' +
                      '                <li>13</li>' +
                      '                <li>14</li>' +
                      '                <li>15</li>' +
                      '                <li>16</li>' +
                      '                <li>17</li>' +
                      '                <li>18</li>' +
                      '                <li>19</li>' +
                      '                <li>20</li>' +
                      '                <li>21</li>' +
                      '                <li>22</li>' +
                      '                <li>23</li>' +
                      '            </ul>' +
                      '            <ul class="mm">' +
                      '                <li>0</li>' +
                      '                <li>5</li>' +
                      '                <li>10</li>' +
                      '                <li>15</li>' +
                      '                <li>20</li>' +
                      '                <li>25</li>' +
                      '                <li>30</li>' +
                      '                <li>35</li>' +
                      '                <li>40</li>' +
                      '                <li>45</li>' +
                      '                <li>50</li>' +
                      '                <li>55</li>' +
                      '            </ul>' +
                      '            <ul class="ss">' +
                      '                <li>0</li>' +
                      '                <li>10</li>' +
                      '                <li>20</li>' +
                      '                <li>30</li>' +
                      '                <li>40</li>' +
                      '                <li>50</li>' +
                      '            </ul>' +
                      '        </div>' +
                      '    </div>' +
                      '</div>'
        ,
        spinnerBtn:  '<ul class="bjui-spinner"><li class="up" data-add="1">&and;</li><li class="down">&or;</li></ul>',
        findgridBtn: '<a class="bjui-lookup" href="javascript:;" data-toggle="findgridbtn"><i class="fa fa-search"></i></a>',
        dateBtn:     '<a class="bjui-lookup" href="javascript:;" data-toggle="datepickerbtn"><i class="fa fa-calendar"></i></a>',
        navtabCM: '<ul id="bjui-navtabCM">' +
                  '    <li rel="reload"><span class="icon"><i class="fa fa-refresh"></i></span><span class="title">#refresh#</span></li>' +
                  '    <li rel="closeCurrent"><span class="icon"><i class="fa fa-remove"></i></span><span class="title">#close#</li>' +
                  '    <li rel="closeOther"><span class="icon"><i class="fa fa-remove"></i></span><span class="title">#closeother#</li>' +
                  '    <li rel="closeAll"><span class="icon"><i class="fa fa-remove"></i></span><span class="title">#closeall#</li>' +
                  '</ul>'
        ,
        dialogCM: '<ul id="bjui-dialogCM">' +
                  '    <li rel="reload"><span class="icon"><i class="fa fa-refresh"></i></span><span class="title">#refresh#</span></li>' +          
                  '    <li rel="closeCurrent"><span class="icon"><i class="fa fa-remove"></i></span><span class="title">#close#</span></li>' +
                  '    <li rel="closeOther"><span class="icon"><i class="fa fa-remove"></i></span><span class="title">#closeother#</span></li>' +
                  '    <li rel="closeAll"><span class="icon"><i class="fa fa-remove"></i></span><span class="title">#closeall#</span></li>' +
                  '</ul>'
        ,
        externalFrag: '<iframe src="{url}" style="width:100%;height:{height};" frameborder="no" border="0" marginwidth="0" marginheight="0"></iframe>'
    }
    exports('BJUIfrag',null);
});
