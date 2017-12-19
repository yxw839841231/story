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
import cn.zjoin.story.business.model.ArticleOperator;
import cn.zjoin.story.business.service.ArticleService;
import cn.zjoin.story.core.aspet.Login;
import com.github.pagehelper.PageInfo;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.lang.reflect.InvocationTargetException;
import java.util.Date;

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
    public BaseResult list(PageInfo<Article> pageInfo, ArticleOperator articleOperator) {

        BaseResult result = new BaseResult();
        try {
            pageInfo= articleService.pageInfoSimple(pageInfo,articleOperator,Article.class,"id","title","author","createtime","isaudit","cover","keywords","browse");
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

    @RequestMapping(value = "edit", method = RequestMethod.GET)
    @ResponseBody
    public BaseResult edit(Long id) {

        BaseResult result = new BaseResult();
        try {
            result.setData(articleService.getById(id));
        }catch (Exception e) {
            result = new BaseResult(e.getMessage());
            e.printStackTrace();
        }

        return result;
    }

    @RequestMapping("audit")
    @ResponseBody
    public BaseResult audit(Article article) {
        BaseResult result = new BaseResult();
        article.setIsaudit(true);
        article.setCreatetime(null);
        articleService.audit(article);
        return result;
    }

    @RequestMapping("add")
    @ResponseBody
    @Login
    public BaseResult add(Article article) {
        BaseResult result = new BaseResult();
        article.setAuthor(getUser().getNickname());
        article.setAuthorid(getUser().getId());
        article.setCreatetime(new Date());
        if (StringUtils.isEmpty(article.getCover())) {
            article.setCover("http://image.story521.cn/FhNQ7FEeTpf2juzH8rAbPDyNP1w3");
        }
        try {
            articleService.insert(article);
        } catch (Exception e) {
            result.setCode(-1);
            result.setMsg(e.getMessage());
            e.printStackTrace();
        }
        return result;
    }

    @RequestMapping("update")
    @ResponseBody
    public BaseResult update(Article article) {
        BaseResult result = new BaseResult();
        try {
            articleService.update(article);
        } catch (Exception e) {
            result.setCode(-1);
            result.setMsg(e.getMessage());
            e.printStackTrace();
        }
        return result;
    }

    @RequestMapping("delete")
    @ResponseBody
    public BaseResult delete(Article article) {
        BaseResult result = new BaseResult();
        try {
            articleService.deleteByEntity(article);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }
}
