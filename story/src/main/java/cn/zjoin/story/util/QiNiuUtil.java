/**
 * 美窝云
 * APP服务端
 * 版权所有 2016~ 2017 杭州美窝科技有限公司
 */
package cn.zjoin.story.util;

import com.qiniu.common.QiniuException;
import com.qiniu.common.Zone;
import com.qiniu.http.Response;
import com.qiniu.storage.Configuration;
import com.qiniu.storage.UploadManager;
import com.qiniu.util.Auth;
import org.springframework.util.StringUtils;

import java.io.File;
import java.io.IOException;

import static cn.zjoin.story.util.TimeUtil.getTimeString;

/**
 * Created on 2017/5/3.
 *
 * @auther 地瓜
 */
public class QiNiuUtil {
    private static String ACCESS_KEY = "4MXTGV5qvvYhj6qdlIv92SdX8pLMxClncrXhG6I0";
    private static String SECRET_KEY = "AJzCT3at2wQDbf8LITVqZr-YRm_I3JQdRBCgcAHY";

    private static String DOMAIN = "http://image.story521.cn/";
    //要上传的空间
    private static String bucketname = "story";

    //简单上传，使用默认策略，只需要设置上传的空间名就可以了
    public static String getUpToken() {
        Auth auth = Auth.create(ACCESS_KEY, SECRET_KEY);
        if (auth != null) {
            return auth.uploadToken(bucketname);
        } else {
            return null;
        }
    }

    public static String uploadAndCreateImage(String str) throws IOException {
        if (StringUtils.isEmpty(str)) str = "暂无封面";
        String fileName = getTimeString();
        UploadManager uploadManager = new UploadManager(new Configuration(Zone.autoZone()));
        String filePath = null;
        try {
            String path = CreateImageUtil.createImage(str);
            //调用put方法上传
            uploadManager.put(path, fileName, getUpToken());
            filePath = DOMAIN + fileName;
        } catch (QiniuException e) {
            Response r = e.response;
            // 请求失败时打印的异常的信息
            //System.out.println(r.toString());
            try {
                //响应的文本信息
                System.out.println(r.bodyString());
            } catch (QiniuException e1) {
                //ignore
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            File file = new File(CreateImageUtil.FILE_PATH);
            if (file.exists()) file.delete();
        }
        return filePath;
    }
}
