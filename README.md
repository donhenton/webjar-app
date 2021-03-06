# Webjar-app


This application is demo react app packaged as a webjar. It also demonstrates
distributing css/image resources. See the demo page of 
https://github.com/donhenton/spring-boot-birt for examples of how to use. Since this jar file is
not on maven central or webjar central, you will have to install it locally.

consuming code refers to the code via a pom.xml entry:

```xml
<dependency>
    <groupId>com.dhenton9000.webjars</groupId>
    <artifactId>webjar-app</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>
```

js reference in html

```html
<script src="/webjars/jsapp/main_app.min.js"  type="text/javascript"></script>  
```

The webserver must be configured to serve resources off the classpath

## How Development Works

* gulp dev task allows for the typical livereload SPA development environment.
* gulp default is called via mvn clean install which will place all assets in the appropriate META-INF folder. This is set in the pom.xml file.
* node version is 6.11.1

### package assets

```bash
mvn clean install
```

This command calls the gulp default task which will compile js assets and copy them to the directory specified in the pom file as part of the package step.

### development

```bash
gulp dev
```


## Maven Configuration for Local Repo

* configure Sonatype Nexus 3 via docker (see <https://github.com/donhenton/udemy-docker/blob/master/jenkins-server/docker-compose.yml>)

* in ~/.m2/settings.xml file add the following

```xml
<server>
        <id>local-repo</id>
        <username>admin</username>
        <password>admin</password>
</server>
```

* see the pom.xml file for these entries

```xml
<distributionManagement>
  <repository>
    <id>local-repo</id>
    <url>http://localhost:9081/repository/maven-releases</url>

  </repository>
  <snapshotRepository>
    <id>local-repo</id>
    <url>http://localhost:9081/repository/maven-snapshots</url>
  </snapshotRepository>
</distributionManagement>
```

* run ```mvn deploy```


## Configure Github as a Repository

<https://stackoverflow.com/questions/14013644/hosting-a-maven-repository-on-github>
* do the part that creates the mvn-repo in target
* push branch
* use of the second plugin fails, so no push automatically

## Github use reference

```

<repositories>
    <repository>
        <id>webjar-app-mvn-repo</id>
        <url>https://raw.github.com/YOUR-USERNAME/webjar-app/mvn-repo/</url>
        <snapshots>
            <enabled>true</enabled>
            <updatePolicy>always</updatePolicy>
        </snapshots>
    </repository>
</repositories>


```

