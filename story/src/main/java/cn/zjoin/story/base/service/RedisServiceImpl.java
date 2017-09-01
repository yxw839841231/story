/**
 * 美窝云
 * APP服务端
 * 版权所有 2015~ 2016 杭州美窝科技有限公司
 */
package cn.zjoin.story.base.service;


import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Created on 2016/11/30.
 *
 * @Auther 地瓜
 */

@Service("redisService")
public class RedisServiceImpl extends RedisService {
    //private static RedisOperationManager redisOperationManager = RedisOperationManager.init();


   /* @Autowired
    private RedisCache redisCache;*/

    private Logger logger = Logger.getLogger(RedisServiceImpl.class);


    public Map<Integer, Object> getRoleRightCache(Long roleid, Long menuid) {
        return null;
    }

   /* @Override
    public User getUserCache(String token) {
       // Object object = redisCache.getCache(RedisConstant.TOKEN + token);
        return object != null ? (User) object : null;
    }*/


}
