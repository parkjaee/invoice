package com.aact.invoice.config;

import com.zaxxer.hikari.HikariDataSource;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

import javax.sql.DataSource;

/**
 * MSSQL DataSource 설정 (시간 기록 서버)
 * - tgroup 테이블: idno, name
 * - tenter 테이블: e_idno, e_uptime
 */
@Configuration
@MapperScan(
    value = "com.aact.invoice.attendance.repository.mybatis",
    sqlSessionFactoryRef = "mssqlSqlSessionFactory"
)
public class MssqlDataSourceConfig {

    @Bean(name = "mssqlDataSource")
    @ConfigurationProperties(prefix = "mssql.datasource")
    public DataSource mssqlDataSource() {
        return DataSourceBuilder.create()
                .type(HikariDataSource.class)
                .build();
    }

    @Bean(name = "mssqlSqlSessionFactory")
    public SqlSessionFactory mssqlSqlSessionFactory(@Qualifier("mssqlDataSource") DataSource dataSource) throws Exception {
        SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
        sessionFactory.setDataSource(dataSource);

        // MyBatis XML 매퍼 위치 설정
        sessionFactory.setMapperLocations(
            new PathMatchingResourcePatternResolver().getResources("classpath:/mappers/attendance/**/*.xml")
        );

        // Type Aliases 설정
        sessionFactory.setTypeAliasesPackage("com.aact.invoice.attendance.dto");

        return sessionFactory.getObject();
    }

    @Bean(name = "mssqlTransactionManager")
    public DataSourceTransactionManager mssqlTransactionManager(@Qualifier("mssqlDataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
}
