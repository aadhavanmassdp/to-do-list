import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.*;

import java.time.Duration;
import java.util.List;

public class TodoAppTest {

    WebDriver driver;

    @BeforeClass
    public void setup() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
        driver.manage().window().maximize();

        driver.get("http://localhost:5500/index.html");

        // Clear localStorage to avoid flaky tests
        ((JavascriptExecutor) driver)
                .executeScript("window.localStorage.clear();");
        driver.navigate().refresh();
    }

    @Test
    public void addTaskTest() {
        driver.findElement(By.id("task-title"))
                .sendKeys("Selenium Test Task");

        driver.findElement(By.id("task-category"))
                .sendKeys("Testing");

        driver.findElement(By.id("task-tags"))
                .sendKeys("selenium,automation");

        driver.findElement(By.id("task-due"))
                .sendKeys("2026-12-31");

        driver.findElement(By.id("task-assigned"))
                .sendKeys("QA Team");

        driver.findElement(By.cssSelector("#task-form button[type='submit']"))
                .click();

        List<WebElement> tasks =
                driver.findElements(By.cssSelector(".task-item"));

        Assert.assertTrue(
                tasks.stream().anyMatch(t -> t.getText().contains("Selenium Test Task")),
                "Task was not added"
        );
    }

    @Test(dependsOnMethods = "addTaskTest")
    public void completeTaskTest() {
        WebElement task =
                driver.findElement(By.xpath("//li[contains(@class,'task-item')]"));

        WebElement completeBtn =
                task.findElement(By.className("toggle-complete"));

        completeBtn.click();

        Assert.assertTrue(
                task.getAttribute("class").contains("completed"),
                "Task was not marked as completed"
        );
    }

    @Test(dependsOnMethods = "completeTaskTest")
    public void deleteTaskTest() {
        WebElement deleteBtn =
                driver.findElement(By.className("delete-task"));

        deleteBtn.click();
        driver.switchTo().alert().accept();

        List<WebElement> tasks =
                driver.findElements(By.cssSelector(".task-item"));

        Assert.assertTrue(
                tasks.size() == 1 &&
                tasks.get(0).getText().contains("No tasks found"),
                "Task was not deleted properly"
        );
    }

    @AfterClass
    public void tearDown() {
        driver.quit();
    }
}
