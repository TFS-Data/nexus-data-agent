import asyncio
import httpx
import json

async def test_stream():
    async with httpx.AsyncClient() as client:
        payload = {
            "messages": [{"role": "user", "content": "Olá"}],
            "temperature": 0.7,
            "max_tokens": 100
        }
        async with client.stream("POST", "http://127.0.0.1:8000/api/v1/chat/stream", json=payload) as response:
            print("Status:", response.status_code)
            async for chunk in response.aiter_text():
                print("Chunk:", chunk)

asyncio.run(test_stream())
