package cn.zjoin.story.business.model.view;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * Created by yangxw on 2017/12/5.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class ViewCommentArticle {
    private Long id;
    private String title;
    private String  author;
    private Integer totals;
    private Integer browse;
    private Date createtime;
}
