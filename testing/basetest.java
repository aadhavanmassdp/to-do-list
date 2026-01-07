package base;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.annotations.*;

import java.time.Duration;

public class BaseTest {

    protected WebDriver driver;

    @BeforeClass
    public void setup() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();

        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
        driver.manage().window().maximize();

        driver.get("http://localhost:5500/index.html");

        // CRITICAL: reset app state
        ((JavascriptExecutor) driver)
                .executeScript("window.localStorage.clear();");
        driver.navigate().refresh();
    }

    @AfterClass
    public void tearDown() {
        driver.quit();
    }
}
