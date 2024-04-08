# DevOps | Class Assignment 2 - Part 1

## Technical Report

### Part 1 - Adding a new tasks to practice with Gradle

In this part of the assignment, we are going to document the steps to add several new tasks to the build.gradle file. 
The tasks include cloning a repository to my own repository, adding new tasks to the build.gradle file and marking the repository as final with a tag at the end of the assignment.
The report will follow a tutorial style, providing a step-by-step guide to the process.

#### Requirements

1. Clone the Bitbucket repository to your own repository in a folder for Part 1 of CA2.
2. Read the instructions in the README.md file and follow the instructions.
3. Add a new task to execute the server.
4. Add a simple unit test and update the Gradle script so that is able to execute the test.
5. Add a new task of type Copy to make a backup of the sources of the application. This task should copy the contents of the src folder to a new backup folder. 
6. Add a new task of type Zip to make an archive (zip file) of the sources of the application. This task should copy the contents of the src folder to a new zip file.
7. At the end of Part 1 of this assignment, mark your repository with the tag ca2-part1.

### Analysis

First we need to analyze the requirements and identify the steps to fulfill them. The requirements are:

1. Clone the Bitbucket repository. Then, commit and push the changes.
2. **New Features**
   * Add a new task to execute the server.
   * Add a simple unit test and update the Gradle script so that is able to execute the test.
   * Add a new task of type Copy to make a backup of the sources of the application. This task should copy the contents of the src folder to a new backup folder.
   * Add a new task of type Zip to make an archive (zip file) of the sources of the application. This task should copy the contents of the src folder to a new zip file.
3. At the end of Part 1 of this assignment, mark your repository with the tag ca2-part1.

### Design

Based on the analysis we can identify the following steps to fulfill the requirements:

1. Clone the Bitbucket repository: Use Git commands to clone the repository and push it to your own GitHub repository.
2. Add a new task to execute the server: This would involve adding a new task in your build.gradle file that starts the server. You would need to specify the main class to run.
3. Add a simple unit test and update the Gradle script so that it is able to execute the test: Create a new test class with JUnit 4.12. Update the build.gradle file to include a test task and add JUnit as a dependency. 
4. Add a new task of type Copy to make a backup of the sources of the application: Add a new task in your build.gradle file that copies the contents of the src folder to a new backup folder.
5. Add a new task of type Zip to make an archive (zip file) of the sources of the application: Add a new task in your build.gradle file that zips the contents of the src folder into a new zip file.
6. Mark your repository with the tag ca2-part1: Use Git commands to add a tag to your repository. 

### Implementation

Let's start by implementing the requirements for the new feature. We will follow the steps outlined in the requirements and provide a detailed explanation for each step.

1. Create the folder "ca2", and then create a new folder "part1" inside the "ca2" folder.

```bash
mkdir -p ca2/part1
```
2. Clone the Bitbucket repository to the folder part 1 of the ca2 folder. Then, commit and push the changes.

```bash
cd ca2/part1
git clone https://bitbucket.org/pssmatos/gradle_basic_demo.git
git add .
git commit -m "closes #8"
git push origin main
```
3. Add a new task to execute the server.

```gradle
task runServer (type:JavaExec, dependsOn: classes){
    group = "DevOps"
    description = "Launches a chat server that listens on port 59001"

    classpath = sourceSets.main.runtimeClasspath

    mainClass = 'basic_demo.ChatServerApp'

    args '59001'
}
```
4. Add a simple unit test and update the Gradle script so that is able to execute the test.

```java
package basic_demo;

import org.junit.Test;
import static org.junit.Assert.*;

public class AppTest {
    @Test public void testAppHasAGreeting() {
        App classUnderTest = new App();
        assertNotNull("app should have a greeting", classUnderTest.getGreeting());
    }
}
```
5. Add the jUnit dependency to the build.gradle file.

```gradle
dependencies {
    // Use Apache Log4J for logging
    implementation group: 'org.apache.logging.log4j', name: 'log4j-api', version: '2.11.2'
    implementation group: 'org.apache.logging.log4j', name: 'log4j-core', version: '2.11.2'
    testImplementation group: 'junit', name: 'junit', version: '4.12'
}
```
6. Commit and push the changes.

```bash
git add .
git commit -m "implemented task to run server and implemented unit test closes #10 #11"
git push origin main
```
7. Add a new task of type Copy to make a backup of the sources of the application. This task should copy the contents of the src folder to a new backup folder.

```gradle
task backupSources(type: Copy) {
    // Define the source directory
    from 'src'

    // Define the destination directory (create 'backup' folder if it doesn't exist)
    into 'src/backup'
}
```
8. Commit and push the changes.

```bash
git add .
git commit -m "Implemented a new task to create a backup closes #13"
git push origin main
```
9. Add a new task of type Zip to make an archive (zip file) of the sources of the application. This task should copy the contents of the src folder to a new zip file.

```gradle
task zipSources(type: Zip) {
    // Define the source directory
    from 'src'

    // Specify the archive file name
    archiveFileName = 'application-sources.zip'

    // Optionally, define the destination directory (defaults to build/outputs/zips)
    destinationDirectory = file('src/zipFile')
}
```
10. Commit and push the changes.

```bash
git add .
git commit -m "Implemented a task to create a Zip File closes #14"
git push origin main
```

11. Mark your repository with the tag ca2-part1.

```bash
git tag ca2-part1
git push origin ca2-part1
```
### Conclusion

