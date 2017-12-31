package cn.zjoin.story.business.model.operator;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Table(name = "article")
public class ArticleOperator {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String idoperator;

    /**
     * 标题
     */
    private String title;
    private String titleoperator;

    /**
     * 作者
     */
    private String author;
    private String authoroperator;

    private Long authorid;
    private String authoridoperator;

    private Date createtime;
    private String createtimeoperator;

    /**
     * 是否审核
     */
    private Boolean isaudit;
    private String isauditoperator;

    /**
     * 关键字
     */
    private String keywords;
    private String keywordsoperator;

    /**
     * 摘要
     */
    private String describle;
    private String describleoperator;

    /**
     * 浏览权限
     */
    private Integer browse;
    private String browseoperator;

    private String cover;
    private String coveroperator;

    private Integer catalog;
    private String catalogoperator;

    /**
     * 内容
     */
    private String content;
    private String contentoperator;

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

    public String getIdoperator() {
        return idoperator;
    }

    public void setIdoperator(String idoperator) {
        this.idoperator = idoperator;
    }

    public String getTitleoperator() {
        return titleoperator;
    }

    public void setTitleoperator(String titleoperator) {
        this.titleoperator = titleoperator;
    }

    public String getAuthoroperator() {
        return authoroperator;
    }

    public void setAuthoroperator(String authoroperator) {
        this.authoroperator = authoroperator;
    }

    public String getAuthoridoperator() {
        return authoridoperator;
    }

    public void setAuthoridoperator(String authoridoperator) {
        this.authoridoperator = authoridoperator;
    }

    public String getCreatetimeoperator() {
        return createtimeoperator;
    }

    public void setCreatetimeoperator(String createtimeoperator) {
        this.createtimeoperator = createtimeoperator;
    }

    public String getIsauditoperator() {
        return isauditoperator;
    }

    public void setIsauditoperator(String isauditoperator) {
        this.isauditoperator = isauditoperator;
    }

    public String getKeywordsoperator() {
        return keywordsoperator;
    }

    public void setKeywordsoperator(String keywordsoperator) {
        this.keywordsoperator = keywordsoperator;
    }

    public String getDescribleoperator() {
        return describleoperator;
    }

    public void setDescribleoperator(String describleoperator) {
        this.describleoperator = describleoperator;
    }

    public String getCoveroperator() {
        return coveroperator;
    }

    public void setCoveroperator(String coveroperator) {
        this.coveroperator = coveroperator;
    }

    public String getCatalogoperator() {
        return catalogoperator;
    }

    public void setCatalogoperator(String catalogoperator) {
        this.catalogoperator = catalogoperator;
    }

    public String getContentoperator() {
        return contentoperator;
    }

    public void setContentoperator(String contentoperator) {
        this.contentoperator = contentoperator;
    }

    public Integer getBrowse() {
        return browse;
    }

    public void setBrowse(Integer browse) {
        this.browse = browse;
    }

    public String getBrowseoperator() {
        return browseoperator;
    }

    public void setBrowseoperator(String browseoperator) {
        this.browseoperator = browseoperator;
    }
}