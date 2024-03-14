# DevOps | Class Assignment 1

## Technical Report

### Part 1 - Adding a new feature to Tutorial React.js and Spring Data Rest

In this technical report, we document the process of fulfilling the requirements outlined for a React.js and Spring Data
REST Application.
The tasks include copying existing code, version control using tags, developing a new feature, and marking the
repository at the end of the assignment. The report will follow a tutorial style, providing step-by-step instructions
for reproducing the assignment.

### Requirements

1. Copy the code of the Tutorial React.js and Spring Data REST Application into a
   new folder named CA1
2. Commit the changes (and push them).
3. We should use tags to mark the versions of the application. You should use a
   pattern like: major.minor.revision (e.g., 1.1.0).
    * Tag the initial version as v1.1.0. Push it to the server.
4. Let's develop a new feature to add a new field to the application. In this case, lets
   add a new field to record the years of the employee in the company (e.g., jobYears).
    * You should add support for the new field.
    * You should also add unit tests for testing the creation of Employees and the validation
      of their attributes (for instance, no null/empty values). For the new field, only integer
      values should be allowed.
    * You should debug the server and client parts of the solution.
    * When the new feature is completed (and tested) the code should be committed and
      pushed and a new tag should be created (e.g, v1.2.0).
5. At the end of the assignment mark your repository with the tag ca1-part1.

### Analysis

First we need to analyze the requirements and identify the steps to fulfill them. The requirements are:

1. We need to copy the code of the Tutorial React.js and Spring Data REST Application into a new folder named "CA1".
   Then, commit and push the changes.
2. Tag the initial version as v1.1.0 and push it to the server.
3. **New Features**
    * Add a new field named "jobYears" to the Employee entity.
    * Implement unit tests for creating employees and validating their attributes.
    * Debug both the server and client parts of the solution.
    * Commit and push the code and create a new tag named v1.2.0.
4. At the end of the assignment, mark the repository with the tag "ca1-part1".

### Design

Based on the analysis we can identify the following steps to fulfill the requirements:

1. Add a new field to the Employee entity.
2. Modify the REST API to support the new field.
3. Implement unit tests for creating employees and validating their attributes.
4. Identify and fix the issues in both the server and client parts of the solution.
5. Commit the changes and create version tags for the initial version and the new feature.

### Implementation

Let's start by implementing the requirements for the new feature. We will follow the steps outlined in the requirements
and provide a detailed explanation for each step. I have already created a local repository with the code of the
Tutorial React.js and Spring Data REST Application (C:\Users\Paulo Mouta\Desktop\devops\tut-react-and-spring-data-rest)

From here, I will start to implement the requirements.

1. Creating the folder "ca1" and clone the repository into it.
   ```bash
   mkdir ca1
   cp -r C:\Users\Paulo Mouta\Desktop\devops\tut-react-and-spring-data-rest ca1/
   git init
   git add .
   git commit -m "first commit"

2. Version tagging

 ```bash
       git tag v1.1.0
       git push origin master v1.1.0
```

3. Add a new field to the Employee entity.

  ```java 
         Entity // <1>

public class Employee {

    private @Id
    @GeneratedValue Long id; // <2>
    private String firstName;
    private String lastName;
    private String description;
    private int jobYears;

    public Employee(String firstName, String lastName, String description, int jobYears, String email) {
        if (firstName == null || firstName.isEmpty() || lastName == null || lastName.isEmpty() || description == null || description.isEmpty() || jobYears < 0)
            throw new IllegalArgumentException("First name, last name, and description must not be null. Job years must be greater than 0.");

        setFirstName(firstName);
        setLastName(lastName);
        setDescription(description);
        setJobYears(jobYears);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Employee employee = (Employee) o;
        return Objects.equals(id, employee.id) &&
                Objects.equals(firstName, employee.firstName) &&
                Objects.equals(lastName, employee.lastName) &&
                Objects.equals(description, employee.description) &&
                jobYears == employee.jobYears &&
    }


    public void setJobYears(int jobYears) {
        if (jobYears < 0)
            throw new IllegalArgumentException("Job years must be greater than 0.");
        this.jobYears = jobYears;
    }

    public int getJobYears() {
        return jobYears;
    }
    //getters and setters
}
   ````

* Modify the DataBaseLoader to include the new field.
   ```java 
            
   @Component // <1>
   public class DatabaseLoader implements CommandLineRunner { // <2>

     private final EmployeeRepository repository;

         @Autowired // <3>
          public DatabaseLoader(EmployeeRepository repository) {
                 this.repository = repository;
             }

         @Override
         public void run(String... strings) throws Exception { // <4>
           this.repository.save(new Employee("Frodo", "Baggins", "ring bearer", 4, "frodo@baggins.com"));
            this.repository.save(new Employee("Bilbo", "Baggins", "burglar", 7, "baggins@bilbo.com"));
            this.repository.save(new Employee("Gandalf", "the Grey", "wizard", 10, "grey@gandalf.com"));
            this.repository.save(new Employee("Sméagol", "Gollum", "thief", 2, "gollum@sméagol.com"));
          }
   }
   ```` 
* Modify the application configuration to include the new field.

 ```javascript 
class EmployeeList extends React.Component {
    render() {
        const employees = this.props.employees.map(employee =>
            <Employee key={employee._links.self.href} employee={employee}/>
        );
        return (
            <table>
                <tbody>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Description</th>
                        <th>Job Years</th>
                    </tr>
                    {employees}
                </tbody>
            </table>
        )
    }
}
``````

```javascript
class Employee extends React.Component {
    render() {
        return (
            <tr>
                <td>{this.props.employee.firstName}</td>
                <td>{this.props.employee.lastName}</td>
                <td>{this.props.employee.description}</td>
                <td>{this.props.employee.jobYears}</td>
                <td>{this.props.employee.email}</td>
            </tr>
        )
    }
}
````

* Implement unit tests for creating employees and validating their attributes.

```java

public class EmployeeTest {

    /**
     * Test of Employee constructor, of class Employee.
     */
    @Test
    public void testEmployee() {
        //Arrange
        String firstName = "Frodo";
        String lastName = "Baggins";
        String description = "ring bearer";
        int jobYears = 4;

        //Act
        Employee employee = new Employee(firstName, lastName, description, jobYears);

        //Assert
        assertNotNull(employee);
    }

    /**
     * Test of Employee getters, of class Employee.
     */
    @Test
    public void testEmployeeGetters() {
        //Arrange
        String firstName = "Frodo";
        String lastName = "Baggins";
        String description = "ring bearer";
        int jobYears = 4;

        //Act
        Employee employee = new Employee(firstName, lastName, description, jobYears);

        //Assert
        assertEquals(firstName, employee.getFirstName());
        assertEquals(lastName, employee.getLastName());
        assertEquals(description, employee.getDescription());
        assertEquals(jobYears, employee.getJobYears());
    }

    /**
     * Test of Employee if exception is thrown, of class Employee, when first name is null.
     */
    @Test
    public void testExceptionNullFirstName() {
        //Arrange
        String firstName = null;
        String lastName = "Baggins";
        String description = "ring bearer";
        int jobYears = 4;

        String exceptionMessage = "First name, last name, and description must not be null. Job years must be greater than 0.";

        //Act + Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            new Employee(firstName, lastName, description, jobYears, email);
        });
        assertEquals(exceptionMessage, exception.getMessage());
    }

    /**
     * Test of Employee if exception is thrown, of class Employee, when first name is empty.
     */
    @Test
    public void testExceptionEmptyFirstName() {
        //Arrange
        String firstName = "";
        String lastName = "Baggins";
        String description = "ring bearer";
        int jobYears = 4;

        String exceptionMessage = "First name, last name, and description must not be null. Job years must be greater than 0.";

        //Act + Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            new Employee(firstName, lastName, description, jobYears, email);
        });
        assertEquals(exceptionMessage, exception.getMessage());
    }

    /**
     * Test of Employee if exception is thrown, of class Employee, when last name is null.
     */
    @Test
    public void testExceptionNullLastName() {
        //Arrange
        String firstName = "Frodo";
        String lastName = null;
        String description = "ring bearer";
        int jobYears = 4;

        String exceptionMessage = "First name, last name, and description must not be null. Job years must be greater than 0.";

        //Act + Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            new Employee(firstName, lastName, description, jobYears, email);
        });
        assertEquals(exceptionMessage, exception.getMessage());
    }

    /**
     * Test of Employee if exception is thrown, of class Employee, when last name is empty.
     */
    @Test
    public void testExceptionEmptyLastName() {
        //Arrange
        String firstName = "Frodo";
        String lastName = "";
        String description = "ring bearer";
        int jobYears = 4;

        String exceptionMessage = "First name, last name, and description must not be null. Job years must be greater than 0.";

        //Act + Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            new Employee(firstName, lastName, description, jobYears, email);
        });
        assertEquals(exceptionMessage, exception.getMessage());
    }

    /**
     * Test of Employee if exception is thrown, of class Employee, when description is null.
     */
    @Test
    public void testExceptionNullDescription() {
        //Arrange
        String firstName = "Frodo";
        String lastName = "Baggins";
        String description = null;
        int jobYears = 4;

        String exceptionMessage = "First name, last name, and description must not be null. Job years must be greater than 0.";

        //Act + Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            new Employee(firstName, lastName, description, jobYears, email);
        });
        assertEquals(exceptionMessage, exception.getMessage());
    }

    /**
     * Test of Employee if exception is thrown, of class Employee, when description is empty.
     */
    @Test
    public void testExceptionEmptyDescription() {
        //Arrange
        String firstName = "Frodo";
        String lastName = "Baggins";
        String description = "";
        int jobYears = 4;

        String exceptionMessage = "First name, last name, and description must not be null. Job years must be greater than 0.";

        //Act + Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            new Employee(firstName, lastName, description, jobYears, email);
        });
        assertEquals(exceptionMessage, exception.getMessage());
    }

    /**
     * Test of Employee if exception is thrown, of class Employee, when jobYears is lower than 0.
     */
    @Test
    public void testExceptionNullJobYearsLowerThanZero() {
        //Arrange
        String firstName = "Frodo";
        String lastName = "Baggins";
        String description = "ring bearer";
        int jobYears = -15;

        String exceptionMessage = "First name, last name, and description must not be null. Job years must be greater than 0.";

        //Act + Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            new Employee(firstName, lastName, description, jobYears, email);
        });
        assertEquals(exceptionMessage, exception.getMessage());
    }
}
````

4. Debug the both the server and client parts of the solution, in order to identify and fix the issues.
    ```bash
    cd ca1/basic
    ./mvnw spring-boot:run
    ```
5. Commit the changes and create version tags for the initial version and the new feature.
   ```bash
   git add .
   git commit -m "#1 Added jobYears field + unit testing"
   git tag v1.2.0
   git push origin master v1.2.0
   ```
6. At the end of the assignment mark your repository with the tag "ca1-part1".
   ```bash
   git tag ca1-part1
   git push origin ca1-part1
   ```

### Part 2 - Implement a simple scenario using illustrating a simple git workflow.

In this part of the assignment, we are tasked with managing the development and version control of a Tutorial React.js
and Spring Data REST Application.
The main objectives include using the master branch to publish stable versions, developing new features in separate
branches, creating branches for bug fixes, and marking the repository at the end of the assignment with a specific tag.

### Requirements

1. Use the master branch to publish stable versions of the application. Ensure, that only stable versions are merged
   into the master branch.
2. Develop new features in branches named after the feature.
    * Create a branch called "email-field" to add a new email field.
    * Include unit tests to validate the new field.
    * Debug the server and client parts of the solution.
    * Once the new feature is completed (and tested), merge the branch into the master branch.
    * Tag the version as v1.3.0 and push it to the server to mark the release of the new feature.
3. Create a branch for bug fixes
    * Create a new branch named after the bug being fixed (e.g., "fix-invalid-email") to address the issue.
    * Modify the server to only accept Employees with valid email addresses (containing the "@" sign).
    * Debug both server and client parts of the solution to ensure the fix's effectiveness.
    * Once the bug fix is completed and tested, merge the code with the master branch.
    * Create a new tag with a change in the minor version number (v1.3.1) to indicate the update.
4. At the end of the assignment, mark the repository with the tag "ca1-part2".

### Analysis

1. We need to develop new features in a separate branch and merge them into the master branch once they are completed
   and tested.
    * Create a branch called "email-field" to add a new email field.
    * Include unit tests to validate the new field.
    * Debug the server and client parts of the solution.
    * Once the new feature is completed (and tested), merge the branch into the master branch.
    * Tag the version as v1.3.0 and push it to the server to mark the release of the new feature.
2. Create a branch for bug fixes
    * Create a new branch named after the bug being fixed (e.g., "fix-invalid-email") to address the issue.
    * Modify the server to only accept Employees with valid email addresses (containing the "@" sign).
    * Debug both server and client parts of the solution to ensure the fix's effectiveness.
    * Once the bug fix is completed and tested, merge the code with the master branch.
    * Create a new tag with a change in the minor version number (v1.3.1) to indicate the update.
3. At the end of the assignment, mark the repository with the tag "ca1-part2".

### Design

1. Create a branch called "email-field" to add a new email field.
2. Include unit tests to validate the new field.
3. Debug the server and client parts of the solution and merge the branch into the master branch with the tag v1.3.0.
4. Create a new branch named after the bug being fixed (e.g., "fix-invalid-email") to address the issue.
5. Modify the server to only accept Employees with valid email addresses (containing the "@" sign).
6. Debug both server and client parts of the solution to ensure the fix's effectiveness.
7. Merge the code with the master branch and create a new tag with a change in the minor version number (v1.3.1).
8. Mark the repository with the tag "ca1-part2".

### Implementation

Let's start by implementing the requirements for the new feature and bug fix. We will follow the steps outlined in the
requirements and provide a detailed explanation for each step.

1. Create a branch called "email-field" to add a new email field.
   ```bash
   git branch email-field
   git checkout email-field
   ```
2. Add support for the email field

```java

@Entity // <1>
public class Employee {

    private @Id
    @GeneratedValue Long id; // <2>
    private String firstName;
    private String lastName;
    private String description;
    private int jobYears;
    private String email;

    private Employee() {
    }

    public Employee(String firstName, String lastName, String description, int jobYears, String email) {
        if (firstName == null || firstName.isEmpty() || lastName == null || lastName.isEmpty() || description == null || description.isEmpty() || jobYears < 0)
            throw new IllegalArgumentException("First name, last name, and description must not be null. Job years must be greater than 0.");

        setFirstName(firstName);
        setLastName(lastName);
        setDescription(description);
        setJobYears(jobYears);
        setEmail(email);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Employee employee = (Employee) o;
        return Objects.equals(id, employee.id) &&
                Objects.equals(firstName, employee.firstName) &&
                Objects.equals(lastName, employee.lastName) &&
                Objects.equals(description, employee.description) &&
                jobYears == employee.jobYears &&
                Objects.equals(email, employee.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, firstName, lastName, description, jobYears, email);
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        return email;
    }

    @Override
    public String toString() {
        return "Employee{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", description='" + description + '\'' +
                ", jobYears=" + jobYears + '\'' +
                ", email=" + email +
                '}';
    }
}

```

* Modify the DataBaseLoader to include the new field.

```java

@Component // <1>
public class DatabaseLoader implements CommandLineRunner { // <2>

    private final EmployeeRepository repository;

    @Autowired // <3>
    public DatabaseLoader(EmployeeRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... strings) throws Exception { // <4>
        this.repository.save(new Employee("Frodo", "Baggins", "ring bearer", 4, "frodo@baggins.com"));
        this.repository.save(new Employee("Bilbo", "Baggins", "burglar", 7, "baggins@bilbo.com"));
        this.repository.save(new Employee("Gandalf", "the Grey", "wizard", 10, "grey@gandalf.com"));
        this.repository.save(new Employee("Sméagol", "Gollum", "thief", 2, "gollum@sméagol.com"));

    }
}
```   

* Modify the application configuration to include the new field.

```javascript
class EmployeeList extends React.Component {
    render() {
        const employees = this.props.employees.map(employee =>
            <Employee key={employee._links.self.href} employee={employee}/>
        );
        return (
            <table>
                <tbody>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Description</th>
                        <th>Job Years</th>
                        <th>Email</th>
                    </tr>
                    {employees}
                </tbody>
            </table>
        )
    }
}

class Employee extends React.Component {
    render() {
        return (
            <tr>
                <td>{this.props.employee.firstName}</td>
                <td>{this.props.employee.lastName}</td>
                <td>{this.props.employee.description}</td>
                <td>{this.props.employee.jobYears}</td>
                <td>{this.props.employee.email}</td>
            </tr>
        )
    }
}
```

* Implement unit tests for the email field.

```java
public class EmployeeTest {

    /**
     * Test of Employee constructor, of class Employee.
     */
    @Test
    public void testEmployee() {
        //Arrange
        String firstName = "Frodo";
        String lastName = "Baggins";
        String description = "ring bearer";
        int jobYears = 4;
        String email = "frodo@baggins.com";

        //Act
        Employee employee = new Employee(firstName, lastName, description, jobYears, email);

        //Assert
        assertNotNull(employee);
    }
}
   ````

3. Debug the server and client parts of the solution and merge the branch into the master branch with the tag v1.3.0.
   ```bash
   cd ca1/basic
   ./mvnw spring-boot:run
   ```
4. Merge with the master branch and tag the version as v1.3.0.
   ```bash
   git checkout master
   git merge email-field
   git add .
   git commit -m "#2 #3 Added email feature to the class Employee + unit tests"
   git tag v1.3.0
   git push origin master
   git push origin v1.3.0
   ```    

I should have used the command "git merge --no-ff". This way, GIt would create a new commit object, even if a fast forward merge is possible. This will preserve the information that a feature branch once existed.

5. Create a new branch named after the bug being fixed to address the issue.
   ```bash
    git branch fix-invalid-email
    git checkout fix-invalid-email
    ```
6. Modify the server to only accept Employees with valid email addresses (containing the "@" sign).
    * Add support to the email field.

```java

@Entity // <1>
public class Employee {

    private @Id
    @GeneratedValue Long id; // <2>
    private String firstName;
    private String lastName;
    private String description;
    private int jobYears;
    @NotNull
    @Email(message = "Email should be valid")
    private String email;

    private Employee() {
    }

    public Employee(String firstName, String lastName, String description, int jobYears, String email) {
        if (firstName == null || firstName.isEmpty() || lastName == null || lastName.isEmpty() || description == null || description.isEmpty() || jobYears < 0)
            throw new IllegalArgumentException("First name, last name, and description must not be null. Job years must be greater than 0.");

        setFirstName(firstName);
        setLastName(lastName);
        setDescription(description);
        setJobYears(jobYears);
        setEmail(email);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Employee employee = (Employee) o;
        return Objects.equals(id, employee.id) &&
                Objects.equals(firstName, employee.firstName) &&
                Objects.equals(lastName, employee.lastName) &&
                Objects.equals(description, employee.description) &&
                jobYears == employee.jobYears &&
                Objects.equals(email, employee.email);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id, firstName, lastName, description, jobYears, email);
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        if (email == null || email.isEmpty())
            throw new IllegalArgumentException("Email must not be null or empty.");

        String emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$";
        Pattern pattern = Pattern.compile(emailRegex);
        Matcher matcher = pattern.matcher(email);

        if (!matcher.matches()) {
            throw new IllegalArgumentException("Invalid email format");
        }
    }
}
   ````

* Implement unit tests for the email field.

```java

@Test
public void testNullEmail() {
    //Arrange
    String firstName = "Frodo";
    String lastName = "Baggins";
    String description = "ring bearer";
    int jobYears = 4;
    String email = null;

    String exceptionMessage = "Email must not be null or empty.";

    //Act + Assert
    Exception exception = assertThrows(IllegalArgumentException.class, () -> {
        new Employee(firstName, lastName, description, jobYears, email);
    });
    assertEquals(exceptionMessage, exception.getMessage());
}

@Test
public void testInvalidEmail() {
    //Arrange
    String firstName = "Frodo";
    String lastName = "Baggins";
    String description = "ring bearer";
    int jobYears = 4;
    String email = "frodo@baggins";

    String exceptionMessage = "Invalid email format";

    //Act + Assert
    Exception exception = assertThrows(IllegalArgumentException.class, () -> {
        new Employee(firstName, lastName, description, jobYears, email);
    });
    assertEquals(exceptionMessage, exception.getMessage());
}

@Test
public void testEmailWithoutAt() {
    //Arrange
    String firstName = "Frodo";
    String lastName = "Baggins";
    String description = "ring bearer";
    int jobYears = 4;
    String email = "frodo.baggins.com";

    String exceptionMessage = "Invalid email format";

    //Act + Assert
    Exception exception = assertThrows(IllegalArgumentException.class, () -> {
        new Employee(firstName, lastName, description, jobYears, email);
    });
    assertEquals(exceptionMessage, exception.getMessage());
}
````

7. Debug both server and client parts of the solution to ensure the fix's effectiveness.

```bash
cd ca1/basic
./mvnw spring-boot:run
```

8. Merge the code with the master branch and create a new tag with a change in the minor version number (v1.3.1).

```bash
git checkout master
git merge fix-invalid-email
git add .
git commit "#5 fixed invalid email validations"
git tag v1.3.1
git push origin master
git push origin v1.3.1
```
I should have used the command "git merge --no-ff". This way, GIt would create a new commit object, even if a fast forward merge is possible. This will preserve the information that a feature branch once existed. 
9. Mark the repository with the tag "ca1-part2".

```bash
git tag ca1-part2
git push origin ca1-part2
```

### Alternative Implementation - Apache SubVersion

In this section we will use Apache Subversion to implement the requirements for the new feature and bug fix.

### Part 1

1. Creating the folder "ca1" and clone the repository into it.

````svn
   svn checkout file:///C:/Users/Paulo\ Mouta/Desktop/devops/tut-react-and-spring-data-rest ca1
```` 

* This command will create a new working copy in the "ca1" directory by checking the repository located at the specified
  path.

2. Version tagging

* Subversion does not have a native tagging mechanism like Git. Instead, we can create a tag by copying the trunk to a
  new directory in the tags folder.

 ```svn
      svn copy file:///C:/Users/Paulo\ Mouta/Documents/devops-23-24-JPE-1231833/trunk file:///C:/Users/Paulo\ Mouta/Documents/devops-23-24-JPE-1231833/tags/v1.1.0 -m "Tagging version 1.1.0"
      svn commit -m "Tagging version 1.1.0"
```

3. Commit the changes and create version tags for the initial version and the new feature.

```svn
   svn add .
   svn commit -m "#1 Added jobYears field + unit testing"
   svn copy file:///C:/Users/Paulo\ Mouta/Documents/devops-23-24-JPE-1231833/ca1/trunk file:///C:/Users/Paulo\ Moutatags/v1.2.0 -m "Creating tag for version 1.2.0"
  ```

* Subversion works with a centralized repository, so we can commit changes directly to the repository without needing to
  push them.

    6. At the end of the assignment mark your repository with the tag "ca1-part1".
       ```svn
       svn copy file:///C:/Users/Paulo\ Mouta/Documents/devops-23-24-JPE-1231833/ca1/trunk file:///C:/Users/Paulo\ Mouta/Documents/devops/Documents/devops-23-24-JPE-1231833/ca1/tags/ca1-part1 -m "Creating tag for assignment part 1"
  
       ```
* This command copies the current state of the project (usually from the trunk directory) to a new directory under tag "
  ca1-part1".

### Part 2

1. Creating a new branch.
    * To create a branch named "email-field" in Subversion, we need to follow a slightly different approach since
      Subversion does not have native support for branching in the same way as Git. Instead, we have to create a
      directory structure within our repository to represent branches.

```svn
   svn copy file:///C:/Users/Paulo\ Mouta/Documents/devops-23-24-JPE-1231833/ca1/trunk file:///C:/Users/Paulo\ Mouta/Documents/devops-23-24-JPE-1231833/ca1/branches/email-field -m "Creating branch for adding email field"
```

* This command creates a copy of the trunk directory in the branches directory, naming it "email-field". The -m flag is
  used to provide a commit message describing the branch.

2. Merge the new branch to the master branch.
    * Switch to the master branch
   ```svn
   svn switch file:///C:/Users/Paulo\ Mouta/Documents/devops-23-24-JPE-1231833/ca1/trunk
    ```
    * Merge the changes from the "email-field" branch to the master branch.
   ```svn
   svn merge ^/ca1/branches/email-field
    ```
    * Commit the changes and create a tag for the new version.
   ```svn
   svn commit -m "Merged email-field branch into master"
   svn copy file:///C:/Users/Paulo\ Mouta/Documents/devops-23-24-JPE-1231833/ca1/trunk file:///C:/Users/Paulo\ Mouta/Documents/devops-23-24-JPE-1231833/ca1/tags/v1.3.0 -m "Tagging version 1.3.0"
    ```
    * Push the changes to the repository
    ```svn
   svn commit -m "Tagging version 1.3.0"
    ```
3. Create the new branch named "fix-invalid-email"
    ```svn
    svn copy file:///C:/Users/Paulo\ Mouta/Documents/devops-23-24-JPE-1231833/ca1/trunk file:///C:/Users/Paulo\ Mouta/Documents/devops-23-24-JPE-1231833/ca1/branches/fix-invalid-email -m "Created branch to fix invalid email"
   
   svn switch file:///C:/Users/Paulo\ Mouta/Documents/devops-23-24-JPE-1231833/ca1/branches/fix-invalid-email
     ```
4. Merge the changes from the "fix-invalid-email" branch to the master branch.

```svn
   svn switch file:///C:/Users/Paulo\ Mouta/Documents/devops-23-24-JPE-1231833/ca1/trunk
   svn merge ^/ca1/branches/fix-invalid-email
   svn commit -m "Merged fix-invalid-email branch into master"

   svn copy file:///C:/Users/Paulo\ Mouta/Documents/devops-23-24-JPE-1231833/ca1/trunk file:///C:/Users/Paulo\ Mouta/Documents/devops-23-24-JPE-1231833/ca1/tags/v1.3.1 -m "Tagging version 1.3.1"
   svn commit -m "Tagging version 1.3.1"
```

5. Mark the repository with the tag "ca1-part2".

```svn
   svn copy file:///C:/Users/Paulo\ Mouta/Documents/devops-23-24-JPE-1231833/ca1/trunk file:///C:/Users/Paulo\ Mouta/Documents/devops-23-24-JPE-1231833/ca1/tags/ca1-part2 -m "Tagging ca1-part2"
   svn commit -m "Tagging ca1-part2"
```

### Conclusion

1. Git is a distributed version control system, which means that every user has a complete copy of the repository. This allows for offline work and faster branching and merging.
2. Subversion is centralized, with a single central repository. Users typically work with a checked-out copy of files and interact with the central server to commit changes.
3. Git outperforms in branching and merging, making it effortless to create lightweight branches for new features  and merge them back into the main branch with minimal effort.
4. Subversion supports branching and merging but is generally considered more complex compared to Git. Branches are heavier and branching/merging operations might require more manual intervention.
5. Overall, Git is often faster, especially for operations like branching, merging, and committing. This is due to its distributed nature and the ability to perform many operations locally without network access.
