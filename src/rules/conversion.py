import csv
import json

data = {}

def createJson(csv_path,json_path):
    with open(csv_path, encoding="utf-8") as csv_file:

        csv_contents = csv.DictReader(csv_file)

        for i, row in enumerate(csv_contents, 1):
            if "url" in row:
                data[i]=row["url"]

    with open(json_path, "w", encoding="utf-8"
              ) as json_file:
        json_file.write(json.dumps(data))


csv_file = "verified_online.csv"
json_file = "domain_names.json"

createJson(csv_file, json_file)