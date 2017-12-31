/**
 * 美窝云
 * APP服务端
 * 版权所有 2016~ 2017 杭州美窝科技有限公司
 */
package cn.zjoin.story.business.controller.story;

import cn.zjoin.story.base.controller.BaseController;
import cn.zjoin.story.base.model.BaseResult;
import cn.zjoin.story.business.model.Study;
import cn.zjoin.story.business.model.operator.StudyOperator;
import cn.zjoin.story.business.service.StudyService;
import com.github.pagehelper.PageInfo;
import org.apache.log4j.Logger;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created on 2017/8/29.
 *
 * @auther 地瓜
 */
@Controller
@RequestMapping(value = "/story/study", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class StudyStoryController extends BaseController {

    Logger logger = Logger.getLogger(StudyStoryController.class);

    @Resource
    private StudyService studyService;


    @RequestMapping(value = "newest", method = RequestMethod.GET)
    @ResponseBody
    public BaseResult newest(PageInfo<Study> pageInfo, StudyOperator studyOperator) {
        PageInfo list = null;
        try {
            pageInfo.setPageNum(1);
            pageInfo.setPageSize(15);
            if(studyOperator.getCatalog()>0){
                studyOperator.setCatalogoperator("=");
            }else {
                studyOperator.setCatalog(null);
            }
            list= studyService.pageInfoSimple(pageInfo,studyOperator,Study.class,"id","title","author","createtime","describle","good","browse","enshrine","pl");
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }
        BaseResult result = new BaseResult();
        result.setData(list);
        return result;
    }
    @RequestMapping(value = "detail", method = RequestMethod.GET)
    @ResponseBody
    public BaseResult detail( Long id) {
        BaseResult result = new BaseResult();
        try {
            studyService.updateBrowse(id);
        }catch (Exception e){
            logger.error(e.getMessage());
        }
        Study detail = studyService.getById(id);
        Map<String,Object> map = new HashMap<String, Object>();
        map.put("detail",detail);
        map.put("pn",studyService.getPrevANdNext(id,detail.getAuthorid()));
        result.setData(map);
        return result;
    }

    @RequestMapping(value = "top", method = RequestMethod.GET)
    @ResponseBody
    public BaseResult getTop(StudyOperator studyOperator) {
        PageInfo list = null;
        PageInfo<Study> pageInfo = new PageInfo<Study>();
        pageInfo.setPageSize(7);
        pageInfo.setPageNum(1);
        BaseResult result = new BaseResult();
        try {
            list= studyService.pageInfoSimpleOrderBy(pageInfo,studyOperator,Study.class,"browse","desc","id","title");
            result.setData(list.getList());
        } catch (Exception e) {
            e.printStackTrace();
        }


        return result;
    }


    @RequestMapping(value = "similar", method = RequestMethod.GET)
    @ResponseBody
    public BaseResult getSimilar( StudyOperator articleOperator) {
        PageInfo list = null;
        PageInfo<Study> pageInfo = new PageInfo<Study>();
        pageInfo.setPageSize(5);
        pageInfo.setPageNum(1);
        articleOperator.setCatalogoperator("=");
        try {
            list= studyService.pageInfoSimple(pageInfo,articleOperator,Study.class,"id","title");
        } catch (Exception e) {
            e.printStackTrace();
        }
        BaseResult result = new BaseResult();
        result.setData(list.getList());
        return result;
    }


}
