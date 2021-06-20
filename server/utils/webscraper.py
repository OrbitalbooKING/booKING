import csv
from re import sub
import requests
from bs4 import BeautifulSoup
from requests.api import head

URL = 'https://www.comp.nus.edu.sg/maps/venues/'
page = requests.get(URL)

soup = BeautifulSoup(page.content, 'html.parser')

venue_table = soup.find("table", attrs={"class": "newtab"})
venue_table_data = venue_table.find_all("tr")

## get headings (like location, unit no etc.)
headings = []
for th in venue_table_data[1].find_all("th"):
    headings.append(th.text.replace('\n', ' ').strip())
headings.append("Venue type")

## get subheadings (like meeting room, conference room etc.)
sub_headings = []
## got to split cause the rest of the subheadings not td tag
for td in venue_table_data[0].find_all("td"):
    sub_headings.append(td.text.replace('\n', ' ').strip())
for row in venue_table_data[4:]:
    for th in row.find_all("th"):
        sub_headings.append(th.text.replace('\n', ' ').strip())

## get all row information, stored in a dictionary.
## key is subheading, value is an array of arrays that contain each venue and its information
table_data = []
current_type = venue_table_data[0].find("td").text
temp_counter = 0
for row in venue_table_data[5:]:
    t_row = {}

    ## converting to iter so we can use next method later on 
    iter_headings = iter(headings)
    iter_rows = iter(row.find_all(["td", "th"]))

    for header, td in zip(iter_headings, iter_rows):
        if td.b != None:            ## check if its row of labels
            continue
        elif td.a != None:          ## check if its hyperlink
            t_row[header] = "https://www.comp.nus.edu.sg" + td.a.get('href')
        elif td.name == "th":       ## check if its a header row
            current_type = td.text
        elif td.text == "SYSTEMS & NETWORKING RESEARCH Lab 8:National Cybersecurity R&D Lab":  
            t_row[header] = td.text.replace('\n', ' ').strip()
            temp_counter = 3
        else:
            if 0 < temp_counter < 3:
                header = next(iter_headings)
                print(header)
                t_row[header] = td.text.replace('\n', ' ').strip()
            else:
                t_row[header] = td.text.replace('\n', ' ').strip()
    
    
    if t_row:                       ## if t_row is not empty, add venue type 
        if 0 < temp_counter < 3:    ## if its that special row 
            t_row["Room"] = "SYSTEMS & NETWORKING RESEARCH Lab 8:National Cybersecurity R&D Lab"
            
        t_row["Venue type"] = current_type
        table_data.append(t_row)

    temp_counter -= 1

print("Headings:", headings)
print("Sub headings:", sub_headings)
# print("Full data table:")
# for elem in table_data:
#     print(elem, end='\n')

with open("socvenues.csv", 'w') as out_file:
    writer = csv.DictWriter(out_file, fieldnames=headings)
    writer.writeheader()
    writer.writerows(table_data)