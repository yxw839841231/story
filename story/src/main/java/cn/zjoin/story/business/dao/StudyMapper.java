package cn.zjoin.story.business.dao;

import cn.zjoin.story.business.model.Study;
import tk.mybatis.mapper.common.Mapper;

public interface StudyMapper extends Mapper<Study> {
    public void updateBrowse(Long id);
    public void updatePl(Long id);
}