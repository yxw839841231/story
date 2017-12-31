package cn.zjoin.story.util;

/**
 * Created by yangxw on 2017/12/29.
 */
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Date;
import java.util.Properties;

/**
 * JavaMail 版本: 1.6.0
 * JDK 版本: JDK 1.7 以上（必须）
 */
public class MailUtil {

    private static final String from = "story@story521.cn";
    private static final String tocken = "utcdhighlixebfde";

    private static final String myEmailSMTPHost = "smtp.qq.com";
    private static final String smtpPort = "465";

    public static void send(String subject,String content,String to) throws Exception {
        // 1. 创建参数配置, 用于连接邮件服务器的参数配置
        Properties props = new Properties();                    // 参数配置
        props.setProperty("mail.transport.protocol", "smtp");   // 使用的协议（JavaMail规范要求）
        props.setProperty("mail.smtp.host", myEmailSMTPHost);   // 发件人的邮箱的 SMTP 服务器地址
        props.setProperty("mail.smtp.auth", "true");            // 需要请求认证


        props.setProperty("mail.smtp.port", smtpPort);
        props.setProperty("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        props.setProperty("mail.smtp.socketFactory.fallback", "false");
        props.setProperty("mail.smtp.socketFactory.port", smtpPort);


        Session session = Session.getInstance(props);
        session.setDebug(true);                                 // 设置为debug模式, 可以查看详细的发送 log
        MimeMessage message = createMimeMessage(session,subject,content,to);
        Transport transport = session.getTransport();
        transport.connect(from, tocken);
        transport.sendMessage(message, message.getAllRecipients());
        transport.close();
    }

    public static void main(String[] args) throws Exception {
        send("邮件验证","<font color='red'><b>536782</b></font>","zhonyangxiaowei@qq.com");
    }

    /**
     * 创建一封只包含文本的简单邮件
     *
     * @param session 和服务器交互的会话
     * @return
     * @throws Exception
     */
    private static MimeMessage createMimeMessage(Session session,String subject,String content,String to ) throws Exception {
        MimeMessage message = new MimeMessage(session);
        message.setFrom(new InternetAddress(from, "记忆的尽头是故事", "UTF-8"));
        message.setRecipient(MimeMessage.RecipientType.TO, new InternetAddress(to, "您好！", "UTF-8"));
        message.setSubject(subject, "UTF-8");
        message.setContent(content, "text/html;charset=UTF-8");
        message.setSentDate(new Date());
        message.saveChanges();
        return message;
    }

}