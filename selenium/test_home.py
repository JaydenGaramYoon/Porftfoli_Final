from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

# 브라우저 실행 (Service 객체로 전달)
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)

# 본인 사이트 주소로 접속 (예: 로컬 개발 서버)
driver.get("http://localhost:3000")

# "Garam Yoon" 텍스트가 있는지 확인
assert "Garam Yoon" in driver.page_source

# "Resume" 링크가 보이는지 확인
resume = driver.find_element(By.LINK_TEXT, "Resume")
assert resume.is_displayed()

# 브라우저 종료
driver.quit()