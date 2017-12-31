package cn.zjoin.story.business.model;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Table(name = "comment")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long articleid;

    private Long userid;

    /**
     * 内容
     */
    private String content;

    /**
     * 点赞
     */
    private Integer dz;

    private Date createtime;
    private Integer type;

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
     * @return articleid
     */
    public Long getArticleid() {
        return articleid;
    }

    /**
     * @param articleid
     */
    public void setArticleid(Long articleid) {
        this.articleid = articleid;
    }

    /**
     * @return userid
     */
    public Long getUserid() {
        return userid;
    }

    /**
     * @param userid
     */
    public void setUserid(Long userid) {
        this.userid = userid;
    }

    /**
     * 获取内容
     *
     * @return content - 内容
     */
    public String getContent() {
        return content;
    }

    /**
     * 设置内容
     *
     * @param content 内容
     */
    public void setContent(String content) {
        this.content = content;
    }

    /**
     * 获取点赞
     *
     * @return dz - 点赞
     */
    public Integer getDz() {
        return dz;
    }

    /**
     * 设置点赞
     *
     * @param dz 点赞
     */
    public void setDz(Integer dz) {
        this.dz = dz;
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

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }
}