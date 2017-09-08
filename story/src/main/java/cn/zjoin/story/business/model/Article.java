package cn.zjoin.story.business.model;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Table(name = "article")
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 标题
     */
    private String title;

    /**
     * 作者
     */
    private String author;

    private Long authorid;

    private Date createtime;

    /**
     * 是否审核
     */
    private Boolean isaudit;

    /**
     * 关键字
     */
    private String keywords;

    /**
     * 摘要
     */
    private String describle;

    /**
     * 浏览权限
     */
    private Byte browsepermission;

    private String cover;

    private Integer catalog;

    /**
     * 内容
     */
    private String content;

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
     * 获取标题
     *
     * @return title - 标题
     */
    public String getTitle() {
        return title;
    }

    /**
     * 设置标题
     *
     * @param title 标题
     */
    public void setTitle(String title) {
        this.title = title;
    }

    /**
     * 获取作者
     *
     * @return author - 作者
     */
    public String getAuthor() {
        return author;
    }

    /**
     * 设置作者
     *
     * @param author 作者
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
     * 获取是否审核
     *
     * @return isaudit - 是否审核
     */
    public Boolean getIsaudit() {
        return isaudit;
    }

    /**
     * 设置是否审核
     *
     * @param isaudit 是否审核
     */
    public void setIsaudit(Boolean isaudit) {
        this.isaudit = isaudit;
    }

    /**
     * 获取关键字
     *
     * @return keywords - 关键字
     */
    public String getKeywords() {
        return keywords;
    }

    /**
     * 设置关键字
     *
     * @param keywords 关键字
     */
    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }

    /**
     * 获取摘要
     *
     * @return describle - 摘要
     */
    public String getDescrible() {
        return describle;
    }

    /**
     * 设置摘要
     *
     * @param describle 摘要
     */
    public void setDescrible(String describle) {
        this.describle = describle;
    }

    /**
     * 获取浏览权限
     *
     * @return browsepermission - 浏览权限
     */
    public Byte getBrowsepermission() {
        return browsepermission;
    }

    /**
     * 设置浏览权限
     *
     * @param browsepermission 浏览权限
     */
    public void setBrowsepermission(Byte browsepermission) {
        this.browsepermission = browsepermission;
    }

    /**
     * @return cover
     */
    public String getCover() {
        return cover;
    }

    /**
     * @param cover
     */
    public void setCover(String cover) {
        this.cover = cover;
    }

    /**
     * @return catalog
     */
    public Integer getCatalog() {
        return catalog;
    }

    /**
     * @param catalog
     */
    public void setCatalog(Integer catalog) {
        this.catalog = catalog;
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
}