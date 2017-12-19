package cn.zjoin.story.business.model;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;
import java.util.Date;

@Table(name = "user")
public class User implements Serializable{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String loginname;

    private String loginpass;

    private String nickname;

    private Boolean isactive;

    private String phone;

    private String picture;

    private String email;

    private String qq;

    private String wx;

    private Date createtime;

    private Date lastlogintime;

    private Boolean canback;

    /**
     * @return id
     */
    public Long getId() {
        return id;
    }

    /**
     * @param id
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * @return loginname
     */
    public String getLoginname() {
        return loginname;
    }

    /**
     * @param loginname
     */
    public void setLoginname(String loginname) {
        this.loginname = loginname;
    }

    /**
     * @return loginpass
     */
    public String getLoginpass() {
        return loginpass;
    }

    /**
     * @param loginpass
     */
    public void setLoginpass(String loginpass) {
        this.loginpass = loginpass;
    }

    /**
     * @return nickname
     */
    public String getNickname() {
        return nickname;
    }

    /**
     * @param nickname
     */
    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    /**
     * @return isactive
     */
    public Boolean getIsactive() {
        return isactive;
    }

    /**
     * @param isactive
     */
    public void setIsactive(Boolean isactive) {
        this.isactive = isactive;
    }

    /**
     * @return phone
     */
    public String getPhone() {
        return phone;
    }

    /**
     * @param phone
     */
    public void setPhone(String phone) {
        this.phone = phone;
    }

    /**
     * @return picture
     */
    public String getPicture() {
        return picture;
    }

    /**
     * @param picture
     */
    public void setPicture(String picture) {
        this.picture = picture;
    }

    /**
     * @return email
     */
    public String getEmail() {
        return email;
    }

    /**
     * @param email
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * @return qq
     */
    public String getQq() {
        return qq;
    }

    /**
     * @param qq
     */
    public void setQq(String qq) {
        this.qq = qq;
    }

    /**
     * @return wx
     */
    public String getWx() {
        return wx;
    }

    /**
     * @param wx
     */
    public void setWx(String wx) {
        this.wx = wx;
    }

    /**
     * @return createtime
     */
    public Date getCreatetime() {
        return createtime;
    }

    /**
     * @param createtime
     */
    public void setCreatetime(Date createtime) {
        this.createtime = createtime;
    }

    /**
     * @return lastlogintime
     */
    public Date getLastlogintime() {
        return lastlogintime;
    }

    /**
     * @param lastlogintime
     */
    public void setLastlogintime(Date lastlogintime) {
        this.lastlogintime = lastlogintime;
    }

    /**
     * @return canback
     */
    public Boolean getCanback() {
        return canback;
    }

    /**
     * @param canback
     */
    public void setCanback(Boolean canback) {
        this.canback = canback;
    }
}