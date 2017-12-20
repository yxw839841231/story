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
import cn.zjoin.story.util.PictureUtil;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import tk.mybatis.mapper.entity.Example;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

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
        try{

            user = TokenManager.login(user, false);
            if (user == null) result.setCode(-1);
            else result.setData(user);
        }catch (Exception e){
            result = new BaseResult(e.getMessage());
        }
        return result;
    }

    @RequestMapping(value = "loginAdmin", method = RequestMethod.POST)
    @ResponseBody
    public BaseResult login2(User user) {
        BaseResult result = new BaseResult();
        try{
            user.setCanback(true);
            user = TokenManager.login(user, false,true);
            if (user == null) {
                result =new BaseResult("登录失败！");
            }
            else result.setData(user);
        }catch (Exception e){
            result = new BaseResult(e.getMessage());
        }
        return result;
    }

    @RequestMapping(value = "regist",method = RequestMethod.POST)
    @ResponseBody
    public BaseResult regist(User user) {
        BaseResult result = new BaseResult();
        //TODO 注册校验
        Example example = new Example(User.class);
        example.createCriteria().andEqualTo("loginname",user.getLoginname());

        List<User> exist = userService.getByExample(example);
        if(!CollectionUtils.isEmpty(exist)){
            return new BaseResult("用户名已存在！");
        }
        example = new Example(User.class);
        example.createCriteria().andEqualTo("email",user.getEmail());
        exist = userService.getByExample(example);
        if(!CollectionUtils.isEmpty(exist)){
            return new BaseResult("该邮箱已注册！");
        }

        user.setPicture(PictureUtil.getPicture());
        user.setIsactive(true);
        user.setCreatetime(new Date());
        user.setCanback(false);

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
            if (user != null) {
                result.setData(user);
            } else {
                result.setCode(-1);
            }
        } catch (Exception e) {
            result.setCode(-1);
        }
        return result;
    }

    @RequestMapping(value = "update",method = RequestMethod.POST)
    @ResponseBody
    public BaseResult update(User user) {
        BaseResult result = new BaseResult();
        Example example = new Example(User.class);
        example.createCriteria().andEqualTo("email",user.getEmail());
        List<User> exist = userService.getByExample(example);
        if(!CollectionUtils.isEmpty(exist)){
            if(exist.size()==1 && exist.get(0).getId().equals(getUser().getId())){

            }else{
                return new BaseResult("该邮箱已注册！");
            }
        }

        example = new Example(User.class);
        example.createCriteria().andEqualTo("phone",user.getPhone());
        exist = userService.getByExample(example);
        if(!CollectionUtils.isEmpty(exist)){
            if(exist.size()==1 && exist.get(0).getId().equals(getUser().getId())){

            }else{
                return new BaseResult("该手机号已注册！");
            }
        }
        user.setId(getUser().getId());
        userService.update(user);
        TokenManager.logout();
        return result;
    }
}
