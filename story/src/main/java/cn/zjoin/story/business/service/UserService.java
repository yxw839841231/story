/**
 * 美窝云
 * APP服务端
 * 版权所有 2016~ 2017 杭州美窝科技有限公司
 */
package cn.zjoin.story.business.service;

import cn.zjoin.story.base.service.BaseService;
import cn.zjoin.story.business.model.User;

/**
 * Created on 2017/8/29.
 *
 * @auther 地瓜
 */
public abstract class UserService  extends BaseService<User> {
    public abstract User login(User user);
}
