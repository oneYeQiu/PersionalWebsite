@echo off
echo 正在安装依赖...
call npm install

echo 正在生成 Prisma 客户端...
call npx prisma generate

echo 正在推送数据库 schema...
call npx prisma db push

echo 正在初始化数据库...
call npx ts-node --compiler-options "{\"module\":\"CommonJS\"}" prisma/seed.ts

echo 数据库设置完成！
pause
