import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import json
import time

# Başlangıç URL'si
start_url = "https://devnar.github.io/"

# Geçici değişkenler
discovered_links = [start_url]
visited_links = set()

# Daha önce kaydedilmiş veriyi yükle (veri varsa)
data_file = "data.json"
try:
    with open(data_file, "r", encoding="utf-8") as file:
        saved_data = json.load(file)
        visited_links = set(item["url"] for item in saved_data)
except FileNotFoundError:
    saved_data = []

# Fonksiyon: Bir URL'den veri alır ve meta bilgileri döndürür
def scrape_url(url):
    try:
        response = requests.get(url, timeout=10, headers={"User-Agent": "Pigeon Bot/1.0"})
        soup = BeautifulSoup(response.content, "html.parser")

        # no-index kontrolü
        meta_robots = soup.find("meta", {"name": "robots"})
        if meta_robots and "noindex" in meta_robots.get("content", "").lower():
            print(f"[NO-INDEX]: {url}")
            return {"url": url, "no_index": True, "links": find_links(soup, url)}

        # Meta bilgilerini al
        title = soup.title.string if soup.title else None
        description = soup.find("meta", {"name": "description"})
        description = description["content"] if description else None
        icon = soup.find("link", {"rel": "icon"})
        icon = urljoin(url, icon["href"]) if icon else None
        og_image = soup.find("meta", {"property": "og:image"})
        og_image = og_image["content"] if og_image else None

        # Sayfadaki bağlantıları bul
        links = find_links(soup, url)

        print(f"[SCRAPED]: {url}")
        return {
            "url": url,
            "title": title,
            "description": description,
            "icon": icon,
            "og_image": og_image,
            "links": links,
            "no_index": False,
        }
    except Exception as e:
        print(f"[ERROR]: {url} - {e}")
        return {"url": url, "error": str(e)}

# Fonksiyon: Sayfadaki tüm bağlantıları bulur
def find_links(soup, base_url):
    links = set()
    for a_tag in soup.find_all("a", href=True):
        link = urljoin(base_url, a_tag["href"])
        if link.startswith("http") and link not in visited_links:
            links.add(link)
    return list(links)

# Veriyi data.json dosyasına kaydeder
def save_to_file(data):
    saved_data.append(data)
    with open(data_file, "w", encoding="utf-8") as file:
        json.dump(saved_data, file, ensure_ascii=False, indent=4)

# Tarama döngüsü
def crawl():
    print("Pigeon Bot çalışıyor! Başlangıç sitesi:", start_url)
    while discovered_links:
        current_url = discovered_links.pop(0)

        # Eğer bu bağlantı zaten işlendi ise geç
        if current_url in visited_links:
            continue

        # URL'yi tara ve işlenmiş bağlantılara ekle
        result = scrape_url(current_url)
        visited_links.add(current_url)

        # Tarama sonucunu dosyaya kaydet
        save_to_file(result)

        # Eğer yeni bağlantılar bulduysa bunları sıraya ekle
        if not result.get("no_index") and "links" in result:
            for link in result["links"]:
                if link not in visited_links and link not in discovered_links:
                    discovered_links.append(link)

        # Tarama hızını kontrol etmek için bekleme (isteğe bağlı)
        time.sleep(1)

if __name__ == "__main__":
    crawl()
