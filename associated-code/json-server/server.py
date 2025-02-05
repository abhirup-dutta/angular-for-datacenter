import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from email.message import Message
import functools

print = functools.partial(print, flush=True)
'''
Save file as server.py
python3 server.py 8009
'''
class Server(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()
        print('setting headers of response ...')
        # print(str(self.headers))

    def _are_servers_available(self, json_data):
        print('printing received json ...')
        print(json_data);
        no_of_servers = json_data['numberOfServers']
        print('No of servers: %d' % no_of_servers)
        if no_of_servers <= 6:
            print('true')
        else:
            print('false')
        return no_of_servers <= 6

        
    def do_HEAD(self):
        self.send_response(200, "ok")
        self._set_headers()

    def do_OPTIONS(self):
        print('do_OPTIONS');
        self.send_response(200, "ok")
        self._set_headers()
        print('do_OPTIONS end')

    '''
    GET sends back a Hello world message
    curl http://localhost:8009
    {"hello": "world", "received": "ok"}%
    '''
    def do_GET(self, is_options):
        print('do_GET');
        self.send_response(200, "ok")
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
        print('do_POST')
        # read the message and convert it into a python dictionary
        length = int(self.headers.get('content-length'))
        message = json.loads(self.rfile.read(length))
        
        # add a property to the object, just to mess with data
        message['received'] = 'ok'
        print('printing message in do_POST ...');
        print(message);

        if self._are_servers_available(message):
            self.send_response(200, "Servers available, proceeding with imaging.");
            message['response'] = 'Servers available, proceeding with imaging.';
            print('sending ok response ...')
        else:
            self.send_response(503, "Only 6 servers are currently available in the pool. Please retry.");
            message['response'] = 'Only 6 servers are currently available in the pool. Please retry.';
            print('sending unavailable response ...')
        
        self._set_headers();

        # send the message back
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

