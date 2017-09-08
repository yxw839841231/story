/**
 * 美窝云
 * APP服务端
 * 版权所有 2016~ 2017 杭州美窝科技有限公司
 */
package cn.zjoin.story.business.service;

import cn.zjoin.story.base.service.BaseService;
import cn.zjoin.story.business.model.Article;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created on 2017/8/29.
 *
 * @auther 地瓜
 */
public abstract class ArticleService extends BaseService<Article> {
    @Transactional
    public abstract void audit(Article article);

    public abstract List<Article> getByType(Integer type);
}
