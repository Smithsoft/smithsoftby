# Admin For WP Install

```sh
# access the cloud instance via ssh
gcloud compute ssh wordpress-graphql

# edit the configuration
cd /var/www/dev.smithsoft.com.au/
vim wp-config.php
```

# Password Reset

To reset the password for wordpress via mysql:

```sh
# run the mysql command line client - enter password when requested after typing below:
mysql -u root -p

Enter password: 
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 5691
Server version: 10.3.31-MariaDB-0+deb10u1 Debian 10

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]> 
```

Get the name of the database to use from examining the config.php as above:

```sh
# open database
use smithsof_wp634;
```

Now examine the password for the admin user:

```sh
MariaDB [smithsof_wp634]> SELECT ID, user_login, user_pass FROM (wp_users);
+----+---------------+------------------------------------+
| ID | user_login    | user_pass                          |
+----+---------------+------------------------------------+
|  1 | administrator | $P$BXsreFKPViYJgw1K8j11SQcngGAsW3. |
|  2 | sarah         | $P$Bg./PyraGMhOhJIUaqXyYmEMzH9FDm/ |
|  3 | kristen       | $P$BH4Aj5hbgsSlg.UL/hstl6IKjLxZ47. |
|  4 | gatsby        | $P$BDyY1GjGsEE.ycQzAy5jau7mbBFuby/ |
+----+---------------+------------------------------------+
```

Time to update using the md5 hash:

```sh
UPDATE wp_users SET user_pass=MD5('s3kr1t_n3w_p4ssw0rd') WHERE ID = 1;

Query OK, 1 row affected (0.029 sec)
Rows matched: 1  Changed: 1  Warnings: 0
```

Now straight away login to the system via the web console at https://dev.smithsoft.com.au/wp-admin.

Note that the [Wordpress system no longer uses pure MD5](https://stackoverflow.com/questions/1045988/what-type-of-hash-does-wordpress-use),
so after logging in to the instance with the newly created password Wordpress will update it to the new system - starting with `$P$B`.

## Website Backup

```sh
# Backup the MySQL instance
gcloud compute ssh wordpress-graphql --command "mysqldump -u root -p smithsof_634 | gzip -9" > ~/Dropbox/website_backup/backup-2021-11-06.sql.gz
```

```sh
# Backup the files including PHP and contents uploads
gcloud compute ssh wordpress-graphql --command "(cd /var/www/dev.smithsoft.com.au && tar czf - .)" > ~/Dropbox/website_backup/backup-2021-11-06.tar.gz
```
