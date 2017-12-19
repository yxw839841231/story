/**
 * 美窝云
 * APP服务端
 * 版权所有 2016~ 2017 杭州美窝科技有限公司
 */
package cn.zjoin.story.business.controller.admin;

import cn.zjoin.story.base.controller.BaseController;
import cn.zjoin.story.base.model.BaseResult;
import cn.zjoin.story.base.model.Pagination;
import cn.zjoin.story.business.controller.love.LoveController;
import cn.zjoin.story.business.model.Confession;
import cn.zjoin.story.business.model.ConfessionOperator;
import cn.zjoin.story.business.service.ConfessionService;
import com.github.pagehelper.PageInfo;
import org.apache.log4j.Logger;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.lang.reflect.InvocationTargetException;

/**
 * Created on 2017/8/29.
 *
 * @auther 地瓜
 */
@Controller
@RequestMapping(value = "admin/love", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class LoveAdminController extends BaseController {
    Logger logger = Logger.getLogger(LoveController.class);


    @Resource
    private ConfessionService confessionService;


    @RequestMapping(value = "list", method = RequestMethod.GET)
    @ResponseBody
    public BaseResult list(PageInfo<Confession> pageInfo, ConfessionOperator articleOperator) {

        BaseResult result = new BaseResult();
        try {
            pageInfo= confessionService.pageInfoSimple(pageInfo,articleOperator,Confession.class,"id","title","author","createtime","isaudit","cover","isprivate","browse","type");
            return Pagination.toPagination(pageInfo);
        } catch (NoSuchMethodException e) {
            result.setMsg(e.getMessage());
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }

        return result;
    }

    @RequestMapping("audit")
    @ResponseBody
    public BaseResult audit(Confession confession) {
        BaseResult result = new BaseResult();
        confessionService.audit(confession);
        return result;
    }

}
