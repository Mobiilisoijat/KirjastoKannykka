from pyngrok import ngrok

# THIS FILE IS USED FOR STARTING THE TUNNEL
# YOU DO NOT NEED TO RUN THIS FILE IF YOU WANT TO CONNECT

httpTunnel = ngrok.connect("5001")

print("ngrok started at url:", httpTunnel)

input("Press Enter to stop the tunnel.")
