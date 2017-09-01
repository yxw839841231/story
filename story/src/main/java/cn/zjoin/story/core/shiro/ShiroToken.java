package cn.zjoin.story.core.shiro;

import org.apache.shiro.authc.UsernamePasswordToken;

public class ShiroToken extends UsernamePasswordToken  implements java.io.Serializable{
	
	private static final long serialVersionUID = -6451794657814516274L;

	public ShiroToken(String loginname, String password) {
		super(loginname,password);
		this.password = password ;
	}
	
	
	/** 登录密码[字符串类型] 因为父类是char[] ] **/
	private String password ;

	public String getPswd() {
		return password;
	}


	public void setPswd(String pswd) {
		this.password = password;
	}
	
	
	
	
	
}
