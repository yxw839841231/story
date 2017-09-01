/**
 * 美窝云
 * APP服务端
 * 版权所有 2016~ 2017 杭州美窝科技有限公司
 */
package cn.zjoin.story.business.controller.story;

import cn.zjoin.story.base.controller.BaseController;
import cn.zjoin.story.base.model.BaseResult;
import cn.zjoin.story.base.model.Pagination;
import cn.zjoin.story.business.model.Article;
import cn.zjoin.story.business.service.ArticleService;
import cn.zjoin.story.util.QiNiuUtil;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
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
@RequestMapping(value = "/story/article", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class ArticleStoryController extends BaseController {

    @Resource
    private ArticleService articleService;

    @RequestMapping("")
    public String index() {
        return "story/index";
    }


    @RequestMapping(value = "list", method = RequestMethod.GET)
    @ResponseBody
    public Pagination list(Pagination pagination) {
        Pagination p = articleService.pageInfoSimple(pagination);
        p.setCode(0);
        p.setMsg("ok");
        return p;
    }

    @RequestMapping("add")
    @ResponseBody
    public BaseResult add(Article article) {
        BaseResult result = new BaseResult();
        article.setAuthor(getUser().getNickname());
        article.setAuthorid(getUser().getId());
        article.setCreatetime(new Date());
        if (StringUtils.isEmpty(article.getCover())) {
            try {
                String path = QiNiuUtil.uploadAndCreateImage(article.getKeywords());
                article.setCover(path);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        try {
            articleService.insert(article);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }
}
