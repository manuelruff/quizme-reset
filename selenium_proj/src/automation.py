from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.common.exceptions import WebDriverException
from translations import translations

def start_automation(url, app, messagebox, language):
    """Start the automation process with language-based messages."""
    lang = translations[language]

    if not url:
        messagebox.showerror(lang["error_message"], lang["url_error"])
        return

    try:
        messagebox.showinfo(lang["info_login"], lang["info_login"])
        app.withdraw()

        try:
            driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        except WebDriverException:
            messagebox.showerror(lang["error_message"], lang["error_message"])
            return

        driver.get(url)

        try:
            login_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "a.openModal.Button"))
            )
            login_button.click()
        except Exception:
            messagebox.showerror(lang["error_message"], lang["login_error"])
            return

        # Wait for login
        WebDriverWait(driver, 300).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, 'option[value="0"]'))
        )

        navigate_and_reset_all_pages(driver)

        messagebox.showinfo(lang["done_message"], lang["done_message"])

    except Exception as e:
        messagebox.showerror(lang["error_message"], f"{lang['error_message']}: {e}")
    finally:
        try:
            driver.quit()
        except Exception as e:
            print(f"Error while closing the driver: {e}")

def reset_priorities_on_page(driver):
    """Resets all selectPriority elements on the current page."""
    WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located((By.CLASS_NAME, "selectPriority"))
    )

    select_elements = driver.find_elements(By.CLASS_NAME, "selectPriority")
    for select_element in select_elements:
        driver.execute_script("arguments[0].value = '0';", select_element)
        driver.execute_script("arguments[0].dispatchEvent(new Event('change', { bubbles: true }));", select_element)

def navigate_and_reset_all_pages(driver):
    """Navigates through all pages and resets priorities."""
    while True:
        reset_priorities_on_page(driver)
        try:
            next_button = driver.find_element(By.CSS_SELECTOR, '.pagination a[rel="next"]')
            next_button.click()
        except Exception:
            break
