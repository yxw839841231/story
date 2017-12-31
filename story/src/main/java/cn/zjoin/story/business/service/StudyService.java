/**
 * 美窝云
 * APP服务端
 * 版权所有 2016~ 2017 杭州美窝科技有限公司
 */
package cn.zjoin.story.business.service;

import cn.zjoin.story.base.service.BaseService;
import cn.zjoin.story.business.model.Study;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

/**
 * Created on 2017/8/29.
 *
 * @auther 地瓜
 */
public abstract class StudyService extends BaseService<Study> {
    @Transactional
    public abstract void updateBrowse(Long id);
    @Transactional
    public abstract void updatePl(Long id);

    public abstract Map<String,Study> getPrevANdNext(Long id,Long userId);
}
