package pages;

import org.openqa.selenium.*;

public class TodoPage {

    private WebDriver driver;

    public TodoPage(WebDriver driver) {
        this.driver = driver;
    }

    // Locators
    private By titleInput = By.id("task-title");
    private By categoryInput = By.id("task-category");
    private By tagsInput = By.id("task-tags");
    private By dueDateInput = By.id("task-due");
    private By assignedInput = By.id("task-assigned");
    private By submitBtn = By.cssSelector("#task-form button");
    private By taskItems = By.cssSelector(".task-item");
    private By completeBtn = By.className("toggle-complete");
    private By deleteBtn = By.className("delete-task");

    // Actions
    public void addTask(String title, String category, String tags,
                        String dueDate, String assigned) {

        driver.findElement(titleInput).sendKeys(title);
        driver.findElement(categoryInput).sendKeys(category);
        driver.findElement(tagsInput).sendKeys(tags);
        driver.findElement(dueDateInput).sendKeys(dueDate);
        driver.findElement(assignedInput).sendKeys(assigned);
        driver.findElement(submitBtn).click();
    }

    public boolean isTaskPresent(String taskName) {
        return driver.findElements(taskItems)
                .stream()
                .anyMatch(t -> t.getText().contains(taskName));
    }

    public void markTaskCompleted() {
        driver.findElement(completeBtn).click();
    }

    public boolean isTaskCompleted() {
        return driver.findElement(taskItems)
                .getAttribute("class")
                .contains("completed");
    }

    public void deleteTask() {
        driver.findElement(deleteBtn).click();
        driver.switchTo().alert().accept();
    }
}
