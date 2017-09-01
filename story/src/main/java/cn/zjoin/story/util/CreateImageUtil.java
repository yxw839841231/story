/**
 * 美窝云
 * APP服务端
 * 版权所有 2016~ 2017 杭州美窝科技有限公司
 */
package cn.zjoin.story.util;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.math.BigDecimal;

import static cn.zjoin.story.util.TimeUtil.getTimeString;

/**
 * Created on 2017/7/19.
 * 生成图片工具类
 *
 * @auther 地瓜
 */
public class CreateImageUtil {

    public static final int WIDTH = 900;
    public static final int HEIGHT = 500;
    public static final int FONTSIZE = 100;

    public static final String FILE_PATH = "/tmp/images/";


    public static void main(String[] args) throws Exception {
        createImage("美窝");
    }

    private static String getPath() {
        return FILE_PATH + getTimeString() + ".png";
    }

    // 根据str输出文件目录
    public static String createImage(String str) throws Exception {
        Font font = new Font("微软雅黑", Font.BOLD, FONTSIZE);
        // 创建图片
        BufferedImage image = new BufferedImage(WIDTH, HEIGHT, BufferedImage.TYPE_INT_BGR);
        Graphics g = image.getGraphics();
        g.setClip(0, 0, WIDTH, HEIGHT);
        Color color = new Color(0, 150, 136);
        g.setColor(color);

        g.fillRect(0, 0, WIDTH, HEIGHT);// 填充背景
        g.setColor(Color.white);//设置字体颜色
        g.setFont(font);// 设置画笔字体
        /** 用于获得垂直居中y */
        Rectangle clip = g.getClipBounds();
        FontMetrics fm = g.getFontMetrics(font);
        int ascent = fm.getAscent();
        int descent = fm.getDescent();
        int y = (clip.height - (ascent + descent)) / 2 + ascent;


        /** 获取字符串中的中文字符|标点符号*/
        String regex = "[\u4e00-\u9fff]|[\uFE30-\uFFA0]";
        int count = (" " + str + " ").split(regex).length - 1;
        Double d = new BigDecimal(count + (str.length() - count) / 2.00).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
        Double xx = new BigDecimal((WIDTH - d * 100) / 2.00).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
        int x = Integer.valueOf(xx.toString().substring(0, xx.toString().indexOf(".")));
        g.drawString(str, x, y);
        //g.setColor(Color.red);
        //int h = (HEIGHT - fm.getHeight()) / 2;
        // g.drawLine(x,h,x+600,h);
        //g.drawLine(x, h + fm.getHeight(), x + 600, h + fm.getHeight());
        //g.dispose();
        File dir = new File(FILE_PATH);
        if(!dir.exists()) dir.mkdirs();
        File outFile = new File(getPath());

        ImageIO.write(image, "png", outFile);// 输出png图片
        return getPath();
    }
}
