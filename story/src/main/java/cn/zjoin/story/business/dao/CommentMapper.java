package cn.zjoin.story.business.dao;

import cn.zjoin.story.business.model.Comment;
import cn.zjoin.story.business.model.view.ViewComment;
import cn.zjoin.story.business.model.view.ViewCommentArticle;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

public interface CommentMapper extends Mapper<Comment> {
    List<ViewCommentArticle> maxCommentArticle();
    List<ViewCommentArticle> maxDzArticle();
    void dz(Long id);
    List<ViewComment> getArticleCommentList(Long id);
}