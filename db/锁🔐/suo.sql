-- 数据备份

-- 整个数据库被锁住了
flush tables with read lock;
SELECT * FROM emp;


-- 执行更新操作报错：  Can't execute the query because you have a conflicting read lock
UPDATE emp SET name="zhangsan" WHERE id = 1;

-- 备份 mysqldump是客户端的命令工具
# mysqldump -h 127.0.0.1 -uroot -p123456 yach > ./yach.sql

unlock tables;


-- 表级别锁
-- 读锁
-- 无法写入：Table 'emp' was locked with a READ lock and can't be updated 会阻塞其他客户端写。
lock tables emp read;
unlock tables;


-- 写锁
select * from account;
lock tables account write;
INSERT INTO account(id, name, money) VALUES (10,"ak",2000);
unlock tables;





