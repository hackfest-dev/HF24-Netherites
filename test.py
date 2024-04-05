import requests,json
import time

with open('output.txt', 'r', encoding='utf-8') as file:
    data = file.read()
    url = "http://localhost:5000/get_documents"
    json_data = json.dumps({
        "query":"Important contributions about elon musk ?",
        "context":data
    })

    # Make the POST request
    t = time.time()
    response = requests.post(url, json=json_data)
    print(time.time() - t)

    url2="http://localhost:5001/generate_response"
    json_data2 = json.dumps({
        "prompt":'summarize this',
        "context":response.json()
    })

    response2 = requests.post(url2, json=json_data2)

    print(response2.text)