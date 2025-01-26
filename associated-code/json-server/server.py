import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from email.message import Message

'''
Save file as server.py
python3 server.py 8009
'''
class Server(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
    def do_HEAD(self):
        self._set_headers()
        
    '''
    GET sends back a Hello world message
    curl http://localhost:8009
    {"hello": "world", "received": "ok"}%
    '''
    def do_GET(self):
        self._set_headers()
        message_str = json.dumps({'hello': 'world', 'received': 'ok'})
        message_bytes = message_str.encode('utf-8')
        self.wfile.write(message_bytes)
        
    '''
    POST echoes the message adding a JSON field
    curl --data "{\"this\":\"is a test\"}"
        --header "Content-Type: application/json"
            http://localhost:8009
    {"this": "is a test", "received": "ok"}%
    '''
    def do_POST(self):
        # read the message and convert it into a python dictionary
        length = int(self.headers.get('content-length'))
        message = json.loads(self.rfile.read(length))
        
        # add a property to the object, just to mess with data
        message['received'] = 'ok'
        
        # send the message back
        self._set_headers()
        message_str = json.dumps(message)
        message_bytes = message_str.encode('utf-8')
        self.wfile.write(message_bytes)

        
def run(server_class=HTTPServer, handler_class=Server, port=8008):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    
    print('Starting httpd on port %d...' % port)
    httpd.serve_forever()
    
if __name__ == "__main__":
    from sys import argv
    
    if len(argv) == 2:
        run(port=int(argv[1]))
    else:
        run()

