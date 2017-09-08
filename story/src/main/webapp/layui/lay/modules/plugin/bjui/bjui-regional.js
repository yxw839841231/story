
/* ========================================================================
 * B-JUI: bjui-regional.zh-CN.js  V1.31
 * @author K'naan
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-regional.zh-CN.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

layui.define(['jquery','BJUIcore'], function(exports){
    "use strict";
    var BJUI = layui.BJUIcore,$ = layui.jquery;;
    
    $(function() {
        
        /* 消息提示框 */
        BJUI.setRegional('alertmsg', {
            title  : {error : '错误提示', info : '信息提示', warn : '警告信息', correct : '成功信息', confirm : '确认信息', prompt : '确认信息'},
            btnMsg : {ok    : '确定', yes  : '是',   no   : '否',   cancel  : '取消'}
        })
        

        /* order by */
        BJUI.setRegional('orderby', {
            asc  : '升序',
            desc : '降序'
        })
        
        /* 分页 */
        BJUI.setRegional('pagination', {
            total   : '总记录数/总页数',
            first   : '首页',
            last    : '末页',
            prev    : '上一页',
            next    : '下一页',
            jumpto  : '输入跳转页码，回车确认',
            jump    : '跳转',
            page    : '页',
            refresh : '刷新'
        })
        
        BJUI.setRegional('datagrid', {
            asc       : '升序',
            desc      : '降序',
            showhide  : '显示/隐藏 列',
            filter    : '过滤',
            clear     : '清除',
            lock      : '锁定列',
            unlock    : '解除锁定',
            add       : '添加',
            edit      : '编辑',
            save      : '保存',
            update    : '更新',
            cancel    : '取消',
            del       : '删除',
            prev      : '上一条',
            next      : '下一条',
            refresh   : '刷新',
            query     : '查询',
            'import'  : '导入',
            'export'  : '导出',
            exportf   : '导出筛选',
            all       : '全部',
            'true'    : '是',
            'false'   : '否',
            noData    : '没有数据！',
            fAndS     : '过滤和排序！',
            expandMsg : '点我展开行！',
            shrinkMsg : '点我收缩行！',
            selectMsg : '未选中任何行！',
            editMsg   : '请先保存编辑行！',
            saveMsg   : '没有需要保存的行！',
            delMsg    : '确定要删除该行吗？',
            delMsgM   : '确定要删除选中行？',
            errorData : '未获取到正确的数据！',
            failData  : '请求datagrid数据失败！'
        })
        
        BJUI.setRegional('findgrid', {
            choose : '选择选中项',
            append : '追加选择',
            empty  : '清空现有值'
        })
        
        /* ajax加载提示 */
        BJUI.setRegional('progressmsg', '正在努力加载数据，请稍等...')
        
        /* 日期选择器 */
        BJUI.setRegional('datepicker', {
            close      : '关闭',
            prev       : '上月',
            next       : '下月',
            clear      : '清空',
            ok         : '确定',
            dayNames   : ['日', '一', '二', '三', '四', '五', '六'],
            monthNames : ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        })
        

        
        /* dialog右键菜单 */
        BJUI.setRegional('dialogCM', {
            refresh    : '刷新本窗口',
            close      : '关闭本窗口',
            closeother : '关闭其他窗口',
            closeall   : '关闭所有窗口'
        })
    
        /* 503错误提示 */
        BJUI.setRegional('statusCode_503', '服务器当前负载过大或者正在维护！')
        
        /* AJAX 状态返回 0 提示 */
        BJUI.setRegional('ajaxnosend', '与服务器的通信中断，请检查URL链接或服务器状态！')
        
        /* timeout提示 */
        BJUI.setRegional('sessiontimeout', '会话超时，请重新登陆！')
        
        /* 占位符对应选择器无有效值提示 */
        BJUI.setRegional('plhmsg', '占位符对应的选择器无有效值！')
        
        /* 未定义复选框组名提示 */
        BJUI.setRegional('nocheckgroup', '未定义选中项的组名[复选框的"data-group"]！')
        
        /* 未选中复选框提示 */
        BJUI.setRegional('notchecked', '未选中任何一项！')
        
        /* 未选中下拉菜单提示 */
        BJUI.setRegional('selectmsg', '请选择一个选项！')
        
        /* 表单验证错误提示信息 */
        BJUI.setRegional('validatemsg', '提交的表单中 [{0}] 个字段有错误，请更正后再提交！')
        
        /* ID检查 */
        BJUI.setRegional('idChecked', '不规范，ID需以字母开头，组成部分包括（0-9，字母，中横线，下划线）')
        
    });
    exports('BJUIregional', null);
});
