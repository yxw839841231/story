/**
 * 美窝云
 * APP服务端
 * 版权所有 2016~ 2017 杭州美窝科技有限公司
 */
package cn.zjoin.story.business.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created on 2017/8/29.
 *
 * @auther 地瓜
 */
@Controller
@RequestMapping("/")
public class MainController {
    @RequestMapping("")
    public String main(){
        return "index";
    }
    @RequestMapping("admin")
    public String admin(){
        return "admin/index";
    }

    @RequestMapping("nifty")
    public String nifty(){
        return "admin/nifty";
    }
}
