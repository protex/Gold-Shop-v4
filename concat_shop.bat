if exist test.js erase test.js
type main.js >> test.js
echo. >> test.js
echo. >> test.js
type items.js >> test.js
echo. >> test.js
echo. >> test.js
type userData.js >> test.js
start /wait Main_Insert.exe
findstr /rvc:"^ *// " "gShop.dev.js" >"noComment1.js"
findstr /rvc:"^ *\*/" "noComment1.js" > "noComment2.js"
findstr /rvc:"^ */\*" "noComment2.js" > "noComment3.js"
findstr /rvc:"^ *\*" "noComment3.js" > "gShop.full.js"
type Copyright.txt gShop.full.js > temp.txt
del gShop.full.js
rename temp.txt gShop.full.js
type gShop.full.js | clip
del test1.js
del test.js
del noComment1.js
del noComment2.js
del noComment3.js