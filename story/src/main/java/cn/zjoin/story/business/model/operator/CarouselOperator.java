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
public class CarouselOperator {
    private Long id;
    private String idoperator;

    private String title;
    private String titleoperator;

    private String picture;
    private String pictureoperator;

    private Date createtime;
    private String createtimeoperator;

    private Boolean isdelete;
    private String isdeleteoperator;

    private String content;
    private String contentoperator;


    private Integer catalog;
    private String catalogoperator;


}