
![header](https://capsule-render.vercel.app/api?type=transparent&height=300&section=header&text=Trading%20Bot%20BitGet&fontSize=90&fontColor=ffffff)

## Introduce

비트코인 시세 알림 봇을 만들고 싶었다.   
자동매매는 리스크가 있어 눈으로 확인을 하고 직접 매매하는게 낫겠다고 판단했다.   
따라서 내가 원하는 알고리즘을 적용하여 기준을 통과하는 시세가 나오면 Telegram으로 알림을 보내주는 프로그램이다.   

## Trading algorithm
- fastStochastic : 과매수/과매도 구간을 확인하는 보조지표
- Doji Candle : 매수/매도 방향 변곡점을 예측할 수 있는 캔들 확인 알고리즘

## Tech
- Javascript, Electron, BitGet API

## To-do
알고리즘 다양화

--- 

![image](https://github.com/user-attachments/assets/334e3569-5a95-46b6-86d8-4d40945ac5c1)
   
![image](https://github.com/user-attachments/assets/a4d74bfb-7b76-41d2-9591-52416e37e8f2)
