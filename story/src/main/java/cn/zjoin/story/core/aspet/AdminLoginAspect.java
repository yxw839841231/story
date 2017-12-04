package cn.zjoin.story.core.aspet;

import cn.zjoin.story.base.model.BaseResult;
import cn.zjoin.story.business.model.User;
import cn.zjoin.story.core.shiro.TokenManager;
import com.alibaba.fastjson.JSONObject;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.util.Date;
import java.util.Random;

/**
 * 服务请求拦截
 * <p/>
 * Created by yaojie.cao on 17/07/11.
 */
@Aspect
@Component
public class AdminLoginAspect {
    private static final Logger logger = LoggerFactory.getLogger(AdminLoginAspect.class);
    private static final Logger defaultLogger = LoggerFactory.getLogger("PRIVATEREQUEST-DEFAULT");
    private static final Logger digestLogger = LoggerFactory.getLogger("PRIVATEREQUEST-DIGEST");


    @Pointcut("execution(public * cn.zjoin.story.business.controller.admin.*.*(..))")
    private void allMethod() {
    }



    @Around("allMethod()")
    public Object doAround(ProceedingJoinPoint call) throws Throwable {
        if (call.getArgs().length == 0) {
            //return call.proceed();
        }

        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String reqParams = JSONObject.toJSONString(call.getArgs());
        String api = request.getRequestURI();

        String reqId = getRandom(10);
        String ip = getIpAddress(request);
        defaultLogger.info("[" + reqId + ",REQUEST]" + api + "," + ip + "[" + reqParams + "]");
        Date startDate = new Date();
        boolean requestResult = false;

        try {
            User user =  TokenManager.getToken();
            if(user==null){
                return new BaseResult(-10000,"未登录",null);
            }

            //3.请求处理
            Object object = call.proceed();
            defaultLogger.info("[" + reqId + ",PRIVATERESPONSE]" + JSONObject.toJSONString(object));
            requestResult = true;


            return object;
        } catch (Exception e) {
            logger.error("服务请求处理异常", e);
            return new BaseResult(500,e.getMessage());
        } finally {
            Date endDate = new Date();
            long runTime = endDate.getTime() - startDate.getTime();
            String log = String.format("[%s]PRIVATEPERFORMANCE:%s,%s,%sms", reqId, api, requestResult, runTime);
            digestLogger.info(log);
        }
    }

    private <T extends Annotation> T getAnnotation(ProceedingJoinPoint jp, Class<T> clazz) {
        MethodSignature joinPointObject = (MethodSignature) jp.getSignature();
        Method method = joinPointObject.getMethod();
        return method.getAnnotation(clazz);
    }

    private static String getIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("x-forwarded-for");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }

    private static Random random = new Random();

    private static String getRandom(int length) {
        StringBuilder ret = new StringBuilder();

        for (int i = 0; i < length; ++i) {
            boolean isChar = random.nextInt(2) % 2 == 0;
            if (isChar) {
                int choice = random.nextInt(2) % 2 == 0 ? 65 : 97;
                ret.append((char) (choice + random.nextInt(26)));
            } else {
                ret.append(Integer.toString(random.nextInt(10)));
            }
        }

        return ret.toString();
    }


}
