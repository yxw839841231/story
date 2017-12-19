/**
 * 美窝云
 * APP服务端
 * 版权所有 2016~ 2017 杭州美窝科技有限公司
 */
package cn.zjoin.story.base.model;

import com.github.pagehelper.PageInfo;

import java.util.List;

/**
 * Created on 2017/8/31.
 *
 * @auther 地瓜
 */
public class Pagination<T> extends BaseResult {
    private List<T> rows;

    private Integer pages;

    public List<T> getRows() {
        return rows;
    }

    public void setRows(List<T> rows) {
        this.rows = rows;
    }

    public Integer getPages() {
        return pages;
    }

    public void setPages(Integer pages) {
        this.pages = pages;
    }

    public static Pagination toPagination(PageInfo pageInfo){
        Pagination pagination = new Pagination();
        pagination.setPages(pageInfo.getPages());
        pagination.setRows(pageInfo.getList());
        return pagination;
    }
}
