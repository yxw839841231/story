/**
 * 美窝云
 * APP服务端
 * 版权所有 2016~ 2017 杭州美窝科技有限公司
 */
package cn.zjoin.story.business.controller.admin;

import cn.zjoin.story.base.controller.BaseController;
import cn.zjoin.story.base.model.BaseResult;
import cn.zjoin.story.base.model.Pagination;
import cn.zjoin.story.business.model.Article;
import cn.zjoin.story.business.service.ArticleService;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;

/**
 * Created on 2017/8/29.
 *
 * @auther 地瓜
 */
@Controller
@RequestMapping(value = "/admin/article", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class ArticleController extends BaseController {

    @Resource
    private ArticleService articleService;

    @RequestMapping(value = "list", method = RequestMethod.GET)
    @ResponseBody
    public Pagination list(Pagination pagination) {
        Pagination p = articleService.pageInfoSimple(pagination);
        p.setCode(0);
        p.setMsg("ok");
        return p;
    }

    @RequestMapping("audit")
    @ResponseBody
    public BaseResult audit(Article article) {
        BaseResult result = new BaseResult();
        articleService.audit(article);
        return result;
    }
}
