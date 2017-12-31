package cn.zjoin.story.business.model.operator;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class UserOperator implements Serializable{
    private Long id;
    private String idoperator;

    private String loginname;
    private String loginnameoperator;

    private String loginpass;
    private String loginpassoperator;

    private String nickname;
    private String nicknameoperator;

    private Boolean isactive;
    private String isactiveoperator;

    private String phone;
    private String phoneoperator;

    private String picture;
    private String pictureoperator;

    private String email;
    private String emailoperator;

    private String qq;
    private String qqoperator;

    private String wx;
    private String wxoperator;

    private Date createtime;
    private String createtimeoperator;

    private Date lastlogintime;
    private String lastlogintimeoperator;

    private Boolean canback;
    private String canbackoperator;

    private Boolean isauth;
    private String isauthoperator;
}