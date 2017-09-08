/**
 * 美窝云
 * APP服务端
 * 版权所有 2016~ 2017 杭州美窝科技有限公司
 */
package cn.zjoin.story.base.dao;

import org.apache.ibatis.annotations.SelectProvider;
import tk.mybatis.mapper.provider.base.BaseSelectProvider;

import java.util.List;

/**
 * Created on 2017/9/4.
 *
 * @auther 地瓜
 */
public interface  PaginationMapper<T> {
    @SelectProvider(type = BaseSelectProvider.class, method = "dynamicSQL")
    List<T> queryByPage (Object object);

}
