import os, re
root = os.path.dirname(__file__)
img_dir = os.path.join(root, 'img')
index_file = os.path.join(root, 'index.html')

# Build map of old -> new names
changes = []
for name in os.listdir(img_dir):
    if not name.lower().endswith('.mp4'):
        continue
    new = re.sub(r"[\s\(\)]", '_', name)
    # Collapse multiple underscores
    new = re.sub(r'_+', '_', new)
    # Trim leading/trailing underscores
    new = new.strip('_')
    if new != name:
        old_path = os.path.join(img_dir, name)
        new_path = os.path.join(img_dir, new)
        if os.path.exists(new_path):
            print(f"Skipping rename because target exists: {new}")
        else:
            print(f"Renaming: {name} -> {new}")
            os.rename(old_path, new_path)
            changes.append((name, new))

# Update index.html
if changes and os.path.exists(index_file):
    with open(index_file, 'r', encoding='utf-8') as f:
        html = f.read()
    for old, new in changes:
        html = html.replace(old, new)
    with open(index_file, 'w', encoding='utf-8') as f:
        f.write(html)
    print('Updated index.html with new filenames')
else:
    print('No changes required')
