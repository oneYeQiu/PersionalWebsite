#!/bin/bash
echo "正在安装依赖..."
npm install

echo "正在生成 Prisma 客户端..."
npx prisma generate

echo "正在推送数据库 schema..."
npx prisma db push

echo "正在初始化数据库..."
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts

echo "数据库设置完成！"
