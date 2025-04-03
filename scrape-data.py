import requests
from bs4 import BeautifulSoup
import csv
import pandas
import time, random
import os

ROOT_URL = "https://www.mynextmove.org"

def open_html(path):
    with open(path, 'rb') as f:
        return f.read()
    

def save_html(html, path):
    with open(path, 'wb') as f:
        f.write(html)
    
def import_root():  
      # Get base url
    url = f'{ROOT_URL}/find/browse?c=0'
    r = requests.get(url)
    print(r.content[:100])
    save_html(r.content, 'data/mynextmove')
    
def save_links():
    r = open_html("data/mynextmove")
    soup = BeautifulSoup(r, 'html.parser')
    links = soup.select('.list-group-item a')
    
    with open("data/links.csv", "w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["Text", "URL"])  # Write header

        for link in links:
            text = link.get_text(strip=True)  # Get link text
            href = link.get("href")  # Get href (URL)
            
            if href:  # Only save if href exists
                writer.writerow([text, href])

def import_pages():
#     # Load the CSV file
#     df = pandas.read_csv("data/links.csv")

#     # Remove rows where the 'Name' column (first column) is missing
#     df_cleaned = df.dropna(subset=[df.columns[0]])  # First column is assumed to be 'Name'
#     df_cleaned.loc[:, df_cleaned.columns[0]] = (
#     df_cleaned[df_cleaned.columns[0]]
#     .str.strip()
#     .str.lower()
#     .str.replace(',','', regex=True)
#     .str.replace(" & ", "-", regex=True)
#     .str.replace(" ", "-", regex=True)
#     .str.replace('/','-')
# )
#     # Save the cleaned file
#     df_cleaned.to_csv("data/cleaned_links.csv", index=False)

    df_cleaned = pandas.read_csv("data/cleaned_links.csv")
    
    # Read each row and get name + URL
    for index, row in df_cleaned.iterrows():
        name = row[df_cleaned.columns[0]]  # First column (Name)
        url = row[df_cleaned.columns[1]]   # Second column (URL)
        
        file_path = f'data/pages/{name}'
        if os.path.exists(file_path):
            continue
        
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
        r = requests.get(f'{ROOT_URL}{url}', headers=headers)
        save_html(r.content, file_path)
        time.sleep(random.uniform(1, 5))

def main():
    import_pages()

main()