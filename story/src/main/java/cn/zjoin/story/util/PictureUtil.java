package cn.zjoin.story.util;

import java.util.Random;

/**
 * Created by yangxw on 2017/12/20.
 */
public class PictureUtil {



    public static String getPicture(){
        Random ran = new Random();
        int ran2 = ran.nextInt(17);
        String pic="";
        switch (ran2){
            case 0:
                pic = "http://image.story521.cn/picture/pic1.jpg";
                break;
            case 1:
                pic = "http://image.story521.cn/picture/pic2.jpg";
                break;
            case 2:
                pic = "http://image.story521.cn/picture/pic3.jpg";
                break;
            case 3:
                pic = "http://image.story521.cn/picture/pic4.jpg";
                break;
            case 4:
                pic = "http://image.story521.cn/picture/pic5.jpg";
                break;
            case 5:
                pic = "http://image.story521.cn/picture/pic6.jpeg";
                break;
            case 6:
                pic = "http://image.story521.cn/picture/pic7.jpg";
                break;
            case 7:
                pic = "http://image.story521.cn/picture/pic8.jpeg";
                break;
            case 8:
                pic = "http://image.story521.cn/picture/pic9.png";
                break;
            case 9:
                pic = "http://image.story521.cn/picture/pic10.jpg";
                break;

            case 10:
                pic = "http://image.story521.cn/picture/pic11.gif";
                break;

            case 11:
                pic = "http://image.story521.cn/picture/pic12.jpeg";
                break;
            case 12:
                pic = "http://image.story521.cn/picture/pic13.jpg";
                break;
            case 13:
                pic = "http://image.story521.cn/picture/pic14.jpeg";
                break;
            case 14:
                pic = "http://image.story521.cn/picture/pic15.png";
                break;
            case 15:
                pic = "http://image.story521.cn/picture/pic16.jpeg";
                break;
            default:
                pic = "http://image.story521.cn/picture/pic17.jpeg";
                break;

        }
        return pic;
    }

    public static void main(String[] args) {
        for(int i =0;i<50;i++){
            System.out.println(getPicture());
        }
    }


}
