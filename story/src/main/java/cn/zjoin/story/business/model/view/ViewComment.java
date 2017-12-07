package cn.zjoin.story.business.model.view;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class ViewComment {
    private Long id;

    private Long articleid;

    private Long userid;


    private String content;


    private Integer dz;

    private Date createtime;
    private String nickname;
    private String picture;

}