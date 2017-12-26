/**
 * 美窝云
 * APP服务端
 * 版权所有 2016~ 2017 杭州美窝科技有限公司
 */
package cn.zjoin.story.business.controller.story;

import cn.zjoin.story.base.controller.BaseController;
import cn.zjoin.story.base.model.BaseResult;
import cn.zjoin.story.business.model.Article;
import cn.zjoin.story.business.model.ArticleOperator;
import cn.zjoin.story.business.service.ArticleService;
import cn.zjoin.story.core.aspet.Login;
import com.github.pagehelper.PageInfo;
import org.apache.log4j.Logger;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.lang.reflect.InvocationTargetException;
import java.util.Date;
import java.util.List;

/**
 * Created on 2017/8/29.
 *
 * @auther 地瓜
 */
@Controller
@RequestMapping(value = "/story/article", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class ArticleStoryController extends BaseController {

    Logger logger = Logger.getLogger(ArticleStoryController.class);

    @Resource
    private ArticleService articleService;


    @RequestMapping(value = "list", method = RequestMethod.GET)
    @ResponseBody
    public BaseResult list(PageInfo<Article> pageInfo, ArticleOperator articleOperator) {
       PageInfo list = null;
        try {
            list= articleService.pageInfoSimple(pageInfo,articleOperator,Article.class,"id","title","author","createtime","isaudit","cover","keywords","browse");
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }
        BaseResult result = new BaseResult();
        result.setData(list);
        return result;
    }
    @RequestMapping(value = "newest", method = RequestMethod.GET)
    @ResponseBody
    public BaseResult newest(PageInfo<Article> pageInfo, ArticleOperator articleOperator) {
        PageInfo list = null;
        try {
            pageInfo.setPageNum(1);
            pageInfo.setPageSize(6);
            articleOperator.setIsaudit(true);
            articleOperator.setIsauditoperator("=");
            list= articleService.pageInfoSimple(pageInfo,articleOperator,Article.class,"id","title","author","createtime","describle","cover","browse");
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }
        BaseResult result = new BaseResult();
        result.setData(list);
        return result;
    }
    @RequestMapping(value = "list/{type}", method = RequestMethod.GET)
    @ResponseBody
    public BaseResult list2(@PathVariable Integer type) {
        List<Article> list = articleService.getByType(type);
        BaseResult result = new BaseResult();
        result.setData(list);
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
            e.printStackTrace();
        }
        return result;
    }

    @RequestMapping(value = "detail", method = RequestMethod.GET)
    @ResponseBody
    public BaseResult detail( Long id) {
        try {
            articleService.updateBrowse(id);
        }catch (Exception e){
            logger.error(e.getMessage());
        }
        Article list = articleService.getById(id);
        BaseResult result = new BaseResult();
        result.setData(list);
        return result;
    }

    @RequestMapping(value = "similar", method = RequestMethod.GET)
    @ResponseBody
    public BaseResult getSimilar( ArticleOperator articleOperator) {
        PageInfo list = null;
        PageInfo<Article> pageInfo = new PageInfo<Article>();
        pageInfo.setPageSize(5);
        pageInfo.setPageNum(1);
        articleOperator.setCatalogoperator("=");
        try {
            articleOperator.setIsaudit(true);
            articleOperator.setIsauditoperator("=");
            list= articleService.pageInfoSimple(pageInfo,articleOperator,Article.class,"id","title","author","createtime","browse");
        } catch (Exception e) {
            e.printStackTrace();
        }
        BaseResult result = new BaseResult();
        result.setData(list.getList());
        return result;
    }


    @RequestMapping(value = "my", method = RequestMethod.GET)
    @ResponseBody
    @Login
    public BaseResult my( PageInfo<Article> pageInfo, ArticleOperator articleOperator) {
        PageInfo list = null;
        pageInfo.setPageSize(10);
        pageInfo.setPageNum(1);
        articleOperator.setAuthorid(getUser().getId());
        articleOperator.setAuthoridoperator("=");
        try {
            list= articleService.pageInfoSimple(pageInfo,articleOperator,Article.class,"id","title","createtime","browse","isaudit");
        } catch (Exception e) {
            e.printStackTrace();
        }
        BaseResult result = new BaseResult();
        result.setData(list);
        return result;
    }


}
