/**
 * 美窝云
 * APP服务端
 * 版权所有 2016~ 2017 杭州美窝科技有限公司
 */
package cn.zjoin.story.business.controller.story;

import cn.zjoin.story.base.controller.BaseController;
import cn.zjoin.story.base.model.BaseResult;
import cn.zjoin.story.business.model.User;
import cn.zjoin.story.business.service.UserService;
import cn.zjoin.story.core.shiro.TokenManager;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.Date;

/**
 * Created on 2017/8/29.
 *
 * @auther 地瓜
 */
@Controller
@RequestMapping(value = "/story/user", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class UserStoryController extends BaseController {

    @Resource
    UserService userService;

    @RequestMapping(value = "login", method = RequestMethod.POST)
    @ResponseBody
    public BaseResult login(User user) {
        BaseResult result = new BaseResult();
        user = TokenManager.login(user,false);
        if (user == null) result.setCode(-1);
        else result.setData(user);
        return result;
    }

    @RequestMapping("regist")
    @ResponseBody
    public BaseResult regist(User user) {
        BaseResult result = new BaseResult();
        user.setIsactive(true);
        user.setCreatetime(new Date());
        userService.insert(user);
        return result;
    }

    @RequestMapping("/logout")
    @ResponseBody
    public BaseResult logout() {
        BaseResult result = new BaseResult();
        TokenManager.logout();
        return result;
    }

    @RequestMapping("")
    @ResponseBody
    public BaseResult getuser() {
        BaseResult result = new BaseResult();
        try {
            User user = TokenManager.getToken();
            if(user!=null){
                result.setData(user);
            }else {
                result.setCode(-1);
            }
        } catch (Exception e) {
            result.setCode(-1);
        }
        return result;
    }
}
