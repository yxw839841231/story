package cn.zjoin.story.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

/**
 * Created by DavidWang on 16/8/11.
 */
public class TimeUtil {

    public static String getTimeString(){
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd-HHmmss");
        return sdf.format(new Date());
    }

    public static String getCodingDate() {

        String date = null;
        Calendar calendar = new GregorianCalendar();
        String YEAR = String.valueOf(calendar.get(Calendar.YEAR));
        String MONTH = String.format("%02d", calendar.get(Calendar.MONTH) + 1);
        //String DAY_OF_MONTH = String.format("%02d",calendar.get(Calendar.DAY_OF_MONTH));

        YEAR = YEAR.substring(YEAR.length() - 2, YEAR.length());
        date = YEAR + MONTH;//+DAY_OF_MONTH;

        return date;
    }

    public static Date getCurrentMounth0() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Calendar cal = Calendar.getInstance();
        cal.set(cal.get(Calendar.YEAR), cal.get(Calendar.MONDAY), cal.get(Calendar.DAY_OF_MONTH), 0, 0, 0);
        cal.set(Calendar.DAY_OF_MONTH, cal.getActualMinimum(Calendar.DAY_OF_MONTH));
        return cal.getTime();
    }

    /**
     * 获取当月第一天0点时间字符串
     *
     * @return
     */
    public static String getCurrentMounth() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
        Calendar cal = Calendar.getInstance();
        cal.set(cal.get(Calendar.YEAR), cal.get(Calendar.MONDAY), cal.get(Calendar.DAY_OF_MONTH), 0, 0, 0);
        cal.set(Calendar.DAY_OF_MONTH, cal.getActualMinimum(Calendar.DAY_OF_MONTH));
        return sdf.format(cal.getTime());
    }

    /**
     * 获取当月第一天0点时间字符串
     *
     * @return
     */
    public static String getCurrentMounth0String() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Calendar cal = Calendar.getInstance();
        cal.set(cal.get(Calendar.YEAR), cal.get(Calendar.MONDAY), cal.get(Calendar.DAY_OF_MONTH), 0, 0, 0);
        cal.set(Calendar.DAY_OF_MONTH, cal.getActualMinimum(Calendar.DAY_OF_MONTH));
        return sdf.format(cal.getTime());
    }

    public static Date getCurrentMounth1() {
        Calendar cal = Calendar.getInstance();
        cal.set(cal.get(Calendar.YEAR), cal.get(Calendar.MONDAY), cal.get(Calendar.DAY_OF_MONTH), 0, 0, 0);
        cal.set(Calendar.DAY_OF_MONTH, cal.getActualMaximum(Calendar.DAY_OF_MONTH));
        cal.set(Calendar.HOUR_OF_DAY, 24);
        return cal.getTime();
    }

    /**
     * 获取当月最后一天23时59分59秒时间字符串
     *
     * @return
     */
    public static String getCurrentMounth1String() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Calendar cal = Calendar.getInstance();
        cal.set(cal.get(Calendar.YEAR), cal.get(Calendar.MONDAY), cal.get(Calendar.DAY_OF_MONTH), 0, 0, 0);
        cal.set(Calendar.DAY_OF_MONTH, cal.getActualMaximum(Calendar.DAY_OF_MONTH));
        cal.set(Calendar.HOUR_OF_DAY, 24);
        return sdf.format(cal.getTime());
    }

    /**
     * 获取当天0点
     *
     * @return
     */
    public static String getTodayStarttime() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Calendar cal = Calendar.getInstance();
        cal.set(cal.get(Calendar.YEAR), cal.get(Calendar.MONDAY), cal.get(Calendar.DAY_OF_MONTH), 0, 0, 0);
        return sdf.format(cal.getTime());
    }

    /**
     * 获取当天23:59:59
     * @return
     */
    public static String getTodayEndtime() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Calendar cal = Calendar.getInstance();
        cal.set(cal.get(Calendar.YEAR), cal.get(Calendar.MONDAY), cal.get(Calendar.DAY_OF_MONTH), 0, 0, 0);
        cal.set(Calendar.HOUR_OF_DAY, 24);
        return sdf.format(cal.getTime());
    }

    /**
     * 获取本周第一天
     * @return
     */
    public static String getCurrentWeek0() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Calendar cal = Calendar.getInstance();
        int min = cal.getActualMinimum(Calendar.DAY_OF_WEEK); //获取周开始基准
        int current = cal.get(Calendar.DAY_OF_WEEK); //获取当天周内天数
        cal.add(Calendar.DAY_OF_WEEK, min - current); //当天-基准，获取周开始日期
        cal.set(cal.get(Calendar.YEAR), cal.get(Calendar.MONDAY), cal.get(Calendar.DAY_OF_MONTH), 0, 0, 0);
        return sdf.format(cal.getTime());

    }
    /**
     * 获取本周最后一天
     * @return
     */
    public static String getCurrentWeek1() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Calendar cal = Calendar.getInstance();
        int min = cal.getActualMinimum(Calendar.DAY_OF_WEEK); //获取周开始基准
        int current = cal.get(Calendar.DAY_OF_WEEK); //获取当天周内天数
        cal.add(Calendar.DAY_OF_WEEK, min - current); //当天-基准，获取周开始日期
        cal.set(cal.get(Calendar.YEAR), cal.get(Calendar.MONDAY), cal.get(Calendar.DAY_OF_MONTH), 0, 0, 0);
        cal.add(Calendar.DAY_OF_WEEK, 6); //开始+6，获取周结束日期
        cal.set(cal.get(Calendar.YEAR), cal.get(Calendar.MONDAY), cal.get(Calendar.DAY_OF_MONTH), 23, 59, 59);
        return sdf.format(cal.getTime());
    }


    /**
     * 获取昨天的这个时间点字符串
     *
     * @return
     */
    public static String getYesterdaynowString() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DATE, -1);
        return sdf.format(cal.getTime());
    }

    /**
     * 获取今天的这个时间点字符串
     *
     * @return
     */
    public static String getTodayString() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Calendar cal = Calendar.getInstance();
        return sdf.format(cal.getTime());
    }

    /**
     * 当前时间的前 ？天
     *
     * @return
     */
    public static Date getPreDate(int day) {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DATE, -day);
        return cal.getTime();
    }

    /**
     * 获取40天工期
     * @return
     */
    public static Date get40day() {
        Calendar cal = Calendar.getInstance();
        for (int i = 1; i < 41; ) {
            cal.add(Calendar.DATE, 1);
            if (cal.getTime().getDay() != 6 && cal.getTime().getDay() != 0) {
                i++;
            }
        }
        return cal.getTime();
    }


    /**
     * 格式化时间字符串
     * @param date
     * @return
     */
    public static String format(Date date) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return sdf.format(date);
    }

    public static String format(Date date, String format) {
        SimpleDateFormat sdf = new SimpleDateFormat(format);
        return sdf.format(date);
    }

    /**
     * 时间字符串转时间
     * @param date
     * @return
     */
    public static Date parseDate(String date){
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            return sdf.parse(date);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
    }
    /**
     * 时间字符串转时间
     * @param date
     * @return
     */
    public static Date parseDate(String date, String format){
        SimpleDateFormat sdf = new SimpleDateFormat(format);
        try {
            return sdf.parse(date);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 获取开工天数
     * @param start
     * @return
     */
    public static int getWorkDays(Date start) {
        int day = 1;
        Date now = new Date();
        Calendar cal = Calendar.getInstance();
        cal.setTime(start);
        while (Integer.parseInt(format(now, "yyyyMMdd")) > Integer.parseInt(format(cal.getTime(), "yyyyMMdd"))) {
            if (cal.getTime().getDay() != 6 && cal.getTime().getDay() != 0) {
                day++;
            }
            cal.add(Calendar.DATE, 1);
        }
        return day;
    }


}
