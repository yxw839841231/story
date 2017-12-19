package cn.zjoin.story.core.shiro;


import cn.zjoin.story.business.model.User;
import cn.zjoin.story.business.service.UserService;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.SimplePrincipalCollection;

import javax.annotation.Resource;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by DavidWang on 16/7/21.
 */
public class UserRealm extends AuthorizingRealm {

    @Resource
    private UserService userService;

    /**
     * 用于的权限的认证。
     * @param principalCollection
     * @return
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo() ;
        User tuser = null;//TokenManager.getToken();
        String roleid = "";//tuser.getTuserside().getRoleid();
        Set<String> permissions = new HashSet<String>();
//        String[] idArray = new String[]{};
//        if(StringUtils.contains(roleid, ",")){
//            idArray = roleid.split(",");
//        }else{
//            idArray = new String[]{roleid};
//        }
//        for (String id : idArray){
//            permissions.add(id);
//        }
//        Set<String> permissions = t_userService.findPermissions(username) ;
//        info.setRoles(permissions);
//        info.setStringPermissions(permissions);
        return info;
    }

    /**
     * 首先执行这个登录验证
     * @param authcToken
     * @return
     * @throws AuthenticationException
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authcToken)
              {
        ShiroToken token = (ShiroToken) authcToken;
        String login_name = token.getUsername();
        String password = token.getPswd();
        User user = new User();
        user.setLoginpass(password);
        user.setLoginname(login_name);
        if (token.getCanback()){
            user.setCanback(true);
        }
        try {
            user =userService.login(user) ;
            if(null == user){
                throw new AccountException("帐号或密码不正确！");
            }else if(!user.getIsactive()){
                throw new DisabledAccountException("帐号已经禁止登录！");
            }else{
                //更新登录时间 last login time
//            user.setLastLoginTime(user.getLoginTime());
//            user.setLoginTime(DateUtil.dateToStringWithTime());
//            userService.updateByPrimaryKeySelective(user);
            }

        }catch (AuthenticationException e){

            throw new AuthenticationException("授权失败！");
        }

        return new SimpleAuthenticationInfo(user,user.getLoginpass(),getName());
    }

    /**
     * 清空当前用户权限信息
     */
    public  void clearCachedAuthorizationInfo() {
        PrincipalCollection principalCollection = SecurityUtils.getSubject().getPrincipals();
        SimplePrincipalCollection principals = new SimplePrincipalCollection(
                principalCollection, getName());
        super.clearCachedAuthorizationInfo(principals);
    }
    /**
     * 指定principalCollection 清楚
     */
    public void clearCachedAuthorizationInfo(PrincipalCollection principalCollection) {
        SimplePrincipalCollection principals = new SimplePrincipalCollection(
                principalCollection, getName());
        super.clearCachedAuthorizationInfo(principals);
    }

}
