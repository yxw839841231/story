package cn.zjoin.story.business.model.operator;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.Date;
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class StudyOperator {
    private Long id;
    private String idoperator;

    private String title;
    private String titleoperator;

    private Integer browse;
    private String browseoperator;

    private String describle;
    private String describleoperator;

    private String cover;
    private String coveroperator;

    private Date createtime;
    private String createtimeoperator;

    private Integer good;
    private String goodoperator;

    private Integer enshrine;
    private String enshrineoperator;

    private Integer catalog;
    private String catalogoperator;

    private Long authorid;
    private String authoridoperator;

    private String author;
    private String authoroperator;

    private String content;
    private String contentoperator;

    private Integer type;
    private String typeoperator;

    private String keywords;
    private String keywordsoperator;

    private Integer pl;
    private String ploperator;
}