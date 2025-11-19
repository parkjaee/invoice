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
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

import javax.sql.DataSource;

/**
 * Oracle DataSource 설정 (CAPS 주 데이터베이스)
 */
@Configuration
@MapperScan(
    value = "com.aact.invoice.caps.repository.mybatis",
    sqlSessionFactoryRef = "oracleSqlSessionFactory"
)
public class OracleDataSourceConfig {

    @Primary
    @Bean(name = "oracleDataSource")
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource oracleDataSource() {
        return DataSourceBuilder.create()
                .type(HikariDataSource.class)
                .build();
    }

    @Primary
    @Bean(name = "oracleSqlSessionFactory")
    public SqlSessionFactory oracleSqlSessionFactory(@Qualifier("oracleDataSource") DataSource dataSource) throws Exception {
        SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
        sessionFactory.setDataSource(dataSource);

        // MyBatis XML 매퍼 위치 설정
        sessionFactory.setMapperLocations(
            new PathMatchingResourcePatternResolver().getResources("classpath:/mappers/caps/**/*.xml")
        );

        // Type Aliases 설정
        sessionFactory.setTypeAliasesPackage("com.aact.invoice.caps.dto,com.aact.invoice.entity");

        // MyBatis Configuration
        org.apache.ibatis.session.Configuration configuration = new org.apache.ibatis.session.Configuration();
        configuration.setMapUnderscoreToCamelCase(true);
        configuration.setJdbcTypeForNull(org.apache.ibatis.type.JdbcType.NULL);
        sessionFactory.setConfiguration(configuration);

        return sessionFactory.getObject();
    }

    @Primary
    @Bean(name = "oracleTransactionManager")
    public DataSourceTransactionManager oracleTransactionManager(@Qualifier("oracleDataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
}
