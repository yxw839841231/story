/**
 * 美窝云
 * APP服务端
 * 版权所有 2016~ 2017 杭州美窝科技有限公司
 */
package cn.zjoin.story.business.controller.love;

import cn.zjoin.story.base.controller.BaseController;
import cn.zjoin.story.base.model.BaseResult;
import cn.zjoin.story.base.model.Pagination;
import cn.zjoin.story.business.model.Confession;
import cn.zjoin.story.business.model.ConfessionOperator;
import cn.zjoin.story.business.service.ConfessionService;
import cn.zjoin.story.core.aspet.Login;
import cn.zjoin.story.util.QRCodeUtil;
import com.github.pagehelper.PageInfo;
import org.apache.log4j.Logger;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;

/**
 * Created on 2017/8/29.
 *
 * @auther 地瓜
 */
@Controller
@RequestMapping(value = "/love", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class LoveController extends BaseController {
    Logger logger = Logger.getLogger(LoveController.class);


    @Resource
    private ConfessionService confessionService;

    @RequestMapping(value = "")
    public String index() {
        return "love";
    }

    @RequestMapping(value = "/show")
    @ResponseBody
    public void show(String id, HttpServletResponse response) {
        response.setContentType("text/html;charset=utf-8");
        try {
            response.getWriter().print("<script type='text/javascript'>window.location.href='/html/love/show.html?id=" + id + "&time = " + System.currentTimeMillis() + "';</script>");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @RequestMapping(value = "add", method = RequestMethod.POST)
    @ResponseBody
    @Login
    public BaseResult add(Confession confession) {
        BaseResult result = new BaseResult();
        confession.setAuthor(getUser().getNickname());
        confession.setAuthorid(getUser().getId());
        confession.setCreatetime(new Date());
        try {
            confessionService.insert(confession);
        } catch (Exception e) {
            result = new BaseResult(e.getMessage());
            e.printStackTrace();
            logger.error(e.getMessage());
        }
        return result;
    }


    @RequestMapping(value = "top", method = RequestMethod.GET)
    @ResponseBody
    public BaseResult top(PageInfo<Confession> pageInfo, ConfessionOperator confessionOperator) {

        BaseResult result = new BaseResult();
        try {
            pageInfo.setPageSize(6);
            confessionOperator.setIsaudit(1);
            confessionOperator.setIsauditoperator("=");
            confessionOperator.setIsprivate(0);
            confessionOperator.setIsprivateoperator("=");
            pageInfo = confessionService.pageInfoSimpleOrderBy(pageInfo, confessionOperator, Confession.class, "createtime","desc","id", "title", "author", "createtime", "cover", "describle", "isprivate", "browse", "good");
            return Pagination.toPagination(pageInfo);
        } catch (Exception e) {
            result.setMsg(e.getMessage());
            e.printStackTrace();
        }

        return result;
    }


    @RequestMapping(value = "newest", method = RequestMethod.GET)
    @ResponseBody
    public BaseResult newest(PageInfo<Confession> pageInfo, ConfessionOperator confessionOperator) {

        BaseResult result = new BaseResult();
        try {
            pageInfo.setPageSize(10);
            confessionOperator.setIsaudit(1);
            confessionOperator.setIsauditoperator("=");
            confessionOperator.setIsprivate(0);
            confessionOperator.setIsprivateoperator("=");
            pageInfo = confessionService.pageInfoSimpleOrderBy(pageInfo, confessionOperator, Confession.class, "createtime","desc","id", "title", "author", "createtime", "isprivate", "browse", "good");
            return Pagination.toPagination(pageInfo);
        } catch (Exception e) {
            result.setMsg(e.getMessage());
        }
        return result;
    }
    @RequestMapping(value = "share", method = RequestMethod.GET)
    @ResponseBody
    public BaseResult share(String id) {
        BaseResult result = new BaseResult();
        String url = "http://www.story521.cn/love/show?id=" + id;
        result.setData(QRCodeUtil.createQRCode(url));
        return result;
    }

    @RequestMapping(value = "showi", method = RequestMethod.GET)
    @ResponseBody
    public BaseResult showi(String id) {
        BaseResult result = new BaseResult();
        Confession confession = new Confession();
        confession.setId(id);
        result.setData(confessionService.getOneByEntity(confession));
        return result;
    }

    @RequestMapping(value = "my", method = RequestMethod.GET)
    @ResponseBody
    public BaseResult mylove(PageInfo<Confession> pageInfo, ConfessionOperator confessionOperator) {

        BaseResult result = new BaseResult();
        try {
            pageInfo.setPageSize(6);
            confessionOperator.setAuthorid(getUser().getId());
            confessionOperator.setAuthoridoperator("=");
            pageInfo = confessionService.pageInfoSimpleOrderBy(pageInfo, confessionOperator, Confession.class, "createtime","desc","id", "title", "author", "createtime", "cover", "describle", "isprivate", "browse", "good");
            result.setData(pageInfo);
        } catch (Exception e) {
            result.setMsg(e.getMessage());
            e.printStackTrace();
        }

        return result;
    }


}
