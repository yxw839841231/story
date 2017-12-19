package cn.zjoin.story.business.dao;

import cn.zjoin.story.business.model.Article;
import org.springframework.stereotype.Repository;
import tk.mybatis.mapper.common.Mapper;

@Repository
public interface ArticleMapper extends Mapper<Article> {

    public void updateBrowse(Long id);
}