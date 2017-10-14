/**
 * 美窝云
 * APP服务端
 * 版权所有 2016~ 2017 杭州美窝科技有限公司
 */
package cn.zjoin.story.base.controller;

import cn.zjoin.story.base.model.BaseResult;
import cn.zjoin.story.business.model.User;
import cn.zjoin.story.core.RedisOperationManager;
import cn.zjoin.story.core.shiro.TokenManager;
import cn.zjoin.story.util.QiNiuUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created on 2017/8/17.
 *
 * @auther 地瓜
 */
@RequestMapping("/")
@Controller
public class BaseController {

    public RedisOperationManager getRedisOperationManager(){
        return RedisOperationManager.init();
    }

    @ResponseBody
    @RequestMapping("/api/uptoken")
    public BaseResult uptoken() {
        BaseResult result = new BaseResult();
        result.setData(QiNiuUtil.getUpToken());
        return result;
    }

    @RequestMapping("admin")
    public String admin() {
        return "admin";
    }

    protected User getUser(){
        User user = TokenManager.getToken();
        return user;
    }
}
