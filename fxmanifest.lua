game("gta5")
fx_version("cerulean")

version("1.0.0")
author("Zerio")
description("W.I.P Voice system for FiveM")

client_script("dist/client/client.js")
server_script("dist/server/server.js")

files({
	"dist/html/index.html",
	"dist/html/assets/*.css",
	"dist/html/assets/*.js",
})

ui_page("dist/html/index.html")
-- ui_page("http://localhost:5173")