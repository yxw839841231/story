/**
 * 美窝云
 * APP服务端
 * 版权所有 2016~ 2017 杭州美窝科技有限公司
 */
package cn.zjoin.story.business.controller.admin;

import cn.zjoin.story.base.controller.BaseController;
import cn.zjoin.story.base.model.BaseResult;
import cn.zjoin.story.base.model.Pagination;
import cn.zjoin.story.business.model.User;
import cn.zjoin.story.business.service.UserService;
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
@RequestMapping(value = "/admin/user", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class UserController extends BaseController {

    @Resource
    UserService userService;

    @RequestMapping(value = "list", method = RequestMethod.GET)
    @ResponseBody
    public Pagination list(Pagination pagination) {
        Pagination p = userService.pageInfoSimple(pagination);
        p.setCode(0);
        p.setMsg("ok");
        return p;
    }

    @RequestMapping("add")
    @ResponseBody
    public BaseResult add(User user) {
        BaseResult result = new BaseResult();
        user.setLoginpass("123456");
        user.setIsactive(false);
        user.setCreatetime(new Date());
        userService.insert(user);
        return result;
    }
}
