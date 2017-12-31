package cn.zjoin.story.business.model;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Table(name = "study")
public class Study {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private Integer browse;

    private String describle;

    private String cover;

    private Date createtime;

    private Integer good;

    private Integer enshrine;

    private Byte catalog;

    private Long authorid;

    private String author;

    private String keywords;

    private Integer type;

    private String content;

    private Integer pl;

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
     * @return enshrine
     */
    public Integer getEnshrine() {
        return enshrine;
    }

    /**
     * @param enshrine
     */
    public void setEnshrine(Integer enshrine) {
        this.enshrine = enshrine;
    }

    /**
     * @return catalog
     */
    public Byte getCatalog() {
        return catalog;
    }

    /**
     * @param catalog
     */
    public void setCatalog(Byte catalog) {
        this.catalog = catalog;
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
     * @return keywords
     */
    public String getKeywords() {
        return keywords;
    }

    /**
     * @param keywords
     */
    public void setKeywords(String keywords) {
        this.keywords = keywords;
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

    /**
     * @return content
     */
    public String getContent() {
        return content;
    }

    /**
     * @param content
     */
    public void setContent(String content) {
        this.content = content;
    }

    public Integer getPl() {
        return pl;
    }

    public void setPl(Integer pl) {
        this.pl = pl;
    }
}