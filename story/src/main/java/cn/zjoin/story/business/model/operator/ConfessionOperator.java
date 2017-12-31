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
public class ConfessionOperator {

    private String id;
    private String idoperator;

    private Integer isprivate;
    private String isprivateoperator;


    private String content;
    private String contentoperator;

    private String cover;
    private String coveroperator;

    private Integer browse;
    private String browseoperator;

    private Integer good;
    private Integer goodoperator;

    private String author;
    private String authoroperator;

    private Long authorid;
    private String authoridoperator;

    private String describle;
    private String describleoperator;

    private String title;
    private String titleoperator;

    private Date createtime;
    private String createtimeoperator;

    private String tolover;
    private String toloveroperator;

    private String fromlover;
    private String fromloveroperator;

    private Integer isaudit;
    private String isauditoperator;

    private String auditcontent;
    private String auditcontentoperator;

}