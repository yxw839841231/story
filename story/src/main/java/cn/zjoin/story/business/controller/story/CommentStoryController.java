/**
 * 美窝云
 * APP服务端
 * 版权所有 2016~ 2017 杭州美窝科技有限公司
 */
package cn.zjoin.story.business.controller.story;

import cn.zjoin.story.base.controller.BaseController;
import cn.zjoin.story.base.model.BaseResult;
import cn.zjoin.story.business.model.Comment;
import cn.zjoin.story.business.service.CommentService;
import cn.zjoin.story.core.aspet.Login;
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
@RequestMapping(value = "/story/comment", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class CommentStoryController extends BaseController {

    @Resource
    private CommentService commentService;


    @RequestMapping(value = "newest", method = RequestMethod.GET)
    @ResponseBody
    public BaseResult newest() {

        BaseResult result = new BaseResult();
        return result;
    }


    @RequestMapping(value = "add", method = RequestMethod.POST)
    @ResponseBody
    @Login
    public BaseResult add(Comment comment) {
        BaseResult result = new BaseResult();
        comment.setCreatetime(new Date());
        comment.setUserid(getUser().getId());
        commentService.insert(comment);
        getRedisOperationManager().setData("",1);
        return result;
    }

    @RequestMapping(value = "list", method = RequestMethod.GET)
    @ResponseBody
    public BaseResult list(Comment comment) {

        BaseResult result = new BaseResult();
        try {
            result.setData(commentService.getArticleCommentList(comment.getArticleid()));
        }catch (Exception e){
            result.setCode(500);
        }
        return result;
    }


}
