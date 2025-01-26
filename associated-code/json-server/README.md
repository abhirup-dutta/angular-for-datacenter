    Save file as server.py
    python3 server.py 8009

    GET sends back a Hello world message
    curl http://localhost:8009
    {"hello": "world", "received": "ok"}%

    POST echoes the message adding a JSON field
    curl --data "{\"this\":\"is a test\"}"
        --header "Content-Type: application/json"
            http://localhost:8009
    {"this": "is a test", "received": "ok"}%
