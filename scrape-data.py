import requests
from bs4 import BeautifulSoup
import csv
import pandas
import time, random
import os
from pymongo import MongoClient
from dotenv import load_dotenv
import json

load_dotenv(dotenv_path='config/.env')

ROOT_URL = "https://www.mynextmove.org"
CONNECTION_STRING = os.getenv('MONGO_CONNECT')
print("Connection string:", CONNECTION_STRING)

# Connect to database
client = MongoClient(CONNECTION_STRING)
database = client['career-info']
info_collection = database['information']
questions_collection = database['questions']

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

def gather_page_data(file):
    page = open_html(file)
    soup = BeautifulSoup(page, 'html.parser')
    
    page_data = {}
    
    # Select career title
    page_data['title'] = soup.select_one('.main').get_text()
    
    # Select page content
    sections = soup.find_all('div', class_='report-section')
    for section in sections:
        section_content = []
        title = section.find('h2', class_='report-section-header').get_text(strip=True)
        if title == "Technology": # skip all sections after technology
            break
        # get all section content
        content = section.select('.subsec li')
        content = content or section.select('.my-0 li')
        for element in content:
            section_content.append(element.get_text())
        page_data[title] = section_content
        
    # Put info in mongoDB database
    info_collection.insert_one(page_data)
    
    # Check results are correct
    print(page_data)
    
def getAttributes():
    unique_attributes = {
        "Knowledge": set(),
        "Skills": set(),
        "Abilities": set(),
        "Personality": set()
    }

    for doc in info_collection.find():
        for key in unique_attributes.keys():
            if key in doc and isinstance(doc[key], list):
                unique_attributes[key].update(doc[key])

    # Convert sets to sorted lists for readability
    for key in unique_attributes:
        unique_attributes[key] = sorted(list(unique_attributes[key]))

    for category, items in unique_attributes.items():
        print(f"\n{category} ({len(items)} items):")
        for item in items:
            print(f"- {item}")

def loadQuestions():
    with open('data/career_questions.json', 'r', encoding='utf-8') as file:
        questions = json.load(file)

    result = questions_collection.insert_many(questions)
    
def remove_agree_phrase():
    # Loop through all questions and update them
    for question in questions_collection.find():
        updated_question = question['question'].replace('How strongly do you agree:', '').strip()
        
        # Update the question in the collection
        questions_collection.update_one(
            {'_id': question['_id']},  # Find the document by its _id
            {'$set': {'question': updated_question}}  # Set the updated question
        )
    print('complete')
        
        
def main():
    remove_agree_phrase()

main()