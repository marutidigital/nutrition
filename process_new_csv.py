import csv
import re
import sys

def parse_images(images_str):
    if not images_str:
        return '{}'
    urls = [u.strip() for u in images_str.split(',') if u.strip()]
    if not urls:
        return '{}'
    # Escape quotes for Postgres array format
    return '{' + ','.join([f'"{u.replace(chr(34), chr(34)+chr(34))}"' for u in urls]) + '}'

def parse_flavors(row):
    # Check if Attribute 1 is Flavours
    attr_name = row.get('Attribute 1 name', '')
    attr_val = row.get('Attribute 1 value(s)', '')
    
    if attr_name and 'FLAVOUR' in attr_name.upper() and attr_val:
        flavors = [f.strip() for f in attr_val.split(',') if f.strip()]
        return '{' + ','.join([f'"{f.replace(chr(34), chr(34)+chr(34))}"' for f in flavors]) + '}'
        
    return '{}'

def parse_tags(tags_str):
    if not tags_str:
        return '{}'
    tags = [t.strip() for t in tags_str.split(',') if t.strip()]
    return '{' + ','.join([f'"{t.replace(chr(34), chr(34)+chr(34))}"' for t in tags]) + '}'

def generate_slug(name):
    slug = name.lower()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    slug = re.sub(r'(^-|-$)', '', slug)
    return slug

def map_category(name, category, desc_short, desc_long):
    name_lower = name.lower()
    category_lower = category.lower()
    desc_lower = (desc_short + ' ' + desc_long).lower()
    combined = f"{name_lower} {category_lower} {desc_lower}"
    
    # 1. Creatine
    if 'creatine' in name_lower or 'creatine' in category_lower:
        return 'CREATINE'
    # 2. Ashwagandha
    if 'ashwagandha' in name_lower:
        return 'ASHWAGANDHA'
    # 3. Omega 3
    if 'omega' in name_lower:
        return 'OMEGA 3'
    # 4. Accessories & Apparel
    if 'shaker' in name_lower or 'cap' in name_lower or 'bag' in name_lower or 'tshirt' in name_lower or 't-shirt' in name_lower or 'hat' in name_lower:
        return 'Accessories'
    # 5. Snacks / Food
    if 'snack' in name_lower or 'cookie' in name_lower or 'bar' in name_lower:
        return 'SNACKS'
        
    # 6. Whey / Isolate vs Proteins
    if 'isolate' in name_lower or 'pure whey' in name_lower or 'concentrate' in name_lower or 'wpc80' in name_lower or 'bulk' in name_lower:
        return 'WHEY/ISOLATE'
    if 'protein' in combined or 'amino' in combined or 'eaa' in combined or 'bcaa' in combined:
        if 'gainer' in combined or 'weight gainer' in combined:
            return 'Mass Gainer'
        return 'Proteins'
        
    # 7. Pre Workout
    if 'preworkout' in combined or 'pre-workout' in combined or 'pre workout' in combined or 'before workout' in combined or 'experiment' in combined or 'infected' in combined:
        return 'Pre Workout'
    # 8. Post Workout / Recovery
    if 'postworkout' in combined or 'post-workout' in combined or 'post workout' in combined or 'savior' in combined:
        return 'Post Workout'
    if 'recovery' in combined or 'sleep' in combined or 'escape' in combined or 'calibration' in combined:
        return 'ÉNERGIE - RÉCUPÉRATION'
        
    # 9. Weight Loss
    if 'burn' in combined or 'weight loss' in combined or 'diuretic' in combined or 'shred' in combined or 'amputation' in combined or 'stage' in combined or 'recharge' in combined:
        return 'Weight Loss'
        
    # 10. Vitamins & Minerals
    if 'vitamin' in combined or 'mineral' in combined or 'collagen' in combined or 'organics' in combined:
        return 'Vitamins & Minerals'
        
    # 11. Mass Gainer
    if 'gainer' in combined or 'mass' in combined:
        return 'Mass Gainer'
        
    # 12. Accessories (fallback)
    if 'gear' in combined or 'accessories' in combined or 'accessoires' in combined:
        return 'Accessories'
        
    return 'Proteins'

def process_csv(input_file, output_file):
    mapped_data = []
    used_slugs = set()
    
    with open(input_file, mode='r', encoding='utf-8-sig') as infile:
        reader = csv.DictReader(infile)
        rows = list(reader)
        print(f"Found {len(rows)} rows.")
        
        for idx, row in enumerate(rows):
            name = row.get('Name', '')
            # Skip variations since Supabase schema maps them under main products using flavors or subattributes
            if row.get('Type') == 'variation':
                continue
                
            # If name is empty, skip
            if not name:
                continue
                
            desc_short = row.get('Short description', '')
            desc_long = row.get('Description', '')
            category = row.get('Categories', '').split(',')[0].strip() if row.get('Categories') else ''
            
            category_en = map_category(name, category, desc_short, desc_long)

            # Extract price logic: if sale price exists, use it as main price and regular price as original price
            sale_price = row.get('Sale price', '').strip().replace(',', '.')
            reg_price = row.get('Regular price', '').strip().replace(',', '.')
            
            if sale_price:
                price = sale_price
                price_orig = reg_price
            else:
                price = reg_price or '0.00'
                price_orig = None
            
            stock_str = row.get('Stock', '0').strip()
            try:
                stock_quantity = int(float(stock_str)) if stock_str else 0
            except ValueError:
                stock_quantity = 0
                
            in_stock = stock_quantity > 0 or row.get('In stock?') == '1'
            is_featured = row.get('Is featured?') == '1'
            
            weight_str = row.get('Weight (kg)', '0').strip().replace(',', '.')
            try:
                weight_g = int(float(weight_str) * 1000) if weight_str else 0
            except ValueError:
                weight_g = 0

            slug = generate_slug(name)
            if slug in used_slugs:
                slug = f"{slug}-{row.get('ID')}"
            used_slugs.add(slug)

            mapped_data.append({
                'sku': row.get('SKU') or f"SKU-{row.get('ID')}",
                'name': name,
                'brand': row.get('Brands', ''),
                'slug': slug,
                'description_short': desc_short,
                'description_long': desc_long,
                'category': category_en,
                'subcategory': '',
                'price': price,
                'price_original': price_orig if price_orig else '',
                'currency': 'CHF',
                'weight_g': weight_g,
                'flavors': parse_flavors(row),
                'images': parse_images(row.get('Images')),
                'in_stock': str(in_stock).lower(),
                'is_featured': str(is_featured).lower(),
                'is_new': 'false',
                'badge_text': '',
                'badge_color': '#c8102e',
                'rating': 0.0,
                'review_count': 0,
                'tags': parse_tags(row.get('Tags'))
            })
            
    if not mapped_data:
        print("No data parsed.")
        return

    # Write to new CSV
    fieldnames = [
        'sku', 'name', 'brand', 'slug', 'description_short', 'description_long',
        'category', 'subcategory', 'price', 'price_original', 'currency', 'weight_g',
        'flavors', 'images', 'in_stock', 'is_featured', 'is_new',
        'badge_text', 'badge_color', 'rating', 'review_count', 'tags'
    ]
    
    with open(output_file, mode='w', encoding='utf-8', newline='') as outfile:
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()
        for data in mapped_data:
            writer.writerow(data)
            
    print(f"Successfully generated {output_file} with {len(mapped_data)} products!")

if __name__ == '__main__':
    process_csv('new prduct list.csv', 'new_products_mapped.csv')
