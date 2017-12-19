/**
 * 美窝云
 * APP服务端
 * 版权所有 2016~ 2017 杭州美窝科技有限公司
 */
package cn.zjoin.story.business.service;

import cn.zjoin.story.base.service.BaseService;
import cn.zjoin.story.business.model.Confession;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created on 2017/8/29.
 *
 * @auther 地瓜
 */
public abstract class ConfessionService extends BaseService<Confession> {



    @Transactional
    public abstract void audit(Confession confession);


    @Transactional
    public abstract void updateBrowse(Long id);
}
