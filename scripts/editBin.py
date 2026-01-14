import sys

def process_bin(): 
    try:
        # 1. Читаем данные из stdin
        input_data = bytearray(sys.stdin.buffer.read())
        
        if not input_data:
            # Ошибки пишем ТОЛЬКО в stderr
            print("Данные не получены", file=sys.stderr)
            return

        file_size = len(input_data)
        
        # 2. Определяем адреса
        addresses = {
            0x10: 0xAA,
            0x20: 0xBB,
            0x30: 0xCC,
            0x40: 0xDD,
            0x50: 0xEE
        }

        # 3. Применяем правки
        for addr, value in addresses.items():
            if addr < file_size:
                input_data[addr] = value

        # 4. ПИШЕМ РЕЗУЛЬТАТ (Важно: используем input_data, а не data)
        sys.stdout.buffer.write(input_data)
        sys.stdout.buffer.flush()
        
    except Exception as e: 
        # Если что-то пошло не так, выводим ошибку для Node.js
        print(f"Python Runtime Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    process_bin()