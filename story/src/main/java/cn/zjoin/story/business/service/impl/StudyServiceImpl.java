/**
 * 美窝云
 * APP服务端
 * 版权所有 2016~ 2017 杭州美窝科技有限公司
 */
package cn.zjoin.story.business.service.impl;

import cn.zjoin.story.business.dao.StudyMapper;
import cn.zjoin.story.business.model.Study;
import cn.zjoin.story.business.service.StudyService;
import com.github.pagehelper.PageHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import tk.mybatis.mapper.entity.Example;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created on 2017/8/29.
 *
 * @auther 地瓜
 */
@Service("studyService")
public class StudyServiceImpl extends StudyService {
    @Autowired
    private StudyMapper mapper;

    public void updateBrowse(Long id) {
        mapper.updateBrowse(id);
    }

    public void updatePl(Long id) {
        mapper.updatePl(id);
    }

    @Override
    public Map<String,Study> getPrevANdNext(Long id,Long userId){
        Map<String,Study> map = new HashMap<String, Study>();
        Example example = new Example(Study.class);
        example.createCriteria().andLessThan("id",id).andEqualTo("authorid",userId);
        example.orderBy("id").desc();
        PageHelper.startPage(1,1);
        List<Study> prev = mapper.selectByExample(example);
        if(!CollectionUtils.isEmpty(prev)){
            map.put("prev",prev.get(0));
        }else {
            map.put("prev",null);
        }
        example = new Example(Study.class);
        example.createCriteria().andGreaterThan("id",id).andEqualTo("authorid",userId);
        example.orderBy("id").desc();
        PageHelper.startPage(1,1);
        List<Study> next = mapper.selectByExample(example);
        if(!CollectionUtils.isEmpty(next)){
            map.put("next",next.get(0));
        }else {
            map.put("next",null);
        }
        return map;
    }
}
