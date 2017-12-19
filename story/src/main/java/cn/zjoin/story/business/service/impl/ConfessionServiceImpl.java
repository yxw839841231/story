/**
 * 美窝云
 * APP服务端
 * 版权所有 2016~ 2017 杭州美窝科技有限公司
 */
package cn.zjoin.story.business.service.impl;

import cn.zjoin.story.business.dao.ConfessionMapper;
import cn.zjoin.story.business.model.Article;
import cn.zjoin.story.business.model.Confession;
import cn.zjoin.story.business.service.ConfessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import tk.mybatis.mapper.entity.Condition;

import java.util.List;

/**
 * Created on 2017/8/29.
 *
 * @auther 地瓜
 */
@Service("confessionService")
public class ConfessionServiceImpl extends ConfessionService {

    @Autowired
    private ConfessionMapper mapper;

    @Transactional
    @Override
    public void audit(Confession confession){
        mapper.updateByPrimaryKeySelective(confession);
    }



    public void updateBrowse(Long id) {
       // mapper.updateBrowse(id);
    }

    public int insert(Confession confession) {

        if (StringUtils.isEmpty(confession.getId())){
            confession.setId(getUUID());
        }
        return mapper.insertSelective(confession);

    }
}
