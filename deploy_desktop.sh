#!/bin/bash

source_dir="./build"
target_dir="../wapl-shell/public/apps"
app_name="talk"

app_path="$target_dir/$app_name"

# 타겟 디렉토리의 파일들 삭제
if [ -d "$app_path" ]; then
    rm -rf "$app_path"/*
else
    mkdir -p "$app_path"
fi


# 소스 디렉토리의 파일들을 타겟 디렉토리로 복사
cp -r "$source_dir"/* "$app_path" 2>&1 | while read -r line; do
    echo "Error: $line"
done

echo "데스크탑 복사 작업 완료"