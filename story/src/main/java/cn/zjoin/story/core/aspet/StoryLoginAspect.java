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

/**
 * 服务请求拦截
 * <p/>
 * Created by yaojie.cao on 17/07/11.
 */
@Aspect
@Component
public class StoryLoginAspect {
    private static final Logger logger = LoggerFactory.getLogger(StoryLoginAspect.class);


    @Pointcut("@annotation(cn.zjoin.story.core.aspet.Login)")
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

        String ip = getIpAddress(request);
        Date startDate = new Date();
        boolean requestResult = false;

        try {
            User user =  TokenManager.getToken();
            if(user==null){
                return new BaseResult(-10000,"未登录",null);
            }

            //3.请求处理
            Object object = call.proceed();
            requestResult = true;


            return object;
        } catch (Exception e) {
            logger.error("服务请求处理异常", e);
            return new BaseResult(500,e.getMessage());
        } finally {
            Date endDate = new Date();
            long runTime = endDate.getTime() - startDate.getTime();
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




}
