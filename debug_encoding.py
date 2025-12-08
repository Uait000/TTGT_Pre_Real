import os
from bs4 import BeautifulSoup


FILE_TO_CHECK = '1.html' 
SCHEDULE_DIR = os.path.join('public', 'htmlclass')


file_path = os.path.join(SCHEDULE_DIR, FILE_TO_CHECK)

if not os.path.exists(file_path):
    print(f"[ОШИБКА] Не могу найти файл: {file_path}")
    exit()

print(f"--- Начинаю диагностику файла: {file_path} ---")

# --- Попытка №1: Читаем как UTF-8 ---
print("\n--- 1. Пытаюсь прочитать как UTF-8 (стандарт): ---")
try:
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content_utf8 = f.read()
    
    soup_utf8 = BeautifulSoup(content_utf8, 'html.parser')
    text_utf8 = soup_utf8.get_text()
    
    clean_text_utf8 = ' '.join(text_utf8.split())
    
    print(f"    [OK] Прочитано как UTF-8. Первые 500 символов текста:")
    print("    " + clean_text_utf8[0:500])
except Exception as e:
    print(f"    [ОШИБКА] при чтении как UTF-8: {e}")

# --- Попытка №2: Читаем как Windows-1251 ---
print("\n--- 2. Пытаюсь прочитать как Windows-1251 (старая кодировка): ---")
try:
    with open(file_path, 'r', encoding='windows-1251', errors='ignore') as f:
        content_win = f.read()
    
    soup_win = BeautifulSoup(content_win, 'html.parser')
    text_win = soup_win.get_text()
    
    clean_text_win = ' '.join(text_win.split())
    
    print(f"    [OK] Прочитано как Windows-1251. Первые 500 символов текста:")
    print("    " + clean_text_win[0:500])
except Exception as e:
    print(f"    [ОШИБКА] при чтении как Windows-1251: {e}")

print("\n--- Диагностика завершена ---")