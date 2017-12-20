/**
 * 美窝云
 * APP服务端
 * 版权所有 2016~ 2017 杭州美窝科技有限公司
 */
package cn.zjoin.story.base.model;

/**
 * Created on 2017/8/17.
 *
 * @auther 地瓜
 */
public class BaseResult {
    public BaseResult() {
        this.code = 0;
        this.msg = "success";
    }

    public BaseResult( String msg) {
        this.code = 500;
        this.msg = msg;
    }
    public BaseResult(Integer status, String msg) {
        this.code = status;
        this.msg = msg;
    }

    public BaseResult(Integer status, String msg, Object data) {
        this.code = status;
        this.msg = msg;
        this.data = data == null ? "" : data;
    }



    protected Integer code;
    protected String msg;
    protected Object data;
    protected Integer pageSize;

    protected Integer pageCurrent;

    protected Long total;

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public Integer getPageCurrent() {
        pageCurrent=pageCurrent==null? 0 :pageCurrent;
        return pageCurrent;
    }

    public void setPageCurrent(Integer pageCurrent) {
        this.pageCurrent = pageCurrent;
    }

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }
}
