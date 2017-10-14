/**
 * 美窝云
 * APP服务端
 * 版权所有 2016~ 2017 杭州美窝科技有限公司
 */
package cn.zjoin.story.util.constant;

import java.io.*;

/**
 * Created on 2017/9/20.
 *
 * @auther 地瓜
 */
public class SvgUtil {
    public static void main(String[] args) {
       String fileName = "C:/Users/Meivo/Desktop/iconfont.svg";
        File file = new File(fileName);
        BufferedReader reader = null;
        try {
            reader = new BufferedReader(new FileReader(file));
            String tempString = null;
            int line = 1;
            String str = null;
            while ((tempString = reader.readLine()) != null) {
                if(tempString.startsWith("<glyph")) {
                    str = tempString.substring(7,tempString.indexOf("d=")-1);
                    str = str.replace(" ",",");
                    str = str.replace("=",":");
                    String[] arr = str.split(",");
                    String[] arr1 = arr[0].split(":");
                    String[] arr2 = arr[1].split(":");
                    System.out.println("<li title="+arr2[1]+"><i class=\"layui-icon\" data-icon=\""+arr1[1].substring(4,8)+"\">"+arr1[1].substring(1,arr1[1].length()-1)+"</i></li>");
                    line++;
                }
            }
            reader.close();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e1) {
                }
            }
        }
    }
}
