# DevOps Technical Report | Class Assignment 3 - Part 2

## Part 2 - Virtualization with Vagrant using VirtualBox

### Introduction

The purpose of this part of the assignment is to use Vagrant to automatically generate two virtual machines,
one for the webServer and the other for the database.

### Requirements

1. Copy a Vagrantfile to the repository and update it to generate two virtual machines through VirtualBox.
2. Run command `vagrant up` to create the virtual machines and run the application, automatically.
3. Verify that the web application is accessible from the browser in the host machine.
4. Verify that the H2 console is accessible from the browser in the host machine, and has a connection to the H2 server.

### Analysis

1. Install Vagrant locally.
2. Copy the Vagrantfile to the repository.
3. Update the Vagrantfile to be compatible with the current project.
4. Run the command `vagrant up` to create the virtual machines and run the application.
5. Access the web application from the browser in the host machine.
6. Access the H2 console from the browser in the host machine.

### Implementation

1. Install Vagrant locally.

2. Copy the Vagrantfile to the repository from https://bitbucket.org/pssmatos/vagrant-multi-spring-tut-demo/src/master/.

3. Update the Vagrantfile to be compatible with the current project.

```Vagrantfile
    Vagrant.configure("2") do |config|
      config.vm.box = "ubuntu/focal64"
      config.ssh.insert_key = false

      # This provision is common for both VMs
      config.vm.provision "shell", inline: <<-SHELL
        sudo apt-get update -y
        sudo apt-get install -y iputils-ping avahi-daemon libnss-mdns unzip \
            openjdk-17-jdk-headless
        # ifconfig
      SHELL

      #============
      # Configurations specific to the database VM
      config.vm.define "db" do |db|
        db.vm.box = "ubuntu/focal64"
        db.vm.hostname = "db"
        db.vm.network "private_network", ip: "192.168.56.11"

        # We want to access H2 console from the host using port 8082
        # We want to connet to the H2 server using port 9092
        db.vm.network "forwarded_port", guest: 8082, host: 8082
        db.vm.network "forwarded_port", guest: 9092, host: 9092

        # We need to download H2
        db.vm.provision "shell", inline: <<-SHELL
          wget https://repo1.maven.org/maven2/com/h2database/h2/1.4.200/h2-1.4.200.jar
        SHELL

        # The following provision shell will run ALWAYS so that we can execute the H2 server process
        # This could be done in a different way, for instance, setting H2 as as service, like in the following link:
        # How to setup java as a service in ubuntu: http://www.jcgonzalez.com/ubuntu-16-java-service-wrapper-example
        #
        # To connect to H2 use: jdbc:h2:tcp://192.168.33.11:9092/./jpadb
        db.vm.provision "shell", :run => 'always', inline: <<-SHELL
          java -cp ./h2*.jar org.h2.tools.Server -web -webAllowOthers -tcp -tcpAllowOthers -ifNotExists > ~/out.txt &
        SHELL
      end

      #============
      # Configurations specific to the webserver VM
      config.vm.define "web" do |web|
        web.vm.box = "ubuntu/focal64"
        web.vm.hostname = "web"
        web.vm.network "private_network", ip: "192.168.56.10"

        # We set more ram memory for this VM
        web.vm.provider "virtualbox" do |v|
          v.memory = 1024
        end

        # We want to access tomcat from the host using port 8080
        web.vm.network "forwarded_port", guest: 8080, host: 8080

        web.vm.provision "shell", inline: <<-SHELL, privileged: false
          # sudo apt-get install git -y
          # sudo apt-get install nodejs -y
          # sudo apt-get install npm -y
          # sudo ln -s /usr/bin/nodejs /usr/bin/node
          sudo apt install -y tomcat9 tomcat9-admin
          # If you want to access Tomcat admin web page do the following:
          # Edit /etc/tomcat9/tomcat-users.xml
          # uncomment tomcat-users and add manager-gui to tomcat user

          # Change the following command to clone your own repository!
          git clone https://github.com/joaomouta13/devops-23-24-JPE-1231833.git
          cd devops-23-24-JPE-1231833/ca2/part2
          chmod u+x gradlew
          ./gradlew clean build
          nohup ./gradlew bootRun > /home/vagrant/spring-boot-app.log 2>&1 &
          # To deploy the war file to tomcat9 do the following command:
          # sudo cp ./build/libs/basic-0.0.1-SNAPSHOT.war /var/lib/tomcat9/webapps
        SHELL
      end
    end
```

4. Run the command `vagrant up` to create the virtual machines and run the application.
    * After the command is executed, the virtual machines are created via VirtualBox.
   ![WebApp](ca3/part2/frontend.png)

5. Access the web application from the browser in the host machine.
    * Open the web browser in http://192.168.56.10:8080/basic-0.0.1-SNAPSHOT/.

6. Commit and push the changes to the repository.

```bash
git add .
git commit -m "new: added and run VagrantFile closes #30"
git push
```

7. Follow the following steps to access the H2 console from the browser in the host machine:

8. Change de application.properties file to allow H2 console access.

```properties
server.servlet.context-path=/basic-0.0.1-SNAPSHOT
spring.data.rest.base-path=/api
#spring.datasource.url=jdbc:h2:mem:jpadb
# In the following settings the h2 file is created in /home/vagrant folder
spring.datasource.url=jdbc:h2:tcp://192.168.56.11:9092/./jpadb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
# So that spring will not drop de database on every execution.
spring.jpa.hibernate.ddl-auto=update
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
spring.h2.console.settings.web-allow-others=true
```

9. Change the app.js file to allow H2 console access.

```javascript
componentDidMount() { // <2>
   client({method: 'GET', path: '/basic-0.0.1-SNAPSHOT/api/employees'}).done(response => {
      this.setState({employees: response.entity._embedded.employees});
   });
}
```

10. Update the index.html file.

```html
<!DOCTYPE html>
<html xmlns:th="https://www.thymeleaf.org">
<head lang="en">
   <meta charset="UTF-8"/>
   <title>ReactJS + Spring Data REST</title>
   <link rel="stylesheet" href="main.css" />
</head>
<body>

<div id="react"></div>

<script src="built/bundle.js"></script>

</body>
</html>
```

11. Run the command `vagrant up` to create the virtual machines and run the application.
    * After the command is executed, the virtual machines are created via VirtualBox.
    * You can now access your H2 console from the browser in the host machine.
   ![H2Console](ca3/part2/readmeCA3Part2.md)

12. Commit and push the changes to the repository.

```bash
git add. 
git commit -m "refactor of application.prop, index.html and app.js to enablese h2 database closes #32"
git push
```
13. Add and commit a technical report to the repository.

```bash
git add .
git commit -m "docs: Create a technical report for CA3 part2 closes #33"
git push 
```

14. Tag the repository with the tag ca3-part2.

```bash
git tag ca3-part2
git push origin ca3-part2
```

## Part 2 - Virtualization with Vagrant - Alternative to VirtualBox

### Introduction
The purpose of this part of the assignment is to use Vagrant to automatically generate two virtual machines,
one for the webServer and the other for the database, using VMware Workstation as an alternative to VirtualBox.

### Requirements
1. Update the Vagrantfile to use VMware Workstation as the provider.
2. Run command `vagrant up` to create the virtual machines and run the application, automatically.

### Implementation
To implement this part of the assignment, we need to update the Vagrantfile to use VMware Workstation as the provider.

```Vagrantfile
   Vagrant.configure("2") do |config|
      config.vm.provider "vmware_workstation" do |v|
      v.vmx["memsize"] = "2048" # Adjust memory size as needed
      v.vmx["numvcpus"] = "2"   # Adjust number of CPUs as needed
   end

   config.vm.box = "ubuntu/focal64"
   config.ssh.insert_key = false

   # This provision is common for both VMs
   config.vm.provision "shell", inline: <<-SHELL
      sudo apt-get update -y
      sudo apt-get install -y iputils-ping avahi-daemon libnss-mdns unzip \
         openjdk-17-jdk-headless
      # ifconfig
   SHELL

   #============
   # Configurations specific to the database VM
      config.vm.define "db" do |db|
         db.vm.provider "vmware_workstation" do |v|
            v.vmx["memsize"] = "2048" # Adjust memory size as needed
            v.vmx["numvcpus"] = "1"   # Adjust number of CPUs as needed
         end

         db.vm.box = "ubuntu/focal64"
         db.vm.hostname = "db"
         db.vm.network "private_network", ip: "192.168.56.11"

         # We want to access H2 console from the host using port 8082
         # We want to connet to the H2 server using port 9092
         db.vm.network "forwarded_port", guest: 8082, host: 8082
         db.vm.network "forwarded_port", guest: 9092, host: 9092

         # We need to download H2
         db.vm.provision "shell", inline: <<-SHELL
            wget https://repo1.maven.org/maven2/com/h2database/h2/1.4.200/h2-1.4.200.jar
         SHELL

         # The following provision shell will run ALWAYS so that we can execute the H2 server process
         # This could be done in a different way, for instance, setting H2 as as service, like in the following link:
         # How to setup java as a service in ubuntu: http://www.jcgonzalez.com/ubuntu-16-java-service-wrapper-example
         #
         # To connect to H2 use: jdbc:h2:tcp://192.168.33.11:9092/./jpadb
         db.vm.provision "shell", :run => 'always', inline: <<-SHELL
            java -cp ./h2*.jar org.h2.tools.Server -web -webAllowOthers -tcp -tcpAllowOthers -ifNotExists > ~/out.txt &
         SHELL
      end

      #============
      # Configurations specific to the webserver VM
      config.vm.define "web" do |web|
         web.vm.provider "vmware_workstation" do |v|
            v.vmx["memsize"] = "2048" # Adjust memory size as needed
            v.vmx["numvcpus"] = "2"   # Adjust number of CPUs as needed
         end

         web.vm.box = "ubuntu/focal64"
         web.vm.hostname = "web"
         web.vm.network "private_network", ip: "192.168.56.10"

         # We want to access tomcat from the host using port 8080
         web.vm.network "forwarded_port", guest: 8080, host: 8080

         web.vm.provision "shell", inline: <<-SHELL, privileged: false
            # sudo apt-get install git -y
            # sudo apt-get install nodejs -y
            # sudo apt-get install npm -y
            # sudo ln -s /usr/bin/nodejs /usr/bin/node
            sudo apt install -y tomcat9 tomcat9-admin
            # If you want to access Tomcat admin web page do the following:
            # Edit /etc/tomcat9/tomcat-users.xml
            # uncomment tomcat-users and add manager-gui to tomcat user

            # Change the following command to clone your own repository!
            git clone https://github.com/joaomouta13/devops-23-24-JPE-1231833.git
            cd devops-23-24-JPE-1231833/ca2/part2
            chmod u+x gradlew
            ./gradlew clean build
            nohup ./gradlew bootRun > /home/vagrant/spring-boot-app.log 2>&1 &
            # To deploy the war file to tomcat9 do the following command:
            # sudo cp ./build/libs/basic-0.0.1-SNAPSHOT.war /var/lib/tomcat9/webapps
         SHELL
      end
   end
```

After updating the Vagrantfile, run the command `vagrant up` to create the virtual machines and run the application.
   * After the command is executed, the virtual machines are created via VMware Workstation.

### Conclusion
In conclusion, this assignment showcased the power of Vagrant in automating the setup of virtualized environments, employing both VirtualBox and VMware Workstation as providers. 

Through meticulous configuration and provisioning steps outlined in the Vagrantfile, two virtual machines—one for the web server and another for the database—were effortlessly created, facilitating seamless deployment and testing of the application. This exercise not only demonstrated the efficiency and versatility of Vagrant but also highlighted its pivotal role in streamlining development workflows and ensuring consistency across various deployment environments. 



