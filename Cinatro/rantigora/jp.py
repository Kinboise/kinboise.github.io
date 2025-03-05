from joppy.client_api import ClientApi

path = 'Cinatro/rantigora'
with open(f'{path}/account.txt', 'r', -1, 'utf-8') as f:
    lines = f.readlines()
token = lines[0].strip()
id = lines[1].strip()

content = ClientApi(token).get_note(id, fields='body').body
