package cn.zjoin.story.business.dao;

import cn.zjoin.story.business.model.Article;
import cn.zjoin.story.business.model.Comment;
import cn.zjoin.story.business.model.view.ViewComment;
import cn.zjoin.story.business.model.view.ViewCommentArticle;
import org.springframework.stereotype.Repository;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

@Repository
public interface CommentMapper extends Mapper<Comment> {
    List<ViewCommentArticle> maxCommentArticle();
    List<ViewCommentArticle> maxDzArticle();
    void dz(Long id);
    List<ViewComment> getArticleCommentList(Long id);
    List<Article> topBrowseArticle();
}