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

    public BaseResult(Integer status, String msg) {
        this.code = status;
        this.msg = msg;
    }

    public BaseResult(Integer status, String msg, Object data) {
        this.code = status;
        this.msg = msg;
        this.data = data == null ? "" : data;
    }



    private Integer code;
    private String msg;
    private Object data;

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
}
