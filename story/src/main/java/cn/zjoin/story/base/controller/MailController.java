package cn.zjoin.story.base.controller;

import cn.zjoin.story.base.model.BaseResult;
import cn.zjoin.story.business.model.User;
import cn.zjoin.story.business.service.UserService;
import cn.zjoin.story.core.shiro.TokenManager;
import cn.zjoin.story.util.MailUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by yangxw on 2017/12/29.
 */
@RequestMapping("/mail")
@Controller
public class MailController extends BaseController {

    @Autowired
    private UserService userService;

    @ResponseBody
    @RequestMapping(value = "authMail", method = RequestMethod.GET)
    public BaseResult authMail() {
        BaseResult result = new BaseResult();

        try {
            User u = getUser();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
            String time = sdf.format(new Date(System.currentTimeMillis()+17280000));
            String url ="http://www.story521.cn/mail/auth?uid="+u.getId()+"&el="+u.getEmail()+"&time="+time;
            String content = "请点此 <a href ='"+url+"'>验证<a/> 或复制以下下连接在浏览器中打开：<br> "+url +" <br>此连接两天内有效。";
            System.err.println(content);
            MailUtil.send("账号验证",content,u.getEmail());
        }catch (Exception e){
            result.setCode(-1);
            result.setMsg("验证邮件发送失败，请重试！");
        }
        return result;
    }

    @ResponseBody
    @RequestMapping(value = "auth", method = RequestMethod.GET)
    public BaseResult auth(String uid,String el,String time, HttpServletResponse response) {

        BaseResult result = new BaseResult();
        String html = "";
        if(!StringUtils.isEmpty(time) && Long.valueOf(time) < Long.valueOf(new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()))){
            html = "链接已失效！";
        }else {
            User u = userService.getById(Long.valueOf(uid));
            if (u.getEmail().equals(el)) {
                u.setIsauth(true);
                userService.update(u);
                TokenManager.logout();
            }
            html = "       您的邮箱已经成功激活！浏览就即将自动跳转<br>"+
                    "       <a href='http://www.story521.cn'>前往首页</a>";
        }
        response.setContentType("text/html;charset=utf-8");
        try {
            String str = "<!DOCTYPE html>" +
                    "<html lang=\"en\">" +
                    "<head>" +
                    "    <meta charset=\"UTF-8\">" +
                    "    <title>个人中心·邮件验证</title>" +
                    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1\">" +
                    "    <meta name=\"keywords\" content=\"故事,story,story521,说出你的故事,灵魂,回忆\">" +
                    "    <meta name=\"description\" content=\"所谓故事，便已是过去了，然而之所以能成为故事，大概是因为在我们内心深处，有着无法忘却的理由。\">" +
                    "    <link rel=\"shortcut icon\" type=\"image/x-icon\" href=\"http://image.story521.cn/logo48.ico\"/><link rel=\"stylesheet\" href=\"/layui/css/layui2.css\">" +
                    "    <link rel=\"stylesheet\" href=\"/layui/css/common.css\">" +
                    "    <link rel=\"stylesheet\" href=\"/layui/css/story.css\">" +
                    "<script type='text/javascript'>setTimeout(function(){window.location.href='http://www.story521.cn';},5000);</script>"+
                    "</head>"+
                    "<body>" +
                    "<div class=\"layui-layout layui-layout-admin\">" +
                    "    <div class=\"layui-header story-header\">" +
                    "        <ul class=\"layui-nav layui-layout-center\">" +
                    "            <div class=\"story-nav\">" +
                    "                <li class=\"layui-nav-item layui-this\"><a href=\"/\">邮箱验证</a></li>" +
                    "            </div>" +
                    "        </ul>" +
                    "    </div>" +
                    "    <div class=\"layui-container story-container\">" +
                    "        <div class=\"layui-row\" style=\"padding: 5px;line-height:40px;text-align:center;\"> " +
                    html+
                    "        </div>" +
                    "    </div>" +
                    "</div>" +
                    "</body>" +
                    "</html>";
            PrintWriter out = response.getWriter();
            out.print(str);

            //释放资源
            out.flush();
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result;
    }


}