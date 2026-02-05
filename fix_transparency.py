from PIL import Image
import os

def remove_background_floodfill(input_path, output_path):
    print(f"Opening {input_path}")
    img = Image.open(input_path).convert("RGBA")
    
    width, height = img.size
    pixels = img.load()
    
    # Identify background color from the top-left corner
    bg_color = pixels[0, 0]
    print(f"Detected background color: {bg_color}")
    
    # Flood fill algorithm (BFS)
    # Start from corners to be safe
    queue = [(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)]
    visited = set(queue)
    
    tolerance = 40  # Increased tolerance to catch shadows/artifacts
    
    def is_close(c1, c2):
        # Check RGB distance
        return abs(c1[0] - c2[0]) < tolerance and \
               abs(c1[1] - c2[1]) < tolerance and \
               abs(c1[2] - c2[2]) < tolerance

    count = 0
    while queue:
        x, y = queue.pop(0)
        
        if not (0 <= x < width and 0 <= y < height):
            continue
            
        current = pixels[x, y]
        
        # If alpha is already 0, skip
        if current[3] == 0:
            continue
            
        if is_close(current, bg_color):
            pixels[x, y] = (0, 0, 0, 0) # Make transparent
            count += 1
            
            # Check 4 neighbors
            for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < width and 0 <= ny < height:
                    if (nx, ny) not in visited:
                        visited.add((nx, ny))
                        queue.append((nx, ny))
    
    print(f"Made {count} pixels transparent.")

    # Now crop tight
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    # Resize to valid favicon size (512x512)
    final_size = (512, 512)
    final_img = Image.new("RGBA", final_size, (0, 0, 0, 0))
    
    # Scale to fit 100%
    ratio = min(512 / img.width, 512 / img.height)
    new_size = (int(img.width * ratio), int(img.height * ratio))
    img_resized = img.resize(new_size, Image.Resampling.LANCZOS)
    
    pos = ((512 - new_size[0]) // 2, (512 - new_size[1]) // 2)
    final_img.paste(img_resized, pos)
    
    # Save main file
    final_img.save(output_path)
    print(f"Saved: {output_path}")
    
    # Save variants with -clean suffix to bust cache
    base = os.path.splitext(output_path)[0]
    # We want file names like: favicon-clean-32x32.png
    
    final_img.resize((32, 32), Image.Resampling.LANCZOS).save(f"{base}-32x32.png")
    final_img.resize((192, 192), Image.Resampling.LANCZOS).save(f"{base}-192x192.png")
    final_img.resize((512, 512), Image.Resampling.LANCZOS).save(f"{base}-512x512.png")
    final_img.resize((180, 180), Image.Resampling.LANCZOS).save(f"{base}-180x180.png")

input_path = r"c:\Users\Admin\Desktop\Ai\LICH\lich\LICH PRO\public\favicon.png"
# New filename to force browser to re-download
output_path = r"c:\Users\Admin\Desktop\Ai\LICH\lich\LICH PRO\public\favicon-clean.png"

remove_background_floodfill(input_path, output_path)
