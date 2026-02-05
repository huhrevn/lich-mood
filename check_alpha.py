from PIL import Image
import sys

try:
    img = Image.open(r"c:\Users\Admin\Desktop\Ai\LICH\lich\LICH PRO\public\favicon.png").convert("RGBA")
    print(f"Image mode: {img.mode}")
    print(f"Image size: {img.size}")
    
    # Check 4 corners
    corners = [
        (0, 0),
        (img.width - 1, 0),
        (0, img.height - 1),
        (img.width - 1, img.height - 1)
    ]
    
    print("Corner pixel alpha values:")
    for x, y in corners:
        pixel = img.getpixel((x, y))
        print(f"Pixel at ({x}, {y}): {pixel}")
        
    # Check if there are ANY transparent pixels
    alphas = [p[3] for p in img.getdata()]
    min_alpha = min(alphas)
    max_alpha = max(alphas)
    print(f"Min Alpha: {min_alpha}, Max Alpha: {max_alpha}")
    
    # Check borders explicitly (walk inward until alpha > 0)
    # Just sample a few points
    
except Exception as e:
    print(f"Error: {e}")
