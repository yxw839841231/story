/**
 * 美窝云
 * APP服务端
 * 版权所有 2016~ 2017 杭州美窝科技有限公司
 */
package cn.zjoin.story.business.controller.admin;

import cn.zjoin.story.base.controller.BaseController;
import cn.zjoin.story.base.model.BaseResult;
import cn.zjoin.story.base.model.Pagination;
import cn.zjoin.story.business.model.Study;
import cn.zjoin.story.business.model.operator.StudyOperator;
import cn.zjoin.story.business.service.StudyService;
import cn.zjoin.story.core.aspet.Login;
import com.github.pagehelper.PageInfo;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.lang.reflect.InvocationTargetException;
import java.util.Date;

/**
 * Created on 2017/8/29.
 *
 * @auther 地瓜
 */
@Controller
@RequestMapping(value = "/admin/study", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class StudyController extends BaseController {

    @Resource
    private StudyService studyService;

    @RequestMapping(value = "list", method = RequestMethod.GET)
    @ResponseBody
    public BaseResult list(PageInfo<Study> pageInfo, StudyOperator studyOperator) {

        BaseResult result = new BaseResult();
        try {
            pageInfo= studyService.pageInfoSimple(pageInfo,studyOperator,Study.class,"id","title","author","createtime","good","cover","keywords","browse","type");
            return Pagination.toPagination(pageInfo);
        } catch (NoSuchMethodException e) {
            result.setMsg(e.getMessage());
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }

        return result;
    }

    @RequestMapping(value = "edit", method = RequestMethod.GET)
    @ResponseBody
    public BaseResult edit(Long id) {

        BaseResult result = new BaseResult();
        try {
            result.setData(studyService.getById(id));
        }catch (Exception e) {
            result = new BaseResult(e.getMessage());
            e.printStackTrace();
        }

        return result;
    }


    @RequestMapping("add")
    @ResponseBody
    @Login
    public BaseResult add(Study study) {
        BaseResult result = new BaseResult();
        study.setAuthor(getUser().getNickname());
        study.setAuthorid(getUser().getId());
        study.setCreatetime(new Date());
        if (StringUtils.isEmpty(study.getCover())) {
            study.setCover("http://image.story521.cn/FhNQ7FEeTpf2juzH8rAbPDyNP1w3");
        }
        try {
            studyService.insert(study);
        } catch (Exception e) {
            result.setCode(-1);
            result.setMsg(e.getMessage());
            e.printStackTrace();
        }
        return result;
    }

    @RequestMapping("update")
    @ResponseBody
    public BaseResult update(Study study) {
        BaseResult result = new BaseResult();
        try {
            studyService.update(study);
        } catch (Exception e) {
            result.setCode(-1);
            result.setMsg(e.getMessage());
            e.printStackTrace();
        }
        return result;
    }

    @RequestMapping("delete")
    @ResponseBody
    public BaseResult delete(Study study) {
        BaseResult result = new BaseResult();
        try {
            studyService.deleteByEntity(study);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }
}
