import subprocess  # 파이썬 파일(조선,동아,이데일리 등등)을 실행하기 위한 모듈crawlers
import datetime    # 현재 시간(타임스탬프) 기록
import traceback   # 에러 발생 시 전체 예외 정보를 문자열로 출력하기 위한 모듈

#실행목록
crawler_files = [
    # "C:/develop/project/Findy/Findy-main/findy-crawler/crawlers/donga.py",
    "C:/develop/project/Findy/Findy-main/findy-crawler/crawlers/khan.py",
    "C:/develop/project/Findy/Findy-main/findy-crawler/crawlers/hankyung.py",
    "C:/develop/project/Findy/Findy-main/findy-crawler/crawlers/chosun.py",
    "C:/develop/project/Findy/Findy-main/findy-crawler/crawlers/edaily.py",
    "C:/develop/project/Findy/Findy-main/findy-crawler/crawlers/hani.py"
]

log_path = "testlog.txt" # 크롤링 시작과 끝을 각각 로그로 저장장

# 로그 파일 기록 시작
with open(log_path, "a", encoding="utf-8") as log:
    # 전체 크롤링 시작 시간 기록
    log.write(f"\n[{datetime.datetime.now()}] === 전체 크롤링 시작 ===\n")

    # 크롤러 파일들을 하나씩 순서대로 실행
    for file in crawler_files:
        try:
            # 각 파일의 실행 시작 시간 기록
            log.write(f"[{datetime.datetime.now()}] ▶ {file} 실행 시작\n")
            
            # subprocess.run을 사용해 해당 파일을 python 명령어로 실행
            # check=True 옵션으로 에러 발생 시 예외 발생하도록 설정
            subprocess.run(["python", file], check=True)

            # 실행이 문제없이 끝났을 경우 완료 로그 기록
            log.write(f"[{datetime.datetime.now()}]  {file} 실행 완료\n")
        
        except subprocess.CalledProcessError as e:
            # 실행 도중 에러 발생 시 실패 로그 기록
            log.write(f"[{datetime.datetime.now()}]  {file} 실행 실패\n")
            
            # traceback 모듈을 사용해 전체 에러 내용 기록
            log.write(traceback.format_exc())

    # 전체 크롤링 종료 시간 기록
    log.write(f"[{datetime.datetime.now()}] === 전체 크롤링 종료 ===\n")