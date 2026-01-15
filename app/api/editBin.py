from http.server import BaseHTTPRequestHandler
import cgi

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # 1. Читаем входящий файл из формы
        form = cgi.FieldStorage(
            fp=self.rfile,
            headers=self.headers,
            environ={'REQUEST_METHOD': 'POST'}
        )
        
        file_item = form['binFile']
        if file_item.file:
            data = bytearray(file_item.file.read())
        if len(data) > 0x50:
                data[0x10] = 0xAA
                data[0x20] = 0xBB
                data[0x30] = 0xCC
                data[0x40] = 0xDD
                data[0x50] = 0xEE
                
 
        self.send_response(200)
        self.send_header('Content-type', 'application/octet-stream')
        self.send_header('Content-Disposition', 'attachment; filename="modified.bin"')
        self.end_headers()
        self.wfile.write(data)
        return