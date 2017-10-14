/**
 * 美窝云
 * APP服务端
 * 版权所有 2016~ 2017 杭州美窝科技有限公司
 */
package cn.zjoin.story.business.controller.admin;

import cn.zjoin.story.base.model.BaseResult;
import cn.zjoin.story.business.model.Menu;
import cn.zjoin.story.business.model.System;
import cn.zjoin.story.business.service.MenuService;
import cn.zjoin.story.business.service.SystemService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created on 2017/9/22.
 *
 * @auther 地瓜
 */
@Controller
@RequestMapping("menu")
public class MenuController {
    @Resource
    private MenuService menuService;

    @Resource
    private SystemService systemService;

    @RequestMapping("list")
    @ResponseBody
    public BaseResult list(){
        List<Menu> list = menuService.getAll();
        List<System> list1 = systemService.getAll();
        BaseResult result = new BaseResult();
        Map<String,Object> map = new HashMap<String, Object>();
        map.put("menu",list);
        map.put("system",list1);
        result.setData(map);
        return result;
    }

    @RequestMapping("save")
    @ResponseBody
    public BaseResult save(Menu menu){

        BaseResult result = new BaseResult();
        try {
            menuService.insert(menu);
        }catch (Exception e){
            result.setCode(-1);
            result.setMsg(e.getMessage());
        }
        return result;
    }
    @RequestMapping("update")
    @ResponseBody
    public BaseResult update(Menu menu){

        BaseResult result = new BaseResult();
        try {
            menuService.update(menu);
        }catch (Exception e){
            result.setCode(-1);
            result.setMsg(e.getMessage());
        }
        return result;
    }
}
