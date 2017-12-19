package cn.zjoin.story.base.service;

import cn.zjoin.story.base.model.Pagination;
import cn.zjoin.story.util.TimeUtil;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import tk.mybatis.mapper.common.Mapper;
import tk.mybatis.mapper.entity.Example;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * Created by digua on 2016/9/6.
 */
public abstract class BaseService<T> {
    @Autowired
    protected Mapper<T> mapper;

    /**
     * 保存一个实体，null的属性不会保存，会使用数据库默认值
     *
     * @param entity
     * @return
     */
    @Transactional
    public int insert(T entity) {
        return mapper.insertSelective(entity);
    }

    /**
     * 保存一个实体，null的属性也会保存，不会使用数据库默认值
     *
     * @param entity
     * @return
     */
    @Transactional
    public int insertNull(T entity) {
        return mapper.insert(entity);
    }

    /**
     * 根据主键更新属性不为null的值
     *
     * @param entity
     * @return
     */
    @Transactional
    public int update(T entity) {
        return mapper.updateByPrimaryKeySelective(entity);
    }

    /**
     * 根据主键更新实体全部字段，null值会被更新
     *
     * @param entity
     * @return
     */
    @Transactional
    public int updateNull(T entity) {
        return mapper.updateByPrimaryKey(entity);
    }


    /**
     * 根据主键字段进行查询，方法参数必须包含完整的主键属性，查询条件使用等号
     *
     * @param id
     * @return
     */
    public T getById(Long id) {
        return mapper.selectByPrimaryKey(id);
    }

    /**
     * 根据实体中的属性值进行查询，查询条件使用等号
     *
     * @param entity
     */
    public List<T> getListByEntity(T entity) {
        return mapper.select(entity);
    }

    /**
     * 根据实体中的属性进行查询，只能有一个返回值，有多个结果是抛出异常，查询条件使用等号
     *
     * @param entity
     * @return
     */
    public T getOneByEntity(T entity) {
        return mapper.selectOne(entity);
    }

    /**
     * 查询全部结果，select(null)方法能达到同样的效果
     *
     * @return
     */
    public List<T> getAll() {
        return mapper.selectAll();
    }


    /**
     * 根据example 条件查询
     *
     * @param example
     * @return
     */
    public List<T> getByExample(Example example) {
        return mapper.selectByExample(example);
    }

    /**
     * 根据example 条件查询
     *
     * @param example
     * @return
     */
    public int getCountByExample(Example example) {
        return mapper.selectCountByExample(example);
    }


    /**
     * 根据主键删除
     *
     * @param o
     * @return
     */
    @Transactional
    public int delete(Object o) {
        return mapper.deleteByPrimaryKey(o);
    }

    /**
     * 根据实体删除
     *
     * @param entity
     * @return
     */
    @Transactional
    public int deleteByEntity(T entity) {
        return mapper.delete(entity);
    }


    /**
     * 简单分页方法
     *
     * @param pagination
     * @return
     */
    public Pagination<T> pageInfoSimple(Pagination pagination,T t) {

        PageHelper.startPage(pagination.getPageCurrent(), pagination.getPageSize(), " id desc ");
        List<T> list = mapper.selectAll();
        PageInfo<T> page = new PageInfo(list);
        pagination.setPageCurrent(page.getPageNum());
        pagination.setData(list);
        pagination.setPages(page.getPages());
        pagination.setTotal(page.getTotal());
        return pagination;
    }


    private void praseCondition(Example.Criteria ec,String name,Object value,String value2){
        if (value != null) {
            if(value2.equals("=")){
                ec.andEqualTo(name, value);
            }else if(value2.equals("like")){
                ec.andLike(name,"%"+ value.toString()+"%");
            }else if(value2.equals(">")){
                ec.andGreaterThan(name,value.toString());
            }else if(value2.equals("<")){
                ec.andLessThan( name,value.toString());
            }
        }
    }


    public PageInfo<T> pageInfoSimple(PageInfo page,Object entity,Class clazz,String... colums) throws NoSuchMethodException, IllegalAccessException, IllegalArgumentException, InvocationTargetException {
        Example example = new Example(clazz);
        Field[] field = entity.getClass().getDeclaredFields();
        Example.Criteria ec = example.createCriteria();
        if(!StringUtils.isEmpty(colums)) example.selectProperties(colums);

        for (int j = 0; j < field.length; j++) {     //遍历所有属性
            String name = field[j].getName();    //获取属性的名字
            if(name.endsWith("operator")) continue;
            String type = field[j].getGenericType().toString();    //获取属性的类型
            if (type.equals("class java.lang.String")) {   //如果type是类类型，则前面包含"class "，后面跟类名
                Method m = entity.getClass().getMethod("get" + captureName(name));
                String value = (String) m.invoke(entity);    //调用getter方法获取属性值
                Method m2 =  entity.getClass().getMethod("get" + captureName(name+"operator"));
                String value2 = (String) m2.invoke(entity);
                if (value != null) {
                    praseCondition(ec,name,value,value2);
                }
            } else if (type.equals("class java.lang.Integer")) {
                Method m = entity.getClass().getMethod("get" + captureName(name));
                Integer value = (Integer) m.invoke(entity);
                Method m2 =  entity.getClass().getMethod("get" + captureName(name+"operator"));
                String value2 = (String) m2.invoke(entity);
                if (value != null) {
                    praseCondition(ec,name,value,value2);
                }
            } else if (type.equals("class java.lang.Long")) {
                Method m = entity.getClass().getMethod("get" + captureName(name));
                Long value = (Long) m.invoke(entity);
                Method m2 =  entity.getClass().getMethod("get" + captureName(name+"operator"));
                String value2 = (String) m2.invoke(entity);
                if (value != null) {
                    praseCondition(ec,name,value,value2);
                }
            } else if (type.equals("class java.lang.Short")) {
                Method m = entity.getClass().getMethod("get" + captureName(name));
                Short value = (Short) m.invoke(entity);
                Method m2 =  entity.getClass().getMethod("get" + captureName(name+"operator"));
                String value2 = (String) m2.invoke(entity);
                if (value != null) {
                    praseCondition(ec,name,value,value2);
                }
            } else if (type.equals("class java.lang.Double")) {
                Method m = entity.getClass().getMethod("get" + captureName(name));
                Double value = (Double) m.invoke(entity);
                Method m2 =  entity.getClass().getMethod("get" + captureName(name+"operator"));
                String value2 = (String) m2.invoke(entity);
                if (value != null) {
                    praseCondition(ec,name,value,value2);
                }
            } else if (type.equals("class java.lang.Boolean")) {
                Method m = entity.getClass().getMethod("get" + captureName(name));
                Boolean value = (Boolean) m.invoke(entity);
                Method m2 =  entity.getClass().getMethod("get" + captureName(name+"operator"));
                String value2 = (String) m2.invoke(entity);
                if (value != null) {
                    praseCondition(ec,name,value?1:0,value2);
                }
            } else if (type.equals("class java.util.Date")) {
                Method m = entity.getClass().getMethod("get" + captureName(name));
                Date value = (Date) m.invoke(entity);
                Method m2 =  entity.getClass().getMethod("get" + captureName(name+"operator"));
                String value2 = (String) m2.invoke(entity);
                if (value != null) {
                    praseCondition(ec,name, TimeUtil.format(value),value2);
                }
            }
        }
        example.orderBy("id").desc();
        PageHelper.startPage(page.getPageNum(), page.getPageSize());
        List<T> list = mapper.selectByExample(example);
        page = new PageInfo(list);
        return page;
    }

    public PageInfo<T> pageInfoSimpleOrderBy(PageInfo page,Object entity,Class clazz,String orderBy,String asc,String... colums) throws NoSuchMethodException, IllegalAccessException, IllegalArgumentException, InvocationTargetException {
        Example example = new Example(clazz);
        Field[] field = entity.getClass().getDeclaredFields();
        Example.Criteria ec = example.createCriteria();
        if(!StringUtils.isEmpty(colums)) example.selectProperties(colums);

        for (int j = 0; j < field.length; j++) {     //遍历所有属性
            String name = field[j].getName();    //获取属性的名字
            if(name.endsWith("operator")) continue;
            String type = field[j].getGenericType().toString();    //获取属性的类型
            if (type.equals("class java.lang.String")) {   //如果type是类类型，则前面包含"class "，后面跟类名
                Method m = entity.getClass().getMethod("get" + captureName(name));
                String value = (String) m.invoke(entity);    //调用getter方法获取属性值
                Method m2 =  entity.getClass().getMethod("get" + captureName(name+"operator"));
                String value2 = (String) m2.invoke(entity);
                if (value != null) {
                    praseCondition(ec,name,value,value2);
                }
            } else if (type.equals("class java.lang.Integer")) {
                Method m = entity.getClass().getMethod("get" + captureName(name));
                Integer value = (Integer) m.invoke(entity);
                Method m2 =  entity.getClass().getMethod("get" + captureName(name+"operator"));
                String value2 = (String) m2.invoke(entity);
                if (value != null) {
                    praseCondition(ec,name,value,value2);
                }
            } else if (type.equals("class java.lang.Long")) {
                Method m = entity.getClass().getMethod("get" + captureName(name));
                Long value = (Long) m.invoke(entity);
                Method m2 =  entity.getClass().getMethod("get" + captureName(name+"operator"));
                String value2 = (String) m2.invoke(entity);
                if (value != null) {
                    praseCondition(ec,name,value,value2);
                }
            } else if (type.equals("class java.lang.Short")) {
                Method m = entity.getClass().getMethod("get" + captureName(name));
                Short value = (Short) m.invoke(entity);
                Method m2 =  entity.getClass().getMethod("get" + captureName(name+"operator"));
                String value2 = (String) m2.invoke(entity);
                if (value != null) {
                    praseCondition(ec,name,value,value2);
                }
            } else if (type.equals("class java.lang.Double")) {
                Method m = entity.getClass().getMethod("get" + captureName(name));
                Double value = (Double) m.invoke(entity);
                Method m2 =  entity.getClass().getMethod("get" + captureName(name+"operator"));
                String value2 = (String) m2.invoke(entity);
                if (value != null) {
                    praseCondition(ec,name,value,value2);
                }
            } else if (type.equals("class java.lang.Boolean")) {
                Method m = entity.getClass().getMethod("get" + captureName(name));
                Boolean value = (Boolean) m.invoke(entity);
                Method m2 =  entity.getClass().getMethod("get" + captureName(name+"operator"));
                String value2 = (String) m2.invoke(entity);
                if (value != null) {
                    praseCondition(ec,name,value?1:0,value2);
                }
            } else if (type.equals("class java.util.Date")) {
                Method m = entity.getClass().getMethod("get" + captureName(name));
                Date value = (Date) m.invoke(entity);
                Method m2 =  entity.getClass().getMethod("get" + captureName(name+"operator"));
                String value2 = (String) m2.invoke(entity);
                if (value != null) {
                    praseCondition(ec,name, TimeUtil.format(value),value2);
                }
            }
        }
        if("asc".equalsIgnoreCase(asc)){
            example.orderBy(orderBy).asc();
        }else {
            example.orderBy(orderBy).desc();
        }
        PageHelper.startPage(page.getPageNum(), page.getPageSize());
        List<T> list = mapper.selectByExample(example);
        page = new PageInfo(list);
        return page;
    }


    public List<T> getList(Object model) throws NoSuchMethodException, IllegalAccessException, IllegalArgumentException, InvocationTargetException {
        Example example = new Example(model.getClass());
        Field[] field = model.getClass().getDeclaredFields();
        Example.Criteria ec = example.createCriteria();

        for (int j = 0; j < field.length; j++) {     //遍历所有属性
            String name = field[j].getName();    //获取属性的名字
            String type = field[j].getGenericType().toString();    //获取属性的类型
            if (type.equals("class java.lang.String")) {   //如果type是类类型，则前面包含"class "，后面跟类名
                Method m = model.getClass().getMethod("get" + captureName(name));
                String value = (String) m.invoke(model);    //调用getter方法获取属性值
                if (value != null) {
                    ec.andEqualTo(name, value);
                }
            } else if (type.equals("class java.lang.Integer")) {
                Method m = model.getClass().getMethod("get" + captureName(name));
                Integer value = (Integer) m.invoke(model);
                if (value != null) {
                    ec.andEqualTo(name, value);
                }
            } else if (type.equals("class java.lang.Long")) {
                Method m = model.getClass().getMethod("get" + captureName(name));
                Long value = (Long) m.invoke(model);
                if (value != null) {
                    ec.andEqualTo(name, value);
                }
            } else if (type.equals("class java.lang.Short")) {
                Method m = model.getClass().getMethod("get" + captureName(name));
                Short value = (Short) m.invoke(model);
                if (value != null) {
                    ec.andEqualTo(name, value);
                }
            } else if (type.equals("class java.lang.Double")) {
                Method m = model.getClass().getMethod("get" + captureName(name));
                Double value = (Double) m.invoke(model);
                if (value != null) {
                    ec.andEqualTo(name, value);
                }
            } else if (type.equals("class java.lang.Boolean")) {
                Method m = model.getClass().getMethod("get" + captureName(name));
                Boolean value = (Boolean) m.invoke(model);
                if (value != null) {
                    ec.andEqualTo(name, value);
                }
            } else if (type.equals("class java.util.Date")) {
                Method m = model.getClass().getMethod("get" + captureName(name));
                Date value = (Date) m.invoke(model);
                if (value != null) {
                    ec.andEqualTo(name, value);
                }
            }
        }
        return mapper.selectByExample(example);
    }

    private static String captureName(String name) {
        name = name.substring(0, 1).toUpperCase() + name.substring(1);
        return name;
    }

    protected String getUUID(){
        UUID uuid = UUID.randomUUID();
        return uuid.toString();
    }


}
