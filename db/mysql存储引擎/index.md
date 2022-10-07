# 存储引擎

### mysql 体系介绍

![](2022-10-07-11-13-43.png)

> 不同引擎层索引的实现不一样

### 存储引擎层简介

> 引擎, 发动机，是核心。

**存储数据，建立索引，更新查询数据等技术的实现方式。存储引擎基于表，而不是基于库，所以存储引擎也可以被称之为表类型。**

v5.5 版本以后默认采用 `innerdb`。

```sql
-- 查询建表语句
SHOW CREATE TABLE account;
-- 建表时指定存储引擎
CREATE TABLE 表名(
    ...
) ENGINE=INNODB;
-- 查看当前数据库支持的存储引擎
show engines;
```

### 存储引擎特点


#### InnoDB
InnoDB 是一种兼顾高可靠性和高性能的通用存储引擎，在 MySQL 5.5 之后，InnoDB 是默认的 MySQL 引擎。

特点：

- DML 操作遵循 ACID 模型，支持**事务**
- **行级锁**，提高并发访问性能
- 支持**外键**约束，保证数据的完整性和正确性


磁盘文件：

`xxx.ibd`: `xxx`代表表名，`InnoDB` 引擎的每张表都会对应这样一个表空间文件，存储该表的表结构（frm、sdi）、数据和索引。

参数：`innodb_file_per_table`，8.0这个开关是打开的，决定多张表共享一个表空间还是每张表对应一个表空间。

查看 Mysql 变量：

```sql
show variables like 'innodb_file_per_table';

```

从idb文件提取表结构数据：（在cmd运行）`ibd2sdi xxx.ibd`

![](2022-10-07-11-37-14.png)