import sys

def process_bin(): 
    input_data = bytearray(sys.stdin.buffer.read())
    
    if not input_data:
        print("Данные не получены")
        return

    file_size = len(input_data)
    first_bytes = input_data[:4].hex()
    addressOne = 0x10
    addressTwo = 0x20 
    addressThree = 0x30
    addressFour = 0x40
    addressFive = 0x50
    if addressOne < file_size:
        input_data[addressOne] = 0xAA
        
    if addressTwo < file_size:
        input_data[addressTwo] = 0xBB
    if addressThree < file_size:
        input_data[addressThree] = 0xCC
    if addressFour < file_size:
        input_data[addressFour] = 0xDD
    if addressFive < file_size:
        input_data[addressFive] = 0xEE
 
    sys.stdout.buffer.write(input_data)
if __name__ == "__main__":
    process_bin()