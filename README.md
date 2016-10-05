# Webjar-app


This application is demo react app packaged as a webjar. It also demonstrates
distributing css/image resources. See the demo page of 
https://github.com/donhenton/spring-boot-birt for examples of how to use.

consuming code refers to the code via a pom.xml entry:

```xml
<dependency>
    <groupId>com.dhenton9000.webjars</groupId>
    <artifactId>webjar-app</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>
```

js reference in html
```
<script src="/webjars/jsapp/main_app.min.js"  type="text/javascript"></script>  
```

The webserver must be configured to serve resources off the classpath
