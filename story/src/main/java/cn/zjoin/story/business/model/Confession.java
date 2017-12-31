package cn.zjoin.story.business.model;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Table(name = "confession")
public class Confession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    /**
     * 是否私有
     */
    private Boolean isprivate;

    /**
     * 表白内容
     */
    private String content;

    /**
     * 封面
     */
    private String cover;

    private Integer browse;

    private Integer good;

    private String author;

    private Long authorid;

    private String describle;

    private String title;

    private Date createtime;

    private String tolover;

    private String fromlover;

    private Boolean isaudit;

    private String auditcontent;

    private Integer type;

    /**
     * @return id
     */
    public String getId() {
        return id;
    }

    /**
     * @param id
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * 获取是否私有
     *
     * @return isprivate - 是否私有
     */
    public Boolean getIsprivate() {
        return isprivate;
    }

    /**
     * 设置是否私有
     *
     * @param isprivate 是否私有
     */
    public void setIsprivate(Boolean isprivate) {
        this.isprivate = isprivate;
    }

    /**
     * 获取表白内容
     *
     * @return content - 表白内容
     */
    public String getContent() {
        return content;
    }

    /**
     * 设置表白内容
     *
     * @param content 表白内容
     */
    public void setContent(String content) {
        this.content = content;
    }

    /**
     * 获取封面
     *
     * @return cover - 封面
     */
    public String getCover() {
        return cover;
    }

    /**
     * 设置封面
     *
     * @param cover 封面
     */
    public void setCover(String cover) {
        this.cover = cover;
    }

    /**
     * @return browse
     */
    public Integer getBrowse() {
        return browse;
    }

    /**
     * @param browse
     */
    public void setBrowse(Integer browse) {
        this.browse = browse;
    }

    /**
     * @return good
     */
    public Integer getGood() {
        return good;
    }

    /**
     * @param good
     */
    public void setGood(Integer good) {
        this.good = good;
    }

    /**
     * @return author
     */
    public String getAuthor() {
        return author;
    }

    /**
     * @param author
     */
    public void setAuthor(String author) {
        this.author = author;
    }

    /**
     * @return authorid
     */
    public Long getAuthorid() {
        return authorid;
    }

    /**
     * @param authorid
     */
    public void setAuthorid(Long authorid) {
        this.authorid = authorid;
    }

    /**
     * @return describle
     */
    public String getDescrible() {
        return describle;
    }

    /**
     * @param describle
     */
    public void setDescrible(String describle) {
        this.describle = describle;
    }

    /**
     * @return title
     */
    public String getTitle() {
        return title;
    }

    /**
     * @param title
     */
    public void setTitle(String title) {
        this.title = title;
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
     * @return tolover
     */
    public String getTolover() {
        return tolover;
    }

    /**
     * @param tolover
     */
    public void setTolover(String tolover) {
        this.tolover = tolover;
    }

    /**
     * @return fromlover
     */
    public String getFromlover() {
        return fromlover;
    }

    /**
     * @param fromlover
     */
    public void setFromlover(String fromlover) {
        this.fromlover = fromlover;
    }

    /**
     * @return isaudit
     */
    public Boolean getIsaudit() {
        return isaudit;
    }

    /**
     * @param isaudit
     */
    public void setIsaudit(Boolean isaudit) {
        this.isaudit = isaudit;
    }

    /**
     * @return auditcontent
     */
    public String getAuditcontent() {
        return auditcontent;
    }

    /**
     * @param auditcontent
     */
    public void setAuditcontent(String auditcontent) {
        this.auditcontent = auditcontent;
    }

    /**
     * @return type
     */
    public Integer getType() {
        return type;
    }

    /**
     * @param type
     */
    public void setType(Integer type) {
        this.type = type;
    }
}