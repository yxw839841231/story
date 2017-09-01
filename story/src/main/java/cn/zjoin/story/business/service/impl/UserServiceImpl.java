/**
 * 美窝云
 * APP服务端
 * 版权所有 2016~ 2017 杭州美窝科技有限公司
 */
package cn.zjoin.story.business.service.impl;

import cn.zjoin.story.business.model.User;
import cn.zjoin.story.business.service.UserService;
import org.springframework.stereotype.Service;

/**
 * Created on 2017/8/29.
 *
 * @auther 地瓜
 */
@Service("userService")
public class UserServiceImpl extends UserService {
    @Override
    public User login(User user){
        return mapper.selectOne(user);
    }
}
