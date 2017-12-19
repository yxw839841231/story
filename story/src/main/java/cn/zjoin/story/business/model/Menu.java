package cn.zjoin.story.business.model;

import javax.persistence.*;
import java.io.Serializable;

@Table(name = "menu")
public class Menu implements Serializable{
    /**
     * 编号
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 所属系统
     */
    private Long systemid;

    /**
     * 所属上级
     */
    private Long pid;

    /**
     * 名称
     */
    private String name;

    /**
     * 类型(1:目录,2:菜单,3:按钮)
     */
    private Byte type;

    /**
     * 权限值
     */
    private String path;

    /**
     * 路径
     */
    private String uri;

    /**
     * 图标
     */
    private String icon;

    /**
     * 状态(0:禁止,1:正常)
     */
    private Byte status;

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
     * 获取所属系统
     *
     * @return systemid - 所属系统
     */
    public Long getSystemid() {
        return systemid;
    }

    /**
     * 设置所属系统
     *
     * @param systemid 所属系统
     */
    public void setSystemid(Long systemid) {
        this.systemid = systemid;
    }

    /**
     * 获取所属上级
     *
     * @return pid - 所属上级
     */
    public Long getPid() {
        return pid;
    }

    /**
     * 设置所属上级
     *
     * @param pid 所属上级
     */
    public void setPid(Long pid) {
        this.pid = pid;
    }

    /**
     * 获取名称
     *
     * @return name - 名称
     */
    public String getName() {
        return name;
    }

    /**
     * 设置名称
     *
     * @param name 名称
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * 获取类型(1:目录,2:菜单,3:按钮)
     *
     * @return type - 类型(1:目录,2:菜单,3:按钮)
     */
    public Byte getType() {
        return type;
    }

    /**
     * 设置类型(1:目录,2:菜单,3:按钮)
     *
     * @param type 类型(1:目录,2:菜单,3:按钮)
     */
    public void setType(Byte type) {
        this.type = type;
    }

    /**
     * 获取权限值
     *
     * @return path - 权限值
     */
    public String getPath() {
        return path;
    }

    /**
     * 设置权限值
     *
     * @param path 权限值
     */
    public void setPath(String path) {
        this.path = path;
    }

    /**
     * 获取路径
     *
     * @return uri - 路径
     */
    public String getUri() {
        return uri;
    }

    /**
     * 设置路径
     *
     * @param uri 路径
     */
    public void setUri(String uri) {
        this.uri = uri;
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
     * 获取状态(0:禁止,1:正常)
     *
     * @return status - 状态(0:禁止,1:正常)
     */
    public Byte getStatus() {
        return status;
    }

    /**
     * 设置状态(0:禁止,1:正常)
     *
     * @param status 状态(0:禁止,1:正常)
     */
    public void setStatus(Byte status) {
        this.status = status;
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