/**
 * 美窝云
 * APP服务端
 * 版权所有 2016~ 2017 杭州美窝科技有限公司
 */
package cn.zjoin.story.business.service.impl;

import cn.zjoin.story.business.model.Article;
import cn.zjoin.story.business.service.ArticleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created on 2017/8/29.
 *
 * @auther 地瓜
 */
@Service("articleService")
public class ArticleServiceImpl extends ArticleService {

    @Transactional
    @Override
    public void audit(Article article){
        article.setIsaudit(Boolean.TRUE);
        mapper.updateByPrimaryKeySelective(article);
    }
}
