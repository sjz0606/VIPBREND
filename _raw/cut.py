import cv2,numpy as np,sys
from PIL import Image
for n in ['vetrofka','svitshot','kurtka']:
    a=np.array(Image.open(f'_raw/gen/{n}.png').convert('RGB'));h,w=a.shape[:2]
    m=np.zeros((h+2,w+2),np.uint8);flag=4|(255<<8)|cv2.FLOODFILL_MASK_ONLY|cv2.FLOODFILL_FIXED_RANGE
    g=cv2.cvtColor(a,cv2.COLOR_RGB2BGR)
    for p in [(0,0),(w-1,0),(0,h-1),(w-1,h-1),(w//2,h-1),(0,h//2),(w-1,h//2)]:
        cv2.floodFill(g,m,p,(0,0,0),(14,14,14),(14,14,14),flag)
    bg=m[1:-1,1:-1]
    al=255-bg
    al=cv2.erode(al,np.ones((3,3),np.uint8));al=cv2.GaussianBlur(al,(0,0),1.1)
    out=np.dstack([a,al]);ys,xs=np.where(al>10)
    print(n,a.shape,'kept',round((al>128).mean(),3),xs.min(),xs.max(),ys.min(),ys.max())
    Image.fromarray(out).resize((900,1200),Image.LANCZOS).save(f'assets/g/{n}.webp',quality=88)
