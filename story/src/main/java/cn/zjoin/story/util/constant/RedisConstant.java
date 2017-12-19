package cn.zjoin.story.util.constant;

/**
 * Created by digua on 2016/9/8.
 */
public class RedisConstant {

    /**
     * 用户Token 失效时间
     */
    public static final Long USER_TOKEN_EXRIRARION  = 60L * 60 * 24 *40 ;

    public static final int EXP_WEEKDAY = 60 * 60 * 24 * 7;//7天

    public static final int EXP_DAY = 60 * 60 * 24;//1天

    public static final int EXP_HOUR = 60 * 60 ;//1小时

    public static final int EXP_HOUR_HALF = 60 * 30;//30分钟

    /**
     * 部门缓存前缀
     */
    public static String USER_DEPARTMENT_PREFIX = "dep_";


    /**
     * 组织缓存前缀
      */
    public static String USER_ORGNIZATION_PREFIX = "org_";

    public static String JOBSDETAIL = "jobsdetail_:";

    /**
     * 角色菜单
     */
    public static String ROLEDARA = "roledata:";

    /**
     * 角色权限
     */
    public static String ROLERIGHT = "rightdata:";
    /**
     * 访问令牌
     */
    public static String TOKEN = "token:";

    public static String LOGIN_B = "login-B:";
    public static String LOGIN_C = "login-C:";

    public static String PACKAGE = "package:";
    /**
     * 监听键空间和键事件的所有情况
     */
    public static String LISTEN_CHANNEL = "__key*@*";

    public static String REDIS_HOST;

    public static Integer REDIS_PORT;

    public static Integer REDIS_TIMEOUR;

    public static String REDIS_PASSWORD;

    public static String SYSTEM_MENU = "sys-menu";


}
