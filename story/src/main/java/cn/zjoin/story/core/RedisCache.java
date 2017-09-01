package cn.zjoin.story.core;

import org.crazycake.shiro.SerializeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;

import java.util.Set;


/**
 * redis缓存
 * <p>
 * 采用Jedis或Jedis Sentinel
 *
 * @author tudou
 */
//@Component
public class RedisCache {


    public final static String CAHCENAME = "cache";//缓存名

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    public <T> boolean putCache(String key, T obj) {
        final byte[] bkey = key.getBytes();
        final byte[] bvalue = SerializeUtils.serialize(obj);//ProtoStuffSerializerUtil.serialize(obj);
        boolean result = redisTemplate.execute(new RedisCallback<Boolean>() {
            //@Override
            public Boolean doInRedis(RedisConnection connection) throws DataAccessException {
                return connection.setNX(bkey, bvalue);
            }
        });
        return result;
    }

    public <T> void putCacheWithExpireTime(String key, T obj, final long expireTime) {
        final byte[] bkey = key.getBytes();
        final byte[] bvalue = SerializeUtils.serialize(obj);// ProtoStuffSerializerUtil.serialize(obj);
        redisTemplate.execute(new RedisCallback<Boolean>() {
            //@Override
            public Boolean doInRedis(RedisConnection connection) throws DataAccessException {
                connection.setEx(bkey, expireTime, bvalue);
                return true;
            }
        });
    }


    public Object getCache(final String key) {
        byte[] result = redisTemplate.execute(new RedisCallback<byte[]>() {
            //@Override
            public byte[] doInRedis(RedisConnection connection) throws DataAccessException {
                return connection.get(key.getBytes());
            }
        });
        if (result == null) {
            return null;
        }
        return SerializeUtils.deserialize(result);
    }

    public String getString(final String key) {
        byte[] result = redisTemplate.execute(new RedisCallback<byte[]>() {
            //@Override
            public byte[] doInRedis(RedisConnection connection) throws DataAccessException {
                return connection.get(key.getBytes());
            }
        });
        if (result == null) {
            return null;
        }
        return (String) SerializeUtils.deserialize(result);
    }

    public Integer getInt(final String key) {
        byte[] result = redisTemplate.execute(new RedisCallback<byte[]>() {
            //@Override
            public byte[] doInRedis(RedisConnection connection) throws DataAccessException {
                return connection.get(key.getBytes());
            }
        });
        if (result == null) {
            return 1;
        }
        return (Integer) SerializeUtils.deserialize(result);
    }

    public Long getLong(final String key) {
        byte[] result = redisTemplate.execute(new RedisCallback<byte[]>() {
            //@Override
            public byte[] doInRedis(RedisConnection connection) throws DataAccessException {
                return connection.get(key.getBytes());
            }
        });
        if (result == null) {
            return 1L;
        }
        return (Long) SerializeUtils.deserialize(result);
    }


    /**
     * 精确删除key
     *
     * @param key
     */
    public void deleteCache(String key) {
        redisTemplate.delete(key);
    }

    /**
     * 模糊删除key
     *
     * @param pattern
     */
    public void deleteCacheWithPattern(String pattern) {
        Set<String> keys = redisTemplate.keys(pattern);
        redisTemplate.delete(keys);
    }

    /**
     * 清空所有缓存
     */
    public void clearCache() {
        deleteCacheWithPattern(RedisCache.CAHCENAME + "|*");
    }

}
