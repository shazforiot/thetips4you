from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pathlib import Path
out=Path(__file__).resolve().parents[1]/'public'/'og-cover.png'
w,h=1200,630
im=Image.new('RGB',(w,h),(17,19,16)); d=ImageDraw.Draw(im)
for y in range(h):
    t=y/h
    d.line((0,y,w,y),fill=(int(17+13*t),int(19+12*t),int(16+10*t)))
for x in range(0,w,40): d.line((x,0,x,h),fill=(31,35,29),width=1)
for y in range(0,h,40): d.line((0,y,w,y),fill=(31,35,29),width=1)
glow=Image.new('RGBA',(w,h),(0,0,0,0)); g=ImageDraw.Draw(glow)
for r in range(360,10,-8):
    a=int(28*(1-r/360))
    g.ellipse((840-r,325-r,840+r,325+r),fill=(255,120,73,a))
glow=glow.filter(ImageFilter.GaussianBlur(40)); im=Image.alpha_composite(im.convert('RGBA'),glow)
d=ImageDraw.Draw(im)
orange=(255,120,73); white=(241,240,233); muted=(179,190,172)
font='/Windows/Fonts/bahnschrift.ttf'
if not Path(font).exists(): font='C:/Windows/Fonts/bahnschrift.ttf'
f_brand=ImageFont.truetype(font,37); f_small=ImageFont.truetype(font,24); f_big=ImageFont.truetype(font,92); f_body=ImageFont.truetype(font,33)
d.rounded_rectangle((68,65,123,120),radius=9,outline=orange,width=3)
d.text((81,76),'›_',font=f_brand,fill=orange)
d.text((142,70),'thetips',font=f_brand,fill=white)
d.text((254,70),'4',font=f_brand,fill=orange)
d.text((275,70),'you.',font=f_brand,fill=white)
d.text((70,200),'PRACTICAL VIDEO GUIDES',font=f_small,fill=orange,spacing=3)
d.text((65,253),'AI coding',font=f_big,fill=white)
d.text((65,352),'agents.',font=f_big,fill=orange)
d.text((70,490),'Claude Code  ·  OpenCode  ·  Codex  ·  MCP',font=f_body,fill=muted)
d.line((68,572,1132,572),fill=(74,82,68),width=2)
d.text((70,585),'THETIPS4YOU.IN',font=ImageFont.truetype(font,19),fill=muted)
im.convert('RGB').save(out,optimize=True)
print(out)
