package cn.zjoin.story.business.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class CommentOperator {
    private Long id;
    private String idoperator;

    private Long articleid;
    private String articleidoperator;

    private Long userid;
    private String useridoperator;


    private String content;
    private String contentoperator;

    private Integer dz;
    private String dzoperator;

    private Date createtime;
    private String createtimeoperator;

}