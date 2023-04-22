from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()

driver.get("https://zoom.us/")

# Locate the "Join" button by XPath
join_button = driver.find_element(By.LINK_TEXT,'Sign In')

# Simulate a click on the "Join" button
join_button.click()

driver.find_element(By.XPATH,'//*[@id="email"]').send_keys("username")
driver.find_element(By.XPATH,'//*[@id="password"]').send_keys("pw")

login_button = driver.find_element(By.XPATH, "/html/body/div[1]/div[3]/div/div[2]/div/div[2]/div/div[1]/form/div[4]/button/span")
login_button.click()