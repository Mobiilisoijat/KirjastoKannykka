from pyngrok import ngrok
import requests

###THIS FILE IS NOT ACTUALLY NEEDED ANYMORE, BUT IT IS SAVED HERE TO SHOW I DID SOMETHING

# THIS FILE IS USED FOR STARTING THE TUNNEL
# YOU DO NOT NEED TO RUN THIS FILE IF YOU WANT TO CONNECT

httpTunnel = ngrok.connect("5001")

#print(ngrok.get_tunnels())
if len(ngrok.get_tunnels()) > 0:
  print("ok")
  r = requests.get(f"https://www.duckdns.org/update?domains=DELETED&token=DELETED&txt={httpTunnel.public_url}&verbose=true")
  print(r.status_code)
  print(r.text)

print("ngrok started at url:", httpTunnel)
print("url:", httpTunnel.public_url)

input("Press Enter to stop the tunnel.")
