package cn.zjoin.story.util;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import sun.misc.BASE64Encoder;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.Hashtable;

/**
 * Created by yangxw on 2017/12/12.
 */
public class QRCodeUtil {
    /**
     * 二维码生成器
     */
    @SuppressWarnings({"unchecked", "rawtypes", "restriction"})
    public static String createQRCode(String url) {
        Hashtable hints = new Hashtable();
        hints.put(EncodeHintType.CHARACTER_SET, "utf-8");
        String binary = null;

        try {
            BitMatrix bitMatrix = new MultiFormatWriter().encode(
                    url, BarcodeFormat.QR_CODE, 200, 200, hints);

            // 实现一： 输出图片到指定目录
            // File outputFile = new File("d://1.jpg");
            //        MatrixToImageWriter.writeToFile(bitMatrix, "png", outputFile);

            // 实现二：生成二维码图片并将图片转为二进制传递给前台
            // 1、读取文件转换为字节数组
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            BufferedImage image = toBufferedImage(bitMatrix);

            ImageIO.write(image, "png", out);
            byte[] bytes = out.toByteArray();

            // 2、将字节数组转为二进制
            BASE64Encoder encoder = new BASE64Encoder();
            binary = encoder.encodeBuffer(bytes).trim();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return binary;
    }

    // 其他调用方法
    private static BufferedImage toBufferedImage(BitMatrix matrix) {
        int width = matrix.getWidth();
        int height = matrix.getHeight();
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        for (int x = 0; x < width; x++) {
            for (int y = 0; y < height; y++) {
                image.setRGB(x, y, matrix.get(x, y) ? 0xFF000000 : 0xFFFFFFFF);
            }
        }

        return image;
    }
}
