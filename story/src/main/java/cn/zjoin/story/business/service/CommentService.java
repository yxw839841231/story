/**
 * 美窝云
 * APP服务端
 * 版权所有 2016~ 2017 杭州美窝科技有限公司
 */
package cn.zjoin.story.business.service;

import cn.zjoin.story.base.service.BaseService;
import cn.zjoin.story.business.model.Comment;
import cn.zjoin.story.business.model.view.ViewComment;
import cn.zjoin.story.business.model.view.ViewCommentArticle;

import java.util.List;

/**
 * Created on 2017/8/29.
 *
 * @auther 地瓜
 */
public abstract class CommentService extends BaseService<Comment> {

    public abstract List<ViewCommentArticle> maxCommentArticle();

    public abstract List<ViewCommentArticle> maxDzArticle();

    public abstract void dz(Long id);

    public abstract List<ViewComment> getArticleCommentList(Long id);
}
