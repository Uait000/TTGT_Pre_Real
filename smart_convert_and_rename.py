import os
import re
from bs4 import BeautifulSoup

PRIMARY_ENCODING = 'windows-1251'
FALLBACK_ENCODING = 'utf-8'
TARGET_ENCODING = 'utf-8'

BASE_DIR = os.path.join('public', 'htmlclass')
STUDENT_DIR = os.path.join(BASE_DIR, 'students')
TEACHER_DIR = os.path.join(BASE_DIR, 'teachers')


GROUP_NAMES = [
    'А-1-1', 'В-1-1', 'Д-1-1', 'Д-1-2', 'КС-1-1', 'КС-1-2', 'КС-1-3', 'Л-1-1', 'Л-1-2', 'Л-1-3', 'Л-1-4', 'Л-1-5', 'П-1-1', 'ПМ-1-1', 'Р-1-1', 'С-1-1', 'СП-1-1', 'ЭС-1-1',
    'А-2-1', 'В-2-1', 'Д-2-1', 'Д-2-2', 'Д-2-3', 'КС-2-1', 'КС-2-2', 'КС-2-3', 'Л-2-1', 'Л-2-2', 'Л-2-3', 'Л-2-4', 'Л-2-5', 'П-2-1', 'ПМ-2-1', 'Р-2-1', 'С-2-1', 'СП-2-1', 'Э-2-1', 'ЭС-2-1',
    'А-3-1', 'В-3-1', 'Д-3-1', 'Д-3-2', 'Д-3-3', 'КС-3-1', 'КС-3-2', 'Л-3-1', 'Л-3-2', 'Л-3-3', 'Л-3-4', 'Л-3-5', 'Л-3-6', 'П-3-1', 'ПМ-3-1', 'ПМ-3-2', 'Р-3-1', 'С-3-1', 'СП-3-1', 'ЭС-3-1',
    'А-4-1', 'В-4-1', 'Д-4-1', 'Д-4-2', 'КС-4-1', 'КС-4-2', 'Л-4-1', 'Л-4-2', 'Л-4-3', 'Л-4-4', 'Л-4-5', 'ПМ-4-1', 'Р-4-1', 'С-4-1', 'СП-4-1', 'ЭС-4-1'
]

TEACHER_NAMES = [
  'Акиева Н.В.', 'Акимов Р.С.', 'Андрусенко Т.Н.', 'Арчаков В.Ю.', 'Белевцева А.Н.', 
  'Бердыч С.А.', 'Березкин А.Н.', 'Березкина Т.А.', 'Биркина Н.И.', 'Буйная Ю.А.', 
  'Бунич О.В.', 'Бурлакова Т.А.', 'Бурняшева Е.В.', 'Буров А.В.', 'ВАКАНСИЯ', 
  'Вайдман М.А.', 'Волкова Е.В.', 'Вороненко Д.Д.', 'Воярж Е.В.', 'Выставкина О.В.', 
  'Галушкин С.В.', 'Гамачек Т.В.', 'Гамрецкий С.А.', 'Гришина Н.А.', 'Дернова М.А.', 
  'Есипенко С.Н.', 'Жестеров С.С.', 'Жестерова Н.Д.', 'Злобин С.Ф.', 'Злобина Т.С.', 
  'Ивакина М.В.', 'Игнатьев В.Ю.', 'Исаев А.Н.', 'Исаева Е.С.', 'Квашенкина Е.С.', 
  'Кочеткова Т.Г.', 'Кравцов А.В.', 'Крымпоха В.Б.', 'Кулешин С.С.', 'Курзюков В.В.', 
  'Кустов И.В.', 'Кучеренко С.А.', 'Лагерева С.В.', 'Ляув Н.А.', 'Максимова Л.В.', 
  'Марушан С.В.', 'Моисеева С.А.', 'Мошура К.Г.', 'Мясищев А.Л.', 'Наливайко В.Г.', 
  'Неминущий М.И', 'Новиков С.А.', 'Новикова И.В.', 'Орищенко С.В.', 'Парамонова Г.И.', 
  'Перевозчиков В.В.', 'Половец Л.В.', 'Предеина Е.И.', 'Рашевская Н.А.', 'Самсонова Н.В.', 
  'Сафронова О.В.', 'Сингаева Е.Ю.', 'Скрипниченко А.В.', 'Спиваков С.А.', 'Сырый А.А.', 
  'Тагинцева Т.Е.', 'Токарев М.В.', 'Трачук С.Н.', 'Тюльпинова Ю.С.', 'Удовенко Е.А.', 
  'Украинский А.В.', 'Халанская С.А.', 'Цуканова Т.В.', 'Чайкина Л.Н.', 'Червякова Т.Т.', 
  'Чуркина О.Н.', 'Шатов С.Н.', 'Щебельникова Т.Ю.', 'Юрченко А.Н.', 'Яковлева Е.В.', 
  'Яковлева Т.Г.', 'Яковлева Ю.О.', 'Ярцева О.Б.', 'Ястребова Г.А.'
]

SORTED_GROUPS = sorted(GROUP_NAMES, key=len, reverse=True)
SORTED_TEACHERS = sorted(TEACHER_NAMES, key=len, reverse=True)


def normalize_text_for_search(text):
    return re.sub(r'[^a-zа-я0-9]', '', text, flags=re.IGNORECASE).upper()

def find_name_in_text(text, names_to_find):

    for name in names_to_find:

        pattern = r'[^a-zа-я0-9]' + re.escape(name) + r'[^a-zа-я0-9]'
        try:
            if re.search(pattern, text, flags=re.IGNORECASE):
                return name
        except re.error as e:
            print(f"    [ОШИБКА REGEX] для имени '{name}': {e}")

    normalized_text = normalize_text_for_search(text)
    for name in names_to_find:
        normalized_name = normalize_text_for_search(name)
        if normalized_name in normalized_text:
            return name
            
    return None

def find_name_and_modify_html(file_path, names_to_find):
    """
    Пытается прочитать файл в 2-х кодировках, найти имя и вставить <meta>
    """
    found_name = None
    original_encoding = None
    soup = None
    text_to_search = None
    try:
        with open(file_path, 'r', encoding=PRIMARY_ENCODING, errors='ignore') as f:
            content = f.read()
        soup = BeautifulSoup(content, 'html.parser')
        text_to_search = content 
        found_name = find_name_in_text(text_to_search, names_to_find)
        if found_name:
            original_encoding = PRIMARY_ENCODING
    except Exception as e:
        pass 
    if not found_name:
        try:
            with open(file_path, 'r', encoding=FALLBACK_ENCODING, errors='ignore') as f:
                content = f.read()
            soup = BeautifulSoup(content, 'html.parser')
            text_to_search = content
            found_name = find_name_in_text(text_to_search, names_to_find)
            if found_name:
                original_encoding = FALLBACK_ENCODING
        except Exception as e:
            print(f"    [ИНФО] Ошибка при чтении {FALLBACK_ENCODING}: {e}")
    if found_name and soup:
        head = soup.find('head')
        if not head:
            head = soup.new_tag('head')
            if soup.html: soup.html.insert(0, head)
            else: soup.insert(0, head)
            print(f"    [ИНФО] В файле {os.path.basename(file_path)} создан тег <head>.")
        if head.find('meta', attrs={'http-equiv': 'Content-Type'}):
            head.find('meta', attrs={'http-equiv': 'Content-Type'}).decompose()
        if head.find('meta', charset=True):
            head.find('meta', charset=True).decompose()

        meta_tag = soup.new_tag('meta')
        meta_tag['charset'] = 'utf-8'
        head.insert(0, meta_tag)
        
        return found_name, soup.encode(TARGET_ENCODING), original_encoding
    
    # Если ничего не нашли
    return None, None, None

def process_directory(directory, names_list, name_type):
    print(f"\n--- Сканирую папку {name_type}: {directory} ---")
    
    if not os.path.exists(directory):
        print(f"[ПРЕДУПРЕЖДЕНИЕ] Папка не найдена: {directory}. Пропускаю.")
        return 0, 0, 0

    converted_count = 0
    error_count = 0
    skipped_count = 0
    
    valid_names_set = set(f"{name}.html" for name in names_list)
    files_to_scan = []
    
    for f in os.listdir(directory):
        if f.endswith('.html') and f not in valid_names_set:
            files_to_scan.append(f)
            
    if not files_to_scan:
        print(f"[ИНФО] Не найдено файлов для обработки в {name_type}.")
        return 0, 0, 0
    else:
        print(f"Найдено {len(files_to_scan)} файлов для обработки...")

    for filename in files_to_scan:
        old_file_path = os.path.join(directory, filename)
        
        print(f"--- Сканирую: {filename}")
        found_name, content_to_save, original_encoding = find_name_and_modify_html(old_file_path, names_list)
        
        if found_name and content_to_save and original_encoding:
            new_file_name = f"{found_name}.html"
            new_file_path = os.path.join(directory, new_file_name)
            
            if os.path.exists(new_file_path):
                base, ext = os.path.splitext(filename)
                dupe_file_name = f"{found_name}_DUPE_FROM_{base}{ext}"
                dupe_file_path = os.path.join(directory, dupe_file_name)
                
                print(f"    [ПРЕДУПРЕЖДЕНИЕ] Конфликт: {new_file_name} уже существует.")
                
                try:
                    with open(dupe_file_path, 'wb') as f: f.write(content_to_save)
                    print(f"    [OK] Сохраняю как дубликат: {dupe_file_name}")
                    os.remove(old_file_path)
                except Exception as e:
                    print(f"    [ОШИБКА] Не удалось сохранить дубликат {dupe_file_name}: {e}")

                skipped_count += 1
            else:
                try:
                    with open(new_file_path, 'wb') as f: f.write(content_to_save)
                    print(f"    [OK] {filename} (прочитан как {original_encoding}) -> {new_file_name} (кодировка {TARGET_ENCODING} + <meta> тег)")
                    
                    try:
                        os.remove(old_file_path)
                        print(f"    [OK] Старый файл {filename} удален.")
                    except OSError as e:
                        print(f"    [ОШИКА] Не удалось удалить старый файл {filename}: {e}")
                        
                    converted_count += 1
                except Exception as e:
                    print(f"    [ОШИБКА] Не удалось сохранить {new_file_name}: {e}")
                    error_count += 1
        else:
            print(f"    [ПРЕДУПРЕЖДЕНИЕ] В файле {filename} не найдено имя ({name_type}). Файл пропущен.")
            error_count += 1
            
    return converted_count, error_count, skipped_count

# --- 3. Запуск ---
if __name__ == "__main__":
    print(f"--- Запуск умной конвертации и переименования ---")
    print(f"--- Попытка 1: {PRIMARY_ENCODING}, Попытка 2: {FALLBACK_ENCODING} -> Конечная: {TARGET_ENCODING} ---")

    s_conv, s_err, s_skip = process_directory(STUDENT_DIR, SORTED_GROUPS, "студентов")
    t_conv, t_err, t_skip = process_directory(TEACHER_DIR, SORTED_TEACHERS, "преподавателей")

    print("\n--- Конвертация и переименование завершены! ---")
    print("--- Итоги по СТУДЕНТАМ: ---")
    print(f"Успешно обработано: {s_conv} файлов.")
    print(f"Пропущено (ошибки или не найдены): {s_err} файлов.")
    print(f"Пропущено (конфликт дубликатов): {s_skip} файлов.")
    print("--- Итоги по ПРЕПОДАВАТЕЛЯМ: ---")
    print(f"Успешно обработано: {t_conv} файлов.")
    print(f"Пропущено (ошибки или не найдены): {t_err} файлов.")
    print(f"Пропущено (конфликт дубликатов): {t_skip} файлов.")