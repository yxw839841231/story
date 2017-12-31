package cn.zjoin.story.core.shiro;


import cn.zjoin.story.business.model.User;
import cn.zjoin.story.core.SpringContextUtil;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;


public class TokenManager {
	//用户登录管理
	public final UserRealm realm = SpringContextUtil.getBean("userRealm",UserRealm.class);
	/**
	 * 获取当前登录的用户User对象
	 * @return
	 */
	public static User getToken(){
		User token = (User)SecurityUtils.getSubject().getPrincipal();
		return token ;
	}

	/**
	 * 获取当前用户的Session
	 * @return
	 */
	public static Session getSession(){
		return SecurityUtils.getSubject().getSession();
	}

	/**
	 * 获取当前用户NAME
	 * @return
	 */
	public static String getNickname(){
		return getToken().getLoginname();
	}

	public static String getFlowername(){
		return getToken().getNickname();
	}

	/**
	 * 获取当前用户ID
	 * @return
	 */
	public static Long getUserId(){
		return getToken()==null?null:getToken().getId();
	}
	/**
	 * 把值放入到当前登录用户的Session里
	 * @param key
	 * @param value
	 */
	public static void setVal2Session(Object key , Object value){
		getSession().setAttribute(key, value);
	}
	/**
	 * 从当前登录用户的Session里取值
	 * @param key
	 * @return
	 */
	public static Object getVal2Session(Object key){
		return getSession().getAttribute(key);
	}
	/**
	 * 获取验证码，获取一次后删除
	 * @return
	 */
	public static String getYZM(){
		String code = (String) getSession().getAttribute("CODE");
		getSession().removeAttribute("CODE");
		return code ;
	}

	/**
	 * 登录
	 * @param user
	 * @param rememberMe
	 * @return
	 */
	public static User login(User user, Boolean rememberMe){
		ShiroToken token = new ShiroToken(user.getLoginname(), user.getLoginpass(),false);
		token.setRememberMe(rememberMe);
		SecurityUtils.getSubject().login(token);
		return getToken();
	}
	public static User login(User user, Boolean rememberMe,Boolean canback){
		ShiroToken token = new ShiroToken(user.getLoginname(), user.getLoginpass(),canback);
		token.setRememberMe(rememberMe);
		SecurityUtils.getSubject().login(token);
		return getToken();
	}

	public static User login(User user, Boolean rememberMe, String host){
		ShiroToken token = new ShiroToken(user.getLoginname(), user.getLoginpass());
		token.setRememberMe(rememberMe);
		token.setHost(host);
		SecurityUtils.getSubject().login(token);
		return getToken();
	}

	/**
	 * 判断是否登录
	 * @return
	 */
	public static boolean isLogin() {
		return null != SecurityUtils.getSubject().getPrincipal();
	}
	/**
	 * 退出登录
	 */
	public static void logout() {
		SecurityUtils.getSubject().logout();
	}


}
