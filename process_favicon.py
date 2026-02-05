from PIL import Image
import os

def process_favicon(input_path, output_path):
    print(f"Processing: {input_path}")
    img = Image.open(input_path).convert("RGBA")
    
    # Get bounding box of content with significant opacity (alpha > 50)
    # This filters out soft shadows which usually have low alpha
    datas = img.getdata()
    newData = []
    
    # Agessively remove semi-transparent pixels (shadows)
    # Only keep pixels that are mostly opaque (alpha > 200) to ensure sharp edges and no shadow fuzz
    # This effectively removes the shadow halo
    bbox = img.getbbox()
    if not bbox:
        print("Image is empty")
        return

    # Create a mask for thresholding
    # We want to find the tight bounding box of the MAIN ICON, avoiding the subtle shadow.
    # Shadows usually taper off. Let's start by scanning for the "hard" object.
    
    target_alpha_threshold = 100 # Adjust this to cut off shadow. 
    
    # Manual bbox finding
    width, height = img.size
    left, top, right, bottom = width, height, 0, 0
    
    has_content = False
    for y in range(height):
        for x in range(width):
            r, g, b, a = img.getpixel((x, y))
            if a > target_alpha_threshold:
                if x < left: left = x
                if x > right: right = x
                if y < top: top = y
                if y > bottom: bottom = y
                has_content = True
                
    if not has_content:
        print("No content found above threshold")
        return

    # Add a tiny padding to not cut off anti-aliasing
    margin = 2
    left = max(0, left - margin)
    top = max(0, top - margin)
    right = min(width, right + margin)
    bottom = min(height, bottom + margin)
    
    # Crop to the tight bounding box of the solid icon
    cropped = img.crop((left, top, right, bottom))
    
    # Now resize this cropped icon to fill a 512x512 canvas
    # We want it to be MAX size, maybe 500x500 within 512x512
    final_size = (512, 512)
    final_img = Image.new("RGBA", final_size, (0, 0, 0, 0))
    
    # Scale cropped image to fit 512x512 preserving aspect ratio
    # Actually, the icon is roughly square, let's make it fit tightly.
    # We want "Size too small" to be fixed -> Fill almost 100%
    
    # Calculate scale to fit 512x512 with minimal padding (say 1px)
    target_w, target_h = 512, 512
    
    ratio = min(target_w / cropped.width, target_h / cropped.height)
    new_size = (int(cropped.width * ratio), int(cropped.height * ratio))
    
    resized_icon = cropped.resize(new_size, Image.Resampling.LANCZOS)
    
    # Paste centered
    paste_x = (final_size[0] - new_size[0]) // 2
    paste_y = (final_size[1] - new_size[1]) // 2
    
    final_img.paste(resized_icon, (paste_x, paste_y))
    
    final_img.save(output_path)
    print(f"Saved processed favicon to {output_path}")

    # Also generate small sizes
    final_img.resize((32, 32), Image.Resampling.LANCZOS).save(output_path.replace("favicon.png", "favicon-32x32.png"))
    final_img.resize((192, 192), Image.Resampling.LANCZOS).save(output_path.replace("favicon.png", "android-chrome-192x192.png"))
    final_img.resize((512, 512), Image.Resampling.LANCZOS).save(output_path.replace("favicon.png", "android-chrome-512x512.png"))
    final_img.resize((180, 180), Image.Resampling.LANCZOS).save(output_path.replace("favicon.png", "apple-touch-icon.png"))

# Use the latest 3D image we generated
# C:/Users/Admin/.gemini/antigravity/brain/83c5267e-19ff-4376-bc4e-4491ba326cc5/favicon_3d_clean_1770254923677.png
# Wait, let's use the path relative to CWD if possible, or absolute.
input_path = r"C:\Users\Admin\.gemini\antigravity\brain\83c5267e-19ff-4376-bc4e-4491ba326cc5\favicon_3d_clean_1770254923677.png"
output_path = r"c:\Users\Admin\Desktop\Ai\LICH\lich\LICH PRO\public\favicon.png"

process_favicon(input_path, output_path)
