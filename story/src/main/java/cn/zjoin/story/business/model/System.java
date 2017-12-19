package cn.zjoin.story.business.model;

import javax.persistence.*;
import java.io.Serializable;

@Table(name = "system")
public class System implements Serializable{
    /**
     * 编号
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 图标
     */
    private String icon;

    /**
     * 背景
     */
    private String banner;

    /**
     * 主题
     */
    private String theme;

    /**
     * 根目录
     */
    private String basepath;

    /**
     * 状态(-1:黑名单,1:正常)
     */
    private Byte status;

    /**
     * 系统名称
     */
    private String name;

    /**
     * 系统标题
     */
    private String title;

    /**
     * 系统描述
     */
    private String description;

    /**
     * 创建时间
     */
    private Long ctime;

    /**
     * 排序
     */
    private Long orders;

    /**
     * 获取编号
     *
     * @return id - 编号
     */
    public Long getId() {
        return id;
    }

    /**
     * 设置编号
     *
     * @param id 编号
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * 获取图标
     *
     * @return icon - 图标
     */
    public String getIcon() {
        return icon;
    }

    /**
     * 设置图标
     *
     * @param icon 图标
     */
    public void setIcon(String icon) {
        this.icon = icon;
    }

    /**
     * 获取背景
     *
     * @return banner - 背景
     */
    public String getBanner() {
        return banner;
    }

    /**
     * 设置背景
     *
     * @param banner 背景
     */
    public void setBanner(String banner) {
        this.banner = banner;
    }

    /**
     * 获取主题
     *
     * @return theme - 主题
     */
    public String getTheme() {
        return theme;
    }

    /**
     * 设置主题
     *
     * @param theme 主题
     */
    public void setTheme(String theme) {
        this.theme = theme;
    }

    /**
     * 获取根目录
     *
     * @return basepath - 根目录
     */
    public String getBasepath() {
        return basepath;
    }

    /**
     * 设置根目录
     *
     * @param basepath 根目录
     */
    public void setBasepath(String basepath) {
        this.basepath = basepath;
    }

    /**
     * 获取状态(-1:黑名单,1:正常)
     *
     * @return status - 状态(-1:黑名单,1:正常)
     */
    public Byte getStatus() {
        return status;
    }

    /**
     * 设置状态(-1:黑名单,1:正常)
     *
     * @param status 状态(-1:黑名单,1:正常)
     */
    public void setStatus(Byte status) {
        this.status = status;
    }

    /**
     * 获取系统名称
     *
     * @return name - 系统名称
     */
    public String getName() {
        return name;
    }

    /**
     * 设置系统名称
     *
     * @param name 系统名称
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * 获取系统标题
     *
     * @return title - 系统标题
     */
    public String getTitle() {
        return title;
    }

    /**
     * 设置系统标题
     *
     * @param title 系统标题
     */
    public void setTitle(String title) {
        this.title = title;
    }

    /**
     * 获取系统描述
     *
     * @return description - 系统描述
     */
    public String getDescription() {
        return description;
    }

    /**
     * 设置系统描述
     *
     * @param description 系统描述
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * 获取创建时间
     *
     * @return ctime - 创建时间
     */
    public Long getCtime() {
        return ctime;
    }

    /**
     * 设置创建时间
     *
     * @param ctime 创建时间
     */
    public void setCtime(Long ctime) {
        this.ctime = ctime;
    }

    /**
     * 获取排序
     *
     * @return orders - 排序
     */
    public Long getOrders() {
        return orders;
    }

    /**
     * 设置排序
     *
     * @param orders 排序
     */
    public void setOrders(Long orders) {
        this.orders = orders;
    }
}