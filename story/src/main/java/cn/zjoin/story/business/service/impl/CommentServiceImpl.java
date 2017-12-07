/**
 * 美窝云
 * APP服务端
 * 版权所有 2016~ 2017 杭州美窝科技有限公司
 */
package cn.zjoin.story.business.service.impl;

import cn.zjoin.story.business.dao.CommentMapper;
import cn.zjoin.story.business.model.view.ViewComment;
import cn.zjoin.story.business.model.view.ViewCommentArticle;
import cn.zjoin.story.business.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created on 2017/8/29.
 *
 * @auther 地瓜
 */
@Service("commentService")
public class CommentServiceImpl extends CommentService {

    @Autowired
    private CommentMapper mapper;


    @Override
    public List<ViewCommentArticle> maxCommentArticle() {
        return mapper.maxCommentArticle();
    }

    @Override
    public List<ViewCommentArticle> maxDzArticle() {
        return mapper.maxDzArticle();
    }

    public void dz(Long id) {
        mapper.dz(id);
    }

    @Override
    public List<ViewComment> getArticleCommentList(Long id){
        return mapper.getArticleCommentList(id);
    }
}
