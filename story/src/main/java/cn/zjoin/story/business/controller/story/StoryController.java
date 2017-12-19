/**
 * 美窝云
 * APP服务端
 * 版权所有 2016~ 2017 杭州美窝科技有限公司
 */
package cn.zjoin.story.business.controller.story;

import cn.zjoin.story.base.controller.BaseController;
import cn.zjoin.story.base.model.BaseResult;
import cn.zjoin.story.business.model.Carousel;
import cn.zjoin.story.business.model.Comment;
import cn.zjoin.story.business.service.CarouselService;
import cn.zjoin.story.business.service.CommentService;
import cn.zjoin.story.core.aspet.Login;
import cn.zjoin.story.util.word.WordGenerator;
import org.apache.log4j.Logger;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import tk.mybatis.mapper.entity.Example;

import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * Created on 2017/8/29.
 *
 * @auther 地瓜
 */
@Controller
@RequestMapping(value = "/story", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class StoryController extends BaseController {
    Logger logger = Logger.getLogger(StoryController.class);

    @Resource
    CarouselService carouselService;

    @Resource
    CommentService commentService;

    @RequestMapping(value = "carousel", method = RequestMethod.POST)
    @ResponseBody
    public BaseResult carousel(Integer catalog) {
        BaseResult result = new BaseResult();
        Example example = new Example(Carousel.class);
        example.createCriteria().andEqualTo("isdelete",false).andEqualTo("catalog",catalog);
        result.setData(carouselService.getByExample(example));
        return result;
    }
    @RequestMapping(value = "word", method = RequestMethod.GET)
    public void genWord(HttpServletResponse resp)throws ServletException, IOException {
        File file = null;
        InputStream fin = null;
        ServletOutputStream out = null;
        Map<String,Object> map = new HashMap<String, Object>();
        map.put("title","个人简历");
        map.put("name","老王");
        map.put("age","25");
        map.put("sex","男");
        map.put("major","计算机科学与技术");
        map.put("school","浙江大学");
        try {
            // 调用工具类WordGenerator的createDoc方法生成Word文档
            file = WordGenerator.createDoc(map, "word");
            fin = new FileInputStream(file);

            resp.setCharacterEncoding("utf-8");
            resp.setContentType("application/msword");
            // 设置浏览器以下载的方式处理该文件默认名为resume.doc
            resp.addHeader("Content-Disposition", "attachment;filename=个人简历.doc");

            out = resp.getOutputStream();
            byte[] buffer = new byte[512];  // 缓冲区
            int bytesToRead = -1;
            // 通过循环将读入的Word文件的内容输出到浏览器中
            while((bytesToRead = fin.read(buffer)) != -1) {
                out.write(buffer, 0, bytesToRead);
            }
        } finally {
            if(fin != null) fin.close();
            if(out != null) out.close();
            if(file != null) file.delete(); // 删除临时文件
        }
    }


    /**
     * 获取近期热议评论的文章
     * @return
     */
    @RequestMapping(value = "maxCommentArticle", method = RequestMethod.GET)
    @ResponseBody
    public BaseResult maxCommentArticle() {
        BaseResult result = new BaseResult();
        result.setData(commentService.maxCommentArticle());
        return result;
    }


    /**
     * 获取近期热议评论的文章
     * @return
     */
    @RequestMapping(value = "maxDzArticle", method = RequestMethod.GET)
    @ResponseBody
    public BaseResult maxDzArticle() {
        BaseResult result = new BaseResult();
        try {
            result.setData(commentService.maxDzArticle());
        }catch (Exception e){
            logger.error(e.getMessage());
            result.setCode(-1);
        }
        return result;
    }

    /**
     * 获取近期热议评论的文章
     * @return
     */
    @RequestMapping(value = "topBrowse", method = RequestMethod.GET)
    @ResponseBody
    public BaseResult topBrowse() {
        BaseResult result = new BaseResult();
        try {
            result.setData(commentService.topBrowseArticle());
        }catch (Exception e){
            logger.error(e.getMessage());
            result.setCode(-1);
        }
        return result;
    }

    @RequestMapping(value = "comment/dz", method = RequestMethod.POST)
    @ResponseBody
    @Login
    public BaseResult dz(Comment comment) {

        BaseResult result = new BaseResult();
        try {
            commentService.dz(comment.getId());
        }catch (Exception e){
            logger.error(e.getMessage());
            result.setCode(500);
        }
        return result;
    }


}
