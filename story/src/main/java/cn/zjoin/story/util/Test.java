package cn.zjoin.story.util;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by yangxw on 2017/12/13.
 */
public class Test {
    static Map<String,String> map = new HashMap<String,String>();
    static {
        map.put("0","7890123");
        map.put("1","8701234");
        map.put("2","9012345");
        map.put("3","0123456");
        map.put("4","1234567");
        map.put("5","2345678");
        map.put("6","3456789");
        map.put("7","4567890");
        map.put("8","5678901");
        map.put("9","6789012");
    }

    public static void main(String[] args) {

        try {
            // read file content from file
            StringBuffer sb = new StringBuffer("");

            FileReader reader = new FileReader("/opt/ssc/cqssc.txt");
            BufferedReader br = new BufferedReader(reader);

            String str = null;

            List<String> list = new ArrayList<String>(10000);
            while ((str = br.readLine()) != null) {
                list.add(str.replace(" ","").substring(14));
            }


            // write string to file
            FileWriter writer = new FileWriter("/opt/ssc/cqssc2.txt");
            BufferedWriter bw = new BufferedWriter(writer);



            br.close();
            reader.close();
            Map<Integer,Integer> map2 = new HashMap<Integer, Integer>();
            int c=0,c1=0,c2=0;
            int flag =0;
            int flag2 = 0;
            StringBuilder sb2 = new StringBuilder();
            for (int i=0;i<list.size()-2;i++){
                c=c+1;
                int a = comparedata(list.get(i),list.get(i+1));
                if(a==0) {
                    sb2 = sb2.append(list.get(i)+"  错\n");
                    c2=c2+1;
                    if (flag>flag2) flag2=flag;
                    merge(map2,flag);
                    flag=0;
                }
                else {
                    sb2 = sb2.append(list.get(i)+"  对对对对对对\n");
                    c1=c1+1;
                    flag=flag+1;
                }
            }

            bw.write(sb2.toString());

            bw.close();
            writer.close();
            System.out.println(c);
            System.out.println(c1);
            System.out.println(c2);
            System.out.println(flag2);

            System.out.println("------------");
            for (Integer i:map2.keySet()){
                System.out.print(i + " = "+ map2.get(i)+" | ");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    private static void merge(Map<Integer,Integer> map,int i){
        if (map.containsKey(i)){
            map.put(i,map.get(i)+1);
        }else {
            map.put(i,1);
        }

    }




    private static int comparedata(String s1,String s2){
        String s11 = s1.substring(0,1);
        String s12 = s1.substring(1);
        String s21 = s2.substring(0,1);
        String s22 = s2.substring(1);
        if (map.get(s11).contains(s21) && map.get(s12).contains(s22)) {
            return 1;
        }else {
            return 0;

        }



    }
}
